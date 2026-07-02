'use server'

import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

import { siteConfig } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

export type ProviderInquiryFormState = {
  success: boolean
  message: string
}

type PublishedProviderRow = {
  id: string
  slug: string
  name: string
  email: string | null
  status: string
}

type InquiryStatus = 'sent' | 'failed'

const genericErrorState: ProviderInquiryFormState = {
  success: false,
  message: 'Something went wrong. Please try again.',
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === 'string' ? value.trim() : ''
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) return null

  return new Resend(apiKey)
}

function getFromEmail() {
  return process.env.RESEND_FROM_EMAIL || 'Willa <hello@willamom.com>'
}

function getCopyEmail() {
  return process.env.WILLA_INQUIRY_COPY_EMAIL || ''
}

function buildProviderProfileUrl(providerSlug: string) {
  return `${siteConfig.url}/providers/${providerSlug}`
}

function buildProviderEmailHtml({
  senderName,
  senderEmail,
  senderStage,
  message,
  providerProfileUrl,
}: {
  providerName: string
  senderName: string
  senderEmail: string
  senderStage: string
  message: string
  providerProfileUrl: string
}) {
  const safeProviderProfileUrl = escapeHtml(providerProfileUrl)

  return `
    <div style="font-family: Arial, sans-serif; color: #211f1b; line-height: 1.6; max-width: 640px;">
      <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #a45f51; font-weight: 700;">
        New message through Willa
      </p>

      <div style="background: #ffffff; border: 1px solid #e2d7c8; border-radius: 18px; padding: 20px; margin: 20px 0;">
        <p style="font-size: 16px; margin-top: 0;">
          Hi! I found your profile on <a href="${safeProviderProfileUrl}" style="color: #4f5d3d; font-weight: 700;">willamom.com</a> while looking for support during pregnancy/postpartum. I'd love to learn more about your services.
        </p>

        ${
          message
            ? `<p style="font-size: 16px; white-space: pre-wrap;">${escapeHtml(
                message
              )}</p>`
            : ''
        }
      </div>

      <div style="background: #fbf7ef; border: 1px solid #e2d7c8; border-radius: 18px; padding: 18px; margin: 24px 0;">
        <p><strong>Name:</strong> ${escapeHtml(senderName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(senderEmail)}</p>
        ${
          senderStage
            ? `<p><strong>Stage:</strong> ${escapeHtml(senderStage)}</p>`
            : ''
        }
      </div>

      <p style="font-size: 14px; color: #5f574d;">
        You can reply directly to this email to respond to ${escapeHtml(
          senderName
        )}.
      </p>

      <p style="font-size: 13px; color: #8a8277; margin-top: 28px;">
        Sent through Willa.
      </p>
    </div>
  `
}

function buildProviderEmailText({
  senderName,
  senderEmail,
  senderStage,
  message,
  providerProfileUrl,
}: {
  providerName: string
  senderName: string
  senderEmail: string
  senderStage: string
  message: string
  providerProfileUrl: string
}) {
  return [
    'New message through Willa',
    '',
    "Hi! I found your profile on willamom.com while looking for support during pregnancy/postpartum. I'd love to learn more about your services.",
    '',
    `Profile: ${providerProfileUrl}`,
    '',
    message,
    '',
    `Name: ${senderName}`,
    `Email: ${senderEmail}`,
    senderStage ? `Stage: ${senderStage}` : '',
    '',
    `You can reply directly to this email to respond to ${senderName}.`,
    '',
    'Sent through Willa.',
  ]
    .filter(Boolean)
    .join('\n')
}

async function saveInquiry({
  provider,
  senderName,
  senderEmail,
  senderStage,
  message,
  consentToShare,
  status,
}: {
  provider: PublishedProviderRow
  senderName: string
  senderEmail: string
  senderStage: string
  message: string
  consentToShare: boolean
  status: InquiryStatus
}) {
  const supabase = await createClient()

  const { error } = await supabase.from('provider_inquiries').insert({
    provider_id: provider.id,
    provider_slug: provider.slug,
    provider_name: provider.name,
    provider_email: provider.email,

    sender_name: senderName,
    sender_email: senderEmail,
    sender_stage: senderStage || null,
    message,

    consent_to_share: consentToShare,
    source: 'provider_profile',
    status,
  })

  if (error) {
    console.error('Provider inquiry save error:', error)
    return false
  }

  return true
}

export async function createProviderInquiryAction(
  _previousState: ProviderInquiryFormState,
  formData: FormData
): Promise<ProviderInquiryFormState> {
  const supabase = await createClient()

  const honeypot = getText(formData, 'company')

  if (honeypot) {
    return {
      success: true,
      message: 'Your message has been sent.',
    }
  }

  const providerSlug = getText(formData, 'provider_slug')
  const senderName = getText(formData, 'sender_name')
  const senderEmail = getText(formData, 'sender_email')
  const senderStage = getText(formData, 'sender_stage')
  const message = getText(formData, 'message')
  const consentToShare = formData.get('consent_to_share') === 'on'

  if (!providerSlug) {
    return {
      success: false,
      message: 'Provider missing. Please refresh and try again.',
    }
  }

  if (!senderName) {
    return {
      success: false,
      message: 'Please enter your name.',
    }
  }

  if (!senderEmail || !isValidEmail(senderEmail)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    }
  }

  if (message.length < 10) {
    return {
      success: false,
      message: 'Please write a short message.',
    }
  }

  if (!consentToShare) {
    return {
      success: false,
      message: 'Please confirm your message can be shared with the provider.',
    }
  }

  const { data, error: providerError } = await supabase
    .from('providers')
    .select('id, slug, name, email, status')
    .eq('slug', providerSlug)
    .eq('status', 'published')
    .single()

  const provider = data as PublishedProviderRow | null

  if (providerError || !provider) {
    return {
      success: false,
      message: 'This provider is not available right now.',
    }
  }

  if (!provider.email) {
    await saveInquiry({
      provider,
      senderName,
      senderEmail,
      senderStage,
      message,
      consentToShare,
      status: 'failed',
    })

    return {
      success: false,
      message: 'This provider is not accepting messages right now.',
    }
  }

  const resend = getResendClient()

  if (!resend) {
    console.error('Missing RESEND_API_KEY. Provider inquiry was not emailed.')

    await saveInquiry({
      provider,
      senderName,
      senderEmail,
      senderStage,
      message,
      consentToShare,
      status: 'failed',
    })

    return {
      success: false,
      message: 'Your message could not be sent right now. Please try again.',
    }
  }

  const providerProfileUrl = buildProviderProfileUrl(provider.slug)

  const emailPayload = {
    providerName: provider.name,
    senderName,
    senderEmail,
    senderStage,
    message,
    providerProfileUrl,
  }

  try {
    const copyEmail = getCopyEmail()
    const bcc =
      copyEmail && copyEmail !== provider.email ? [copyEmail] : undefined

    const { error: emailError } = await resend.emails.send({
      from: getFromEmail(),
      to: provider.email,
      bcc,
      replyTo: senderEmail,
      subject: 'New message from your Willa profile',
      html: buildProviderEmailHtml(emailPayload),
      text: buildProviderEmailText(emailPayload),
    })

    if (emailError) {
      console.error('Provider inquiry email error:', emailError)

      await saveInquiry({
        provider,
        senderName,
        senderEmail,
        senderStage,
        message,
        consentToShare,
        status: 'failed',
      })

      return {
        success: false,
        message: 'Your message could not be sent right now. Please try again.',
      }
    }

    await saveInquiry({
      provider,
      senderName,
      senderEmail,
      senderStage,
      message,
      consentToShare,
      status: 'sent',
    })

    revalidatePath('/admin')
    revalidatePath('/providers')
    revalidatePath(`/providers/${provider.slug}`)

    return {
      success: true,
      message: 'Your message has been sent.',
    }
  } catch (error) {
    console.error('Provider inquiry email exception:', error)

    await saveInquiry({
      provider,
      senderName,
      senderEmail,
      senderStage,
      message,
      consentToShare,
      status: 'failed',
    })

    return genericErrorState
  }
}
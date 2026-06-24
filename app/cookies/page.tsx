import LegalPageLayout from '@/components/layout/LegalPageLayout'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Cookie & Storage Notice | ${siteConfig.name}`,
  description:
    'How Willa uses cookies and local storage for account access and saved planning features.',
}

export default function CookiesPage() {
  return (
    <LegalPageLayout
      eyebrow="Cookie & Storage Notice"
      title="How Willa remembers your planning."
    >
      <p>
        Willa uses essential cookies and similar browser storage to provide
        account access, keep you signed in, remember your preferences, and save
        your planning progress.
      </p>

      <p>
        These may include authentication cookies from Supabase, which help Willa
        know when you are signed in and connect your saved profile, guides,
        questions, care plan, registry ideas, and support options to your
        account.
      </p>

      <p>
        Willa may also use local browser storage as a fallback when you are not
        signed in, so that demo or preview planning items can stay on your
        device.
      </p>

      <p>
        At launch, Willa does not use advertising cookies, remarketing pixels,
        or third-party tracking cookies.
      </p>

      <p>
        If Willa adds analytics, advertising pixels, or other non-essential
        tracking tools in the future, we will update this notice and add consent
        controls where required.
      </p>

      <p>
        You can clear cookies and local storage through your browser settings.
        Clearing them may sign you out or remove locally saved preview data.
      </p>

      <p>
        Some product or registry links may lead to third-party websites. Those
        websites may use their own cookies or tracking according to their own
        policies.
      </p>

      <p>
        For questions, contact{' '}
        <a
          href={`mailto:${siteConfig.email}`}
          className="font-semibold text-[#4f5d3d] hover:text-[#211f1b]"
        >
          {siteConfig.email}
        </a>
        .
      </p>
    </LegalPageLayout>
  )
}
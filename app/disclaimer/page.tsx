import LegalPageLayout from '@/components/layout/LegalPageLayout'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Disclaimer | ${siteConfig.name}`,
  description:
    'Important information about how to use Willa and when to seek medical, mental health, or emergency support.',
}

export default function DisclaimerPage() {
  return (
    <LegalPageLayout
      eyebrow="Disclaimer"
      title="Willa is support, not medical advice."
    >
      <p>
        Willa provides general educational content, planning tools, saved
        questions, registry ideas, and support organization for pregnancy,
        birth, postpartum, and motherhood.
      </p>

      <p>
        Willa does not provide medical advice, diagnosis, treatment, emergency
        support, mental health crisis care, or professional healthcare services.
      </p>

      <p>
        Always speak with your doctor, midwife, pediatrician, lactation
        consultant, therapist, or another qualified professional about your
        specific situation.
      </p>

      <p>
        If you are experiencing a medical emergency, severe pain, heavy
        bleeding, chest pain, trouble breathing, thoughts of harming yourself or
        someone else, or any urgent concern, seek emergency help immediately
        through your local emergency number.
      </p>

      <p>
        Content on Willa may include product, registry, service, or support
        suggestions. These are for organization and education only. You are
        responsible for deciding what is appropriate for your family.
      </p>
    </LegalPageLayout>
  )
}
import LegalPageLayout from '@/components/layout/LegalPageLayout'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description: 'How Willa handles account, profile, and saved planning data.',
}

export default function PrivacyPage() {
  return (
    <LegalPageLayout eyebrow="Privacy Policy" title="Your Willa is personal.">
      <p>
        Willa collects the information you choose to provide, such as your name,
        due date, location, saved guides, saved questions, care plan tasks,
        registry ideas, and saved support options.
      </p>

      <p>
        We use this information to provide your account, personalize your
        profile, save your planning progress, and improve the Willa experience.
      </p>

      <p>
        Willa uses Supabase for authentication and data storage. Your saved
        information is connected to your account when you are signed in.
      </p>

      <p>
        We do not sell your personal information. We may use basic product
        analytics later to understand how Willa is used and how to improve it.
      </p>

      <p>
        Some future registry or product links may be affiliate links. If you
        choose to click or purchase through those links, the destination site
        may collect information according to its own privacy policy.
      </p>

      <p>
        To request deletion or support with your account, contact us at{' '}
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
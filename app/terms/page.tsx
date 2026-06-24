import LegalPageLayout from '@/components/layout/LegalPageLayout'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `Terms | ${siteConfig.name}`,
  description: 'Terms for using Willa.',
}

export default function TermsPage() {
  return (
    <LegalPageLayout eyebrow="Terms" title="Terms for using Willa.">
      <p>
        By using Willa, you agree to use the platform for personal planning,
        educational, and organizational purposes.
      </p>

      <p>
        Willa does not provide medical, legal, financial, mental health, or
        emergency advice. You are responsible for speaking with qualified
        professionals about your specific needs.
      </p>

      <p>
        You are responsible for the information you enter into Willa, including
        saved questions, care plan tasks, registry ideas, and support options.
      </p>

      <p>
        Willa may include links to third-party websites, products, services, or
        resources. We are not responsible for third-party content, policies,
        purchases, services, or availability.
      </p>

      <p>
        Willa is an early product and may change over time. Features, wording,
        categories, and availability may be updated as the product improves.
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
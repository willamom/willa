import AdminProviderInquiriesTable from '@/components/admin/provider-inquiries/AdminProviderInquiriesTable'
import {
  getAdminProviderInquiries,
  updateProviderInquiryStatusAction,
} from '@/lib/admin/provider-inquiries'

export const metadata = {
  title: 'Provider Inquiries Admin | Willa',
}

export default async function AdminProviderInquiriesPage() {
  const inquiries = await getAdminProviderInquiries()

  return (
    <main className="min-h-screen bg-[#fbf7ef] px-5 py-8 text-[#211f1b] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <AdminProviderInquiriesTable
          inquiries={inquiries}
          updateStatusAction={updateProviderInquiryStatusAction}
        />
      </div>
    </main>
  )
}
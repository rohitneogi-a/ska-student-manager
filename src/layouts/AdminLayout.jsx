import AdminHeader from "../components/admin/AdminHeader"

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#dbe7e4] via-[#c7e3dc] to-[#dbe7e4]">
      <AdminHeader />
      <main className="pt-18">
        {children}
      </main>
    </div>
  )
}
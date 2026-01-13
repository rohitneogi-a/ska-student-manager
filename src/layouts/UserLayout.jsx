import UserHeader from "../components/user/UserHeader"

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbe7e4] via-[#c7e3dc] to-[#dbe7e4]">
      <UserHeader />
      <main className="pt-18">
        {children}
      </main>
    </div>
  )
}
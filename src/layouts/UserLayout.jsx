import UserHeader from "../components/user/UserHeader"

export default function UserLayout({ children }) {
  return (
    <div>
      <UserHeader />
      <main>
        {children}
      </main>
    </div>
  )
}
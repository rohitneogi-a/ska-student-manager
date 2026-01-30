
import ModeratorHeader from "../components/moderator/ModeratorHeader"

export default function ModeratorLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#dbe7e4] via-[#c7e3dc] to-[#dbe7e4]">
      <ModeratorHeader />
      <main className="pt-18">
        {children}
      </main>
    </div>
  )
}
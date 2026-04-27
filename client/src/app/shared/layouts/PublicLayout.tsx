import { Outlet } from 'react-router-dom'
import { PublicNavbar } from '../ui/PublicNavbar'
import { PublicFooter } from '../ui/PublicFooter'
import { AiAssistantWidget } from '../ui/AiAssistantWidget'
import { BookingModal } from '../ui/BookingModal'

export function PublicLayout() {
  return (
    <div className="min-h-dvh text-slate-900 dark:text-slate-50">
      <PublicNavbar />
      <main className="pb-16">
        <Outlet />
      </main>
      <PublicFooter />
      <BookingModal />
      <AiAssistantWidget />
    </div>
  )
}


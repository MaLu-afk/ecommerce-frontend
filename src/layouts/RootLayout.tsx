import { Outlet } from 'react-router-dom'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

export default function RootLayout() {
  return (
    <div className="min-h-screen supports-[min-height:100dvh]:min-h-[100dvh] flex flex-col bg-white text-slate-800 antialiased">
      <Header />

      <main role="main" className="flex-1">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}

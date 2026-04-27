import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '../shared/layouts/PublicLayout'
import { NotFoundPage } from '../shared/pages/NotFoundPage'
import { HomePage } from '../web/pages/HomePage'
import { DestinationsPage } from '../web/pages/DestinationsPage'
import { DestinationDetailsPage } from '../web/pages/DestinationDetailsPage'
import { ToursPage } from '../web/pages/ToursPage'
import { HotelsPage } from '../web/pages/HotelsPage'
import { AboutPage } from '../web/pages/AboutPage'
import { ContactPage } from '../web/pages/ContactPage'
import { TourDetailsPage } from '../web/pages/TourDetailsPage'
import { AdminPage } from '../web/pages/AdminPage'
import { LoginPage } from '../web/pages/LoginPage'
import { RegisterPage } from '../web/pages/RegisterPage'
import { ForgotPasswordPage } from '../web/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '../web/pages/ResetPasswordPage'
import { UserDashboardPage } from '../web/pages/UserDashboardPage'
import { AdminLoginPage } from '../web/pages/AdminLoginPage'
import { RequireAdmin, RequireAuth } from '../shared/auth/RequireAuth'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'destinations', element: <DestinationsPage /> },
      { path: 'destinations/:slug', element: <DestinationDetailsPage /> },
      { path: 'tours', element: <ToursPage /> },
      { path: 'tours/:slug', element: <TourDetailsPage /> },
      { path: 'hotels', element: <HotelsPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      {
        path: 'dashboard',
        element: (
          <RequireAuth>
            <UserDashboardPage />
          </RequireAuth>
        ),
      },
      { path: 'admin/login', element: <AdminLoginPage /> },
      {
        path: 'admin',
        element: (
          <RequireAdmin>
            <AdminPage />
          </RequireAdmin>
        ),
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])


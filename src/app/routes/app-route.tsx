import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { APP_ROUTES } from '~/app/configs/routes.config'
import { STORAGE_KEY } from '~/app/configs/storage-key.config'
import MainLayout from '~/app/layouts/main-layout'
import Home from '~/app/pages/home'

import { hrRoute } from '~/app/routes/hr-route'

import { LoginResponseType } from '../types/auth/response/auth.type'
import { Login } from '../pages/auth'

// Temp fix
export const PrivateRoute = () => {
    const profile = JSON.parse(sessionStorage.getItem(STORAGE_KEY.SESSION_PROFILE) || '{}') as LoginResponseType
    if (!profile.token) {
        return <Navigate to='/login' />
    }
    return <Outlet />
}

export const PublicRoute = () => {
    const profile = JSON.parse(sessionStorage.getItem(STORAGE_KEY.SESSION_PROFILE) || '{}') as LoginResponseType
    if (profile.token) {
        return <Navigate to={APP_ROUTES.HOME} />
    }
    return <Outlet />
}
export default function AppRouter() {
    // Render Route Menu Catalog

    return useRoutes([
        // PublicRoute: redirect to home page if logged in
        {
            element: <PublicRoute />,
            children: [{ path: '/login', element: <Login /> }]
        },
        // PrivateRoute: redirect to login page if not logged in
        {
            element: <PrivateRoute />,
            children: [
                {
                    element: <MainLayout />,
                    children: [{ path: APP_ROUTES.HOME, element: <Home /> }, ...hrRoute]
                }
            ]
        }
    ])
}

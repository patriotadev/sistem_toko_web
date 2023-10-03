import { useRoutes } from "react-router-dom";
import SideMenu from '../layouts/SideMenu';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AuthGuard from "../middlewares/auth-guard";
import Stok from "../pages/Stok";

function Router() {
    const routes = [
        {
            path: '/',
            element: <SideMenu />,
            children: [
                {
                    path: '/',
                    element: 
                    <AuthGuard>
                        <Dashboard/>
                    </AuthGuard>
                },
                {
                    path: '/stok',
                    element: 
                    <AuthGuard>
                        <Stok/>
                    </AuthGuard>
                }
            ]
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Register />,
        },
    ]

    return useRoutes(routes);
}

export default Router;



import { useRoutes } from "react-router-dom";
import SideMenu from '../layouts/SideMenu';
import Dashboard2 from '../pages/Dashboard2';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AuthGuard from "../middlewares/auth-guard";
import Stok from "../pages/Stok";
import Pt from "../pages/Pt";
import Project from "../pages/Project";
import Po from "../pages/Po";
import SuratJalanPo from "../pages/SuratJalanPo";
import InvoicePo from "../pages/InvoicePo";
import TandaTerimaNota from "../pages/TandaTerimaNota";
import Pengguna from "../pages/Pengguna";
import DetailPengguna from "../pages/Pengguna/detail";
import Toko from "../pages/Toko";
import Penjualan from "../pages/Penjualan";
import SuratJalanPenjualan from "../pages/SuratJalanPenjualan";
import InvoicePenjualan from "../pages/InvoicePenjualan";
import NotaPenjualan from "../pages/NotaPenjualan";

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
                        <Dashboard2 />
                    </AuthGuard>
                },
                {
                    path: '/pt',
                    element: 
                    <AuthGuard>
                        <Pt />
                    </AuthGuard>
                },
                {
                    path: '/project',
                    element: 
                    <AuthGuard>
                        <Project />
                    </AuthGuard>
                },
                {
                    path: '/po',
                    element: 
                    <AuthGuard>
                        <Po />
                    </AuthGuard>
                },
                {
                    path: '/surat-jalan-po',
                    element: 
                    <AuthGuard>
                        <SuratJalanPo />
                    </AuthGuard>
                },
                {
                    path: '/invoice-po',
                    element: 
                    <AuthGuard>
                        <InvoicePo />
                    </AuthGuard>
                },
                {
                    path: '/tanda-terima-nota',
                    element: 
                    <AuthGuard>
                        <TandaTerimaNota />
                    </AuthGuard>
                },
                {
                    path: '/stok',
                    element: 
                    <AuthGuard>
                        <Stok/>
                    </AuthGuard>
                },
                {
                    path: '/pengguna',
                    element: 
                    <AuthGuard>
                        <Pengguna/>
                    </AuthGuard>
                },
                {
                    path: '/pengguna/:id',
                    element: 
                    <AuthGuard>
                        <DetailPengguna/>
                    </AuthGuard>
                },
                {
                    path: '/toko',
                    element: 
                    <AuthGuard>
                        <Toko/>
                    </AuthGuard>
                },
                {
                    path: '/penjualan',
                    element: 
                    <AuthGuard>
                        <Penjualan />
                    </AuthGuard>
                },
                {
                    path: '/penjualan/surat-jalan',
                    element: 
                    <AuthGuard>
                        <SuratJalanPenjualan />
                    </AuthGuard>
                },
                {
                    path: '/penjualan/invoice',
                    element: 
                    <AuthGuard>
                        <InvoicePenjualan />
                    </AuthGuard>
                },
                {
                    path: '/penjualan/nota',
                    element: 
                    <AuthGuard>
                        <NotaPenjualan />
                    </AuthGuard>
                },
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



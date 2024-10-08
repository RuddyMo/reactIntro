import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import './index.css';
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import Dashboard from "./views/Dashboard.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const router = createBrowserRouter([
    {
        path: "/",
        element: isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/dashboard" />,
    },
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "register",
                element: isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />,
            },
            {
                path: "login",
                element: isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />,
            },
        ],
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);

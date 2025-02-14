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
import AuthLayout from "./layouts/AuthLayout.jsx"
import Game from "./views/Game.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import App from "./App.jsx";

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "register",
                element: isAuthenticated() ? <Navigate to="/" /> : <Register />,
            },
            {
                path: "login",
                element: isAuthenticated() ? <Navigate to="/" /> : <Login />,
            },
        ],
    },
    {
        path: "/game/:gameId",
        element: <Game />,
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <SocketProvider>
            <RouterProvider router={router} />
        </SocketProvider>
    </StrictMode>,
);

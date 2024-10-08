import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Bienvenue à notre plateforme
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 px-4 dark:shadow sm:rounded-lg sm:px-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;

import { Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../assets/logo.webp';

const Login = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string().email('Adresse email invalide').required('Email requis'),
        password: Yup.string().required('Mot de passe requis'),
    });

    const handleLogin = async (values, { setSubmitting }) => {
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok || !data.token) {
                throw new Error(data.error || 'Erreur de connexion ou token manquant');
            }

            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-md transition-colors duration-300">
                <div className="flex justify-center mb-6">
                    <Link to={"/dashboard"}>
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-16 w-auto rounded-lg"
                        />
                    </Link>
                </div>
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">Se connecter</h2>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({
                          values,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          errors,
                          touched,
                          isSubmitting,
                      }) => (
                        <form onSubmit={handleSubmit}>
                            {error && <div className="text-red-600 mb-4">{error}</div>}

                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Adresse email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    placeholder="Entrez votre adresse email"
                                    required
                                    className="block w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                />
                                {errors.email && touched.email && (
                                    <div className="text-red-500 text-sm">{errors.email}</div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    placeholder="Entrez votre mot de passe"
                                    required
                                    className="block w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                                />
                                {errors.password && touched.password && (
                                    <div className="text-red-500 text-sm">{errors.password}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 transition duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;

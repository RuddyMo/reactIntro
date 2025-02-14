import { useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState(location.state?.emailVerification ? 'Inscription réussie ! Veuillez vérifier votre boîte mail pour confirmer votre compte.' : '');

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
            navigate('/');
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
                    <Link to={"/"}>
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-16 w-auto rounded-lg"
                        />
                    </Link>
                </div>
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">Connexion</h2>

                {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

                <div>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleLogin}
                    >
                        {({
                              values,
                              errors,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              touched,
                              isSubmitting,
                          }) => (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Adresse email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        required
                                        className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                                    />
                                    {errors.email && touched.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Mot de passe
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        required
                                        className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                                    />
                                    {errors.password && touched.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                                </button>
                            </form>
                        )}
                    </Formik>

                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
                        Vous n'avez pas encore de compte ?{' '}
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Inscription
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

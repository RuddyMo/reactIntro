import { Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import logo from '../assets/logo.webp';

const Inscription = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        firstname: Yup.string().required('Prénom requis'),
        lastname: Yup.string().required('Nom requis'),
        email: Yup.string().email('Adresse email invalide').required('Email requis'),
        username: Yup.string().required('Nom d\'utilisateur requis'),
        password: Yup.string()
            .min(8, 'Le mot de passe doit avoir au moins 8 caractères')
            .required('Mot de passe requis'),
    });

    const handleRegister = async (values, { setSubmitting }) => {
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur d\'inscription');
            }

            navigate('/login');
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
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">Inscription</h2>

                <div>
                    <Formik
                        initialValues={{ firstname: '', lastname: '', email: '', username: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleRegister}
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
                                {error && <div className="text-red-600 mb-4">{error}</div>}

                                <div>
                                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Prénom
                                    </label>
                                    <input
                                        id="firstname"
                                        name="firstname"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.firstname}
                                        required
                                        className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                                        placeholder="Entrez votre prénom"
                                    />
                                    {errors.firstname && touched.firstname && <div className="text-red-500 text-sm">{errors.firstname}</div>}
                                </div>

                                <div>
                                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Nom
                                    </label>
                                    <input
                                        id="lastname"
                                        name="lastname"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.lastname}
                                        required
                                        className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                                        placeholder="Entrez votre nom"
                                    />
                                    {errors.lastname && touched.lastname && <div className="text-red-500 text-sm">{errors.lastname}</div>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Email
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
                                        placeholder="Entrez votre adresse email"
                                    />
                                    {errors.email && touched.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Nom d'utilisateur
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.username}
                                        required
                                        className="mt-1 block w-full p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                                        placeholder="Entrez votre nom d'utilisateur"
                                    />
                                    {errors.username && touched.username && <div className="text-red-500 text-sm">{errors.username}</div>}
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
                                        placeholder="Entrez votre mot de passe"
                                    />
                                    {errors.password && touched.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Inscription en cours...' : 'Inscription'}
                                </button>
                            </form>
                        )}
                    </Formik>

                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
                        Vous avez déjà un compte ?{' '}
                        <a href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Connexion
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Inscription;

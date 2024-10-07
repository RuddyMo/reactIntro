import { Formik } from 'formik';
import * as Yup from 'yup';

const Basic = () => {
    const validationSchema = Yup.object({
        email: Yup.string().email('Adresse email invalide').required('Email requis'),
        password: Yup.string().required('Mot de passe requis'),
    });

    return (
        <div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 pb-9 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Connexion
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                setSubmitting(false);
                            }, 400);
                            console.log(values);
                        }}
                    >
                        {({
                              values,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              errors,
                              touched
                          }) => (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email"
                                           className="block text-sm font-medium leading-6 text-gray-900">
                                        Email
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            required
                                            autoComplete="email"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 mb-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.email && touched.email && (
                                            <div className="text-red-600">{errors.email}</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="password"
                                               className="block text-sm font-medium leading-6 text-gray-900">
                                            Mot de passe
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            required
                                            autoComplete="current-password"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.password && touched.password && (
                                            <div className="text-red-600">{errors.password}</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mt-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Connexion
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Vous n'êtes pas membre ?
                        <a href={"/register"} className="font-semibold leading-6 pl-2 text-indigo-600 hover:text-indigo-500">
                            Inscription
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Basic;

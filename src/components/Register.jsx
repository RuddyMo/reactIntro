import { Formik } from 'formik';
import * as Yup from 'yup';

const Inscription = () => {
    const validationSchema = Yup.object({
        nom: Yup.string().required('Nom requis'),
        prenom: Yup.string().required('Prénom requis'),
        email: Yup.string().email('Adresse email invalide').required('Email requis'),
        username: Yup.string().required('Nom d\'utilisateur requis'),
        password: Yup.string()
            .min(8, 'Le mot de passe doit avoir au moins 8 caractères')
            .required('Mot de passe requis'),
    });

    return (
        <div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 pb-9 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Inscription
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Formik
                        initialValues={{ nom: '', prenom: '', email: '', username: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                setSubmitting(false);
                                console.log(values);
                            }, 400);
                        }}
                    >
                        {({
                              values,
                              errors,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              touched
                          }) => (
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="nom" className="block text-sm font-medium leading-6 text-gray-900">
                                        Nom
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="nom"
                                            name="nom"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.nom}
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 mb-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.nom && touched.nom && <div className="text-red-600">{errors.nom}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="prenom" className="block text-sm font-medium leading-6 text-gray-900">
                                        Prénom
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="prenom"
                                            name="prenom"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.prenom}
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 mb-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.prenom && touched.prenom && <div className="text-red-600">{errors.prenom}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 mb-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.email && touched.email && <div className="text-red-600">{errors.email}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                        Nom d'utilisateur
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 mb-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.username && touched.username && <div className="text-red-600">{errors.username}</div>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Mot de passe
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 mb-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.password && touched.password && <div className="text-red-600">{errors.password}</div>}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mt-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Inscription
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Vous avez déjà un compte ?
                        <a href={"/login"} className="font-semibold leading-6 pl-2 text-indigo-600 hover:text-indigo-500">
                            Connexion
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Inscription;

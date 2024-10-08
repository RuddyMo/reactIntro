import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log('Decoded token:', decodedToken); // Check the structure of the token
                setUser(decodedToken);
            } catch (error) {
                setError('Token invalide');
            }
        } else {
            setError('Utilisateur non authentifié');
        }
    }, []);

    const createGame = async () => {
        if (!user) {
            setError('Utilisateur non authentifié');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la création de la partie');
            }
            alert('Partie créée avec succès');
        } catch (error) {
            setError(error.message);
        }
    };

    const joinGame = async (gameId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/game/join/${gameId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la tentative de rejoindre la partie');
            }
            alert('Vous avez rejoint la partie avec succès');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Créer une partie</h2>
                    <form
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                        onSubmit={(e) => {
                            e.preventDefault();
                            createGame();
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Créer la partie
                        </button>
                    </form>
                </div>

                <div className="w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rejoindre une partie</h2>
                    <form
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const gameId = e.target.elements.gameId.value;
                            joinGame(gameId);
                        }}
                    >
                        <div className="mb-4">
                            <label htmlFor="gameId" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                ID de la partie
                            </label>
                            <input
                                id="gameId"
                                name="gameId"
                                type="text"
                                placeholder="Entrez l'ID du jeu"
                                className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Rejoindre la partie
                        </button>
                    </form>
                </div>
            </div>
            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </div>
    );
};

export default Dashboard;

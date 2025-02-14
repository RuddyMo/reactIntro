import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from "../components/NavBar.jsx";

const Game = () => {
    const { gameId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUser(decodedToken);
            } catch (error) {
                console.error('Token invalid:', error);
            }
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Game ID: {gameId}</h1>
                {user && (
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                        Joueur: {user.username}
                    </h2>
                )}
            </div>
        </div>
    );
};

export default Game;

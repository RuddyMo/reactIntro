import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Navbar from "./components/NavBar.jsx";
import { io } from 'socket.io-client';

const Popup = ({ message, onClose, onRestart }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                {message}
            </h2>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={onRestart}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md"
                >
                    Rejouer
                </button>
                <button
                    onClick={onClose}
                    className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-md"
                >
                    Fermer
                </button>
            </div>
        </div>
    </div>
);

const Game = ({ currentPlayer, onCellClick, board, isMyTurn, playerSymbol }) => (
    <div className="flex flex-col items-center p-4">
        <div className="mb-4 text-lg text-gray-800 dark:text-white">
            {isMyTurn ? "C'est votre tour" : "Tour de l'adversaire"}
            <div className="text-sm mt-1">
                Vous jouez avec : {playerSymbol}
            </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => (
                <button
                    key={index}
                    className={`w-20 h-20 bg-gray-200 dark:bg-gray-700 text-2xl font-bold text-gray-800 dark:text-white 
                        ${!cell && isMyTurn ? 'hover:bg-gray-300 dark:hover:bg-gray-600' : ''}`}
                    onClick={() => onCellClick(index)}
                    disabled={!isMyTurn || cell}
                >
                    {cell}
                </button>
            ))}
        </div>
    </div>
);

const GameLogs = ({ messages }) => (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Historique de la partie</h3>
        <div className="max-h-40 overflow-y-auto">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className="text-sm text-gray-600 dark:text-gray-300 mb-1"
                >
                    {message}
                </div>
            ))}
        </div>
    </div>
);
const ScoreBoard = ({ games = [] }) => (  // Ajout d'une valeur par défaut
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                <tr className="border-b dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-200">ID Partie</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-200">Joueur 1</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-200">Joueur 2</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-200">Gagnant</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-200">État</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(games) && games.length > 0 ? (
                    games.map((game) => (
                        <tr key={game.id} className="border-b dark:border-gray-700">
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{game.id.slice(0, 8)}...</td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{game.player1?.username || '-'}</td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{game.player2?.username || '-'}</td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                                {game.winner ? game.winner.username : (game.state === 'finished' ? 'Match nul' : '-')}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                                {game.state === 'pending' ? 'En attente' :
                                    game.state === 'playing' ? 'En cours' : 'Terminée'}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 text-center">
                            Aucune partie à afficher
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    </div>
);

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [currentGameId, setCurrentGameId] = useState(null);
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [socket, setSocket] = useState(null);
    const [playerSymbol, setPlayerSymbol] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [gameStatus, setGameStatus] = useState('waiting');
    const [gameMessages, setGameMessages] = useState([]);
    const [games, setGames] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                setUser(jwtDecode(token));
            } catch (error) {
                console.error('Token invalide');
            }
        }

        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("newPlayer", ({ infoUser }) => {
            console.log("Nouveau joueur rejoint:", infoUser);
            setGameStatus('playing');
            setGameMessages(prev => [...prev, `${infoUser.username} a rejoint la partie`]);
        });

        socket.on("updateGame", ({ board: newBoard, currentPlayer: newCurrentPlayer }) => {
            console.log("Mise à jour du jeu reçue:", { newBoard, newCurrentPlayer });
            setBoard(newBoard);
            setCurrentPlayer(newCurrentPlayer);
        });

        socket.on("gameEnded", ({ winner }) => {
            let message;
            if (winner === 'draw') {
                message = 'Match nul !';
            } else if (winner === playerSymbol) {
                message = 'Vous avez gagné !';
            } else {
                message = 'Vous avez perdu !';
            }
            setPopupMessage(message);
            setShowPopup(true);
            setGameStatus('finished');
            setGameMessages(prev => [...prev, message]);
        });

        socket.on("playerMove", ({ player, position }) => {
            const row = Math.floor(position / 3) + 1;
            const col = (position % 3) + 1;
            setGameMessages(prev => [...prev, `Joueur ${player} a joué en position (${row},${col})`]);
        });

        return () => {
            socket.off("newPlayer");
            socket.off("updateGame");
            socket.off("gameEnded");
            socket.off("playerMove");
        };
    }, [socket, playerSymbol]);

    useEffect(() => {
        const loadGames = async () => {
            try {
                const response = await fetch('http://localhost:3000/games', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error('Erreur lors du chargement des parties:', error);
            }
        };

        loadGames();
        const interval = setInterval(loadGames, 30000);
        return () => clearInterval(interval);
    }, []);

    const createGame = async () => {
        if (!user) {
            setError('Utilisateur non authentifié');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userId: user.id }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la création de la partie');
            }

            setCurrentGameId(data.gameId);
            setPlayerSymbol('X');
            socket.emit('join', { gameId: data.gameId, infoUser: user });
            setGameStatus('waiting');
            setGameMessages([`Partie créée - En attente d'un adversaire`]);
        } catch (error) {
            setError(error.message);
        }
    };

    const joinGame = async (event) => {
        event.preventDefault();
        const gameId = document.getElementById('gameId').value;

        try {
            const response = await fetch(`http://localhost:3000/game/join/${gameId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userId: user.id }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la tentative de rejoindre la partie');
            }

            setCurrentGameId(gameId);
            setPlayerSymbol('O');
            socket.emit('join', { gameId, infoUser: user });
            setGameStatus('playing');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCellClick = (position) => {
        if (gameStatus !== 'playing' ||
            !currentGameId ||
            !playerSymbol ||
            currentPlayer !== playerSymbol ||
            board[position] !== null) {
            return;
        }

        socket.emit('makeMove', {
            gameId: currentGameId,
            position,
            player: playerSymbol
        });
    };

    const handleRestart = () => {
        socket.emit('restartGame', currentGameId);
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setShowPopup(false);
        setGameStatus('playing');
        setGameMessages([]);
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="flex p-8">
                    <div className="w-1/2 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Créer une partie
                        </h2>
                        <form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <button
                                type="button"
                                onClick={createGame}
                                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md"
                            >
                                Créer la partie
                            </button>
                        </form>
                    </div>

                    <div className="w-1/2 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Rejoindre une partie
                        </h2>
                        <form className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" onSubmit={joinGame}>
                            <div className="mb-4">
                                <label htmlFor="gameId" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                    ID de la partie
                                </label>
                                <input
                                    id="gameId"
                                    name="gameId"
                                    type="text"
                                    placeholder="Entrez l'ID du jeu"
                                    className="mt-1 block w-full p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md"
                            >
                                Rejoindre la partie
                            </button>
                        </form>
                    </div>
                </div>

                {currentGameId && (
                    <div className="p-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Partie en cours - ID: {currentGameId}
                            </h2>
                            <Game
                                currentPlayer={currentPlayer}
                                board={board}
                                onCellClick={handleCellClick}
                                isMyTurn={currentPlayer === playerSymbol}
                                playerSymbol={playerSymbol}
                            />
                            <GameLogs messages={gameMessages} />
                        </div>
                    </div>
                )}
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Historique des parties
                    </h2>
                    <ScoreBoard games={games} />
                </div>

                {error && (
                    <div className="text-red-500 text-center mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                        {error}
                    </div>
                )}

                {showPopup && (
                    <Popup
                        message={popupMessage}
                        onClose={() => setShowPopup(false)}
                        onRestart={handleRestart}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
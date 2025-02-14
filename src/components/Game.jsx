import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { jwtDecode } from 'jwt-decode';

const Game = () => {
    const { gameId } = useParams();
    const socket = useSocket();
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [gameStatus, setGameStatus] = useState('waiting');
    const [playerSymbol, setPlayerSymbol] = useState(null);
    const [players, setPlayers] = useState({
        player1: null,
        player2: null
    });

    const user = jwtDecode(localStorage.getItem('token'));

    useEffect(() => {
        if (socket) {
            socket.emit('join', { gameId, infoUser: user });

            socket.on('newPlayer', ({ infoUser }) => {
                setPlayers(prev => ({
                    ...prev,
                    player2: infoUser
                }));
                setPlayerSymbol('O');
                setGameStatus('playing');
            });

            socket.on('updateGame', ({ board: newBoard, currentPlayer: newCurrentPlayer }) => {
                console.log("Mise à jour reçue:", { newBoard, newCurrentPlayer });
                setBoard(newBoard);
                setCurrentPlayer(newCurrentPlayer);
            });

            return () => {
                socket.off('newPlayer');
                socket.off('updateGame');
            };
        }
    }, [socket, gameId, user]);

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (position) => {
        console.log("Click sur la case:", {
            position,
            currentPlayer,
            playerSymbol,
            isMyTurn: currentPlayer === playerSymbol
        });

        if (board[position] ||
            winner ||
            gameStatus !== 'playing' ||
            currentPlayer !== playerSymbol) {
            console.log("Click invalide");
            return;
        }

        socket.emit('makeMove', {
            gameId,
            position,
            player: playerSymbol
        });

        const gameWinner = checkWinner(board);
        if (gameWinner) {
            setWinner(gameWinner);
            socket.emit('gameOver', { gameId, winner: gameWinner });
        }
    };

    const isMyTurn = currentPlayer === playerSymbol;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="mb-4 text-xl font-bold dark:text-white">
                Game ID: {gameId}
            </div>
            <div className="mb-4 text-lg dark:text-white">
                {gameStatus === 'waiting' ? 'Waiting for opponent...' : (
                    <div>
                        <div>{isMyTurn ? "C'est votre tour" : "Tour de l'adversaire"}</div>
                        <div className="text-sm mt-1">Vous jouez avec : {playerSymbol}</div>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-3 gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg">
                {board.map((value, index) => (
                    <button
                        key={index}
                        className={`w-20 h-20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-white 
                            ${!value && isMyTurn && !winner ? 'hover:bg-gray-300 dark:hover:bg-gray-600' : ''}`}
                        onClick={() => handleClick(index)}
                        disabled={!isMyTurn || value !== null || winner}
                    >
                        {value}
                    </button>
                ))}
            </div>
            {winner && (
                <div className="mt-4 text-xl font-bold text-green-600 dark:text-green-400">
                    Winner: {winner}
                </div>
            )}
        </div>
    );
};

export default Game;
import Navbar from '../components/Navbar';

const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <div className="p-8">
                <h1 className="text-3xl font-bold">Bienvenue sur le tableau de bord</h1>
                {/* Contenu du tableau de bord */}
            </div>
        </div>
    );
};

export default Dashboard;

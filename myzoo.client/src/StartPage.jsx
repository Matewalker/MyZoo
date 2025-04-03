import { useNavigate } from "react-router-dom";

function StartPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="mb-8 text-4xl font-bold text-center">J�tssz a MyZoo-val!</h1>

            <div className="space-y-6">
                <button onClick={() => navigate("/register")} className="start-btn">
                    Regisztr�ci�
                </button>
                <button onClick={() => navigate("/login")} className="start-btn">
                    Bejelentkez�s
                </button>
            </div>
        </div>
    );
}

export default StartPage;
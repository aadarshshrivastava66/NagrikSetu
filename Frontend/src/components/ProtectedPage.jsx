import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const hasShownAlert = useRef(false);

    useEffect(() => {
        if (loading) return;

        if (!user && !hasShownAlert.current) {
            hasShownAlert.current = true;
            alert("Please Login First");
            navigate("/", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-xl font-semibold">Loading...</h1>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return children;
}

export default ProtectedRoute;
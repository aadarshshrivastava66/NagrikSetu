import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            toast.error("Please login first!");
           return;
        }
    }, [user, loading, navigate, location]);

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
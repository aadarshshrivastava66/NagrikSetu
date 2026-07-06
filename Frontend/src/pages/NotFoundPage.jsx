import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-blue-600">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                    Page Not Found
                </h2>
                <p className="text-gray-500 mt-2">
                    The page you're looking for doesn't exist.
                </p>
            </div>
            <Link
                to="/"
                className="bg-blue-600 text-white px-6 py-2 rounded-md 
                           hover:bg-blue-700 transition font-medium"
            >
                Back to Home
            </Link>
        </div>
    );
}

export default NotFound;
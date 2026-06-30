import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./layouts/Footer";
import Features from "./components/home/Features";
import Categories from "./components/home/Categories";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ReportIssuePage from "./pages/ReportIssuePage";
import ProtectedRoute from "./components/ProtectedPage";
import BrowseIssuesPage from "./pages/BrowserPage";



const PlaceholderPage = ({ title }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
    <h2 className="text-3xl font-bold text-[#0f1923] mb-3" style={{ fontFamily: "Sora, sans-serif" }}>{title}</h2>
    <p className="text-gray-500">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar/>
      <main>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/features" element={<Features/>}/>
          <Route path="/categories" element={<Categories/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/issues" element={<BrowseIssuesPage/>}/>
          <Route path="/report" element={
            <ProtectedRoute>
            <ReportIssuePage/>
            </ProtectedRoute>
          }/>
          
          
          {/* <Route path="/register" element={<RegisterPage/>}/> */}
          {/* <Route path="/report" element={<PlaceholderPage title="Report an Issue" />} />
          <Route path="/issues" element={<PlaceholderPage title="Browse Issues" />} />
          <Route path="/map" element={<PlaceholderPage title="Live Map" />} />
          <Route path="/leaderboard" element={<PlaceholderPage title="Leaderboard" />} />
          <Route path="/dashboard" element={<PlaceholderPage title="My Reports" />} />
          <Route path="/login" element={<PlaceholderPage title="Log In" />} />
          <Route path="/about" element={<PlaceholderPage title="About NagarSeva" />} /> */}
        </Routes>
      </main>
      <Footer/>
    </Router>
    </AuthProvider>
  );
}

export default App;
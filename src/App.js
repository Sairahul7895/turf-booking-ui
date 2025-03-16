import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/authContext";
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import RestrictedRoute from './components/RestrictedRoute';
import AddTurf from './pages/AddTurf';
import ProtectedRoute from './components/ProtectedRoute';
import NearByTurfs from './pages/NearByTurfs';
import TurfDetails from './pages/TurfDetails';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<RestrictedRoute element={<Login />} />} />
            <Route path="/signup" element={<RestrictedRoute element={<Signup />} />} />
            <Route path="/addTurf" element={<ProtectedRoute element={<AddTurf />} />} />
            <Route path="/allTurfs" element={<ProtectedRoute element={<NearByTurfs />} />} />
            <Route path="/turf/:id" element={<ProtectedRoute element={<TurfDetails />} />} />
            <Route path="/bookTurf/:id" element={<ProtectedRoute element={<BookingPage />} />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

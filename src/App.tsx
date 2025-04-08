import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Booking } from './pages/Booking';
import { Payment } from './pages/Payment';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminServices } from './pages/AdminServices';
export function App() {
  return <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/agendar" element={<Booking />} />
            <Route path="/agendar/:servicoId" element={<Booking />} />
            <Route path="/pagamento" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/servicos" element={<AdminServices />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>;
}
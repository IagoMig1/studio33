import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScissorsIcon, MenuIcon, XIcon, LogOutIcon } from 'lucide-react';
import { getCurrentUser, logout } from '../utils/supabase';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="bg-brand-black text-brand-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ScissorsIcon className="h-7 w-7 text-brand-aqua" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-brand-light to-brand-dark text-transparent bg-clip-text">
                Studio Barber 33
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-brand-light hover:text-white transition px-3 py-2 rounded-md text-sm font-medium">
              Início
            </Link>
            <Link to="/servicos" className="text-brand-light hover:text-white transition px-3 py-2 rounded-md text-sm font-medium">
              Serviços
            </Link>
            <Link to="/agendar" className="text-brand-light hover:text-white transition px-3 py-2 rounded-md text-sm font-medium">
              Agendar
            </Link>

            {isLoggedIn ? (
              <>
                <Link to="/admin" className="text-brand-light hover:text-white transition px-3 py-2 rounded-md text-sm font-medium">
                  Painel Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium text-white transition"
                >
                  <LogOutIcon className="h-4 w-4 mr-1" />
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-brand-light hover:bg-brand-dark text-black hover:text-white px-4 py-2 rounded-md text-sm font-semibold transition"
              >
                Login Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-brand-gray hover:text-white hover:bg-brand-dark"
            >
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-black px-4 pb-4 pt-2 space-y-1">
          <Link to="/" className="block text-brand-light hover:text-white" onClick={() => setIsMenuOpen(false)}>Início</Link>
          <Link to="/servicos" className="block text-brand-light hover:text-white" onClick={() => setIsMenuOpen(false)}>Serviços</Link>
          <Link to="/agendar" className="block text-brand-light hover:text-white" onClick={() => setIsMenuOpen(false)}>Agendar</Link>

          {isLoggedIn ? (
            <>
              <Link to="/admin" className="block text-brand-light hover:text-white" onClick={() => setIsMenuOpen(false)}>Painel Admin</Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md"
              >
                <LogOutIcon className="h-4 w-4 mr-2 inline" />
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block bg-brand-light hover:bg-brand-dark text-black hover:text-white px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Login Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

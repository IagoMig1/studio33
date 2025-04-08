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
  return <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ScissorsIcon className="h-8 w-8 text-amber-500" />
              <span className="ml-2 text-xl font-bold">Studio Barber 33</span>
            </Link>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                Início
              </Link>
              <Link to="/servicos" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                Serviços
              </Link>
              <Link to="/agendar" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                Agendar
              </Link>
              {isLoggedIn ? <>
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                    Painel Admin
                  </Link>
                  <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700">
                    <LogOutIcon className="h-4 w-4 mr-1" />
                    Sair
                  </button>
                </> : <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium bg-amber-500 text-black hover:bg-amber-400">
                  Login Admin
                </Link>}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-800">
              {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>
              Início
            </Link>
            <Link to="/servicos" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>
              Serviços
            </Link>
            <Link to="/agendar" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>
              Agendar
            </Link>
            {isLoggedIn ? <>
                <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>
                  Painel Admin
                </Link>
                <button onClick={() => {
            handleLogout();
            setIsMenuOpen(false);
          }} className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700">
                  <LogOutIcon className="h-4 w-4 mr-1" />
                  Sair
                </button>
              </> : <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-amber-500 text-black hover:bg-amber-400" onClick={() => setIsMenuOpen(false)}>
                Login Admin
              </Link>}
          </div>
        </div>}
    </nav>;
};
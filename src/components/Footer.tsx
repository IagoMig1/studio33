import React from 'react';
import { ScissorsIcon, InstagramIcon, FacebookIcon, MapPinIcon, PhoneIcon, ClockIcon } from 'lucide-react';
export const Footer = () => {
  return <footer className="bg-black text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <ScissorsIcon className="h-8 w-8 text-amber-500" />
              <span className="ml-2 text-xl font-bold">Studio Barber 33</span>
            </div>
            <p className="text-gray-400 mb-4">
              Cortes exclusivos e atendimento de primeira qualidade para homens
              que valorizam estilo e sofisticação.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-500">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500">
                <FacebookIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Contato
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-amber-500 mr-2 mt-1" />
                <p className="text-gray-400">
                  Av. Principal, 1234
                  <br />
                  Centro, Sua Cidade - UF
                </p>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-amber-500 mr-2" />
                <p className="text-gray-400">(99) 9999-9999</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Horário de Funcionamento
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-amber-500 mr-2 mt-1" />
                <div className="text-gray-400">
                  <p>Segunda a Sexta: 9h às 20h</p>
                  <p>Sábado: 9h às 18h</p>
                  <p>Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Studio Barber 33. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>;
};
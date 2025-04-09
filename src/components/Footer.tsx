import React from 'react';
import {
  ScissorsIcon,
  InstagramIcon,
  FacebookIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-black text-brand-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e descrição */}
          <div>
            <div className="flex items-center mb-4">
              <ScissorsIcon className="h-8 w-8 text-brand-aqua" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-brand-light to-brand-dark text-transparent bg-clip-text">
                Studio Barber 33
              </span>
            </div>
            <p className="text-brand-gray mb-4">
              Cortes exclusivos e atendimento de primeira qualidade para homens
              que valorizam estilo e sofisticação.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/studiobarber33/" className="text-brand-gray hover:text-brand-light transition">
                <InstagramIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-brand-dark pb-2">
              Contato
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-brand-aqua mr-2 mt-1" />
                <p className="text-brand-gray">
                R. Reg. Feijó, 129 - Vila Santos, Caçapava - SP, 12280-034
                  <br />
                  Caçapava - SP
                </p>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-brand-aqua mr-2" />
                <p className="text-brand-gray">(12) 99731-0938</p>
              </div>
            </div>
          </div>

          {/* Horário */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-brand-dark pb-2">
              Horário de Funcionamento
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-brand-aqua mr-2 mt-1" />
                <div className="text-brand-gray">
                  <p>Segunda a Sexta: 9h às 20h</p>
                  <p>Sábado: 9h às 18h</p>
                  <p>Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-brand-dark mt-8 pt-6 text-center text-brand-gray text-sm">
          <p>
            © {new Date().getFullYear()} Studio Barber 33. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

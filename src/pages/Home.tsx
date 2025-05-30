import React from 'react';
import { Link } from 'react-router-dom';
import { ScissorsIcon, CalendarIcon, StarIcon } from 'lucide-react';

export const Home = () => {
  return (
    <div className="bg-brand-gray min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Studio Barber <span className="text-brand-aqua">33</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-brand-gray">
                Estilo e precisão em cada corte. Agende seu horário e transforme seu visual.
              </p>
              <Link
                to="/agendar"
                className="inline-block bg-brand-light text-brand-black font-bold py-3 px-8 rounded-md hover:bg-brand-dark transition duration-300"
              >
                Agendar Agora
              </Link>
            </div>
            <div className="">
              
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black">
              Nossos Serviços
            </h2>
            <p className="mt-4 text-lg text-brand-dark">
              Oferecemos uma variedade de serviços para atender todas as suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-brand-light rounded-full mb-4">
                <ScissorsIcon className="h-8 w-8 text-brand-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-black">Corte de Cabelo</h3>
              <p className="text-brand-dark">
                Cortes modernos e tradicionais realizados por profissionais experientes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-brand-light rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-black">Barba</h3>
              <p className="text-brand-dark">
                Modelagem e tratamento de barba para um visual impecável.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-brand-light rounded-full mb-4">
                <StarIcon className="h-8 w-8 text-brand-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-brand-black">Tratamentos</h3>
              <p className="text-brand-dark">
                Hidratação, tintura e outros tratamentos para cabelo e barba.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/servicos"
              className="inline-block bg-brand-black text-white font-bold py-2 px-6 rounded-md hover:bg-brand-dark transition duration-300"
            >
              Ver Todos os Serviços
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-brand-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-brand-black mb-4">
            Pronto para um novo visual?
          </h2>
          <p className="text-lg text-brand-dark mb-8 max-w-3xl mx-auto">
            Agende seu horário agora mesmo e deixe nossos profissionais cuidarem do seu estilo com excelência.
          </p>
          <Link
            to="/agendar"
            className="inline-flex items-center bg-brand-black text-white font-bold py-3 px-8 rounded-md hover:bg-brand-dark transition duration-300"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Agendar Horário
          </Link>
        </div>
      </section>
    </div>
  );
};

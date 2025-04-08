import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServicos, Servico } from '../utils/supabase';
import { ServiceCard } from '../components/ServiceCard';
import { CalendarIcon, LoaderIcon } from 'lucide-react';
export const Services = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await getServicos();
        setServicos(data);
      } catch (error: any) {
        console.error('Erro ao buscar serviços:', error);
        setError('Não foi possível carregar os serviços. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchServicos();
  }, []);
  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderIcon className="h-10 w-10 text-amber-500 animate-spin" />
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-amber-500 text-black font-bold py-2 px-4 rounded hover:bg-amber-400">
            Tentar Novamente
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Nossos Serviços</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Conheça todos os serviços disponíveis na Studio Barber 33 e escolha
            o que melhor atende às suas necessidades.
          </p>
        </div>
        {servicos.length === 0 ? <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Nenhum serviço disponível
            </h2>
            <p className="text-gray-600 mb-4">
              No momento não temos serviços cadastrados. Por favor, tente
              novamente mais tarde.
            </p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map(servico => <ServiceCard key={servico.id} servico={servico} />)}
          </div>}
        <div className="mt-12 text-center">
          <Link to="/agendar" className="inline-flex items-center bg-black text-white font-bold py-3 px-8 rounded-md hover:bg-gray-800 transition duration-300">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Agendar Horário
          </Link>
        </div>
      </div>
    </div>;
};
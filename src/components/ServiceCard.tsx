import React from 'react';
import { ClockIcon, ScissorsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Servico } from '../utils/supabase';
interface ServiceCardProps {
  servico: Servico;
  isAdminView?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
export const ServiceCard: React.FC<ServiceCardProps> = ({
  servico,
  isAdminView = false,
  onEdit,
  onDelete
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {servico.nome}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{servico.duracao} minutos</span>
            </div>
          </div>
          <div className="bg-amber-500 text-black font-bold py-1 px-3 rounded-full">
            {formatPrice(servico.preco)}
          </div>
        </div>
        {isAdminView ? <div className="mt-4 flex justify-between">
            <button onClick={() => onEdit && onEdit(servico.id)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded">
              Editar
            </button>
            <button onClick={() => onDelete && onDelete(servico.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded">
              Excluir
            </button>
          </div> : <Link to={`/agendar/${servico.id}`} className="mt-4 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded flex items-center justify-center">
            <ScissorsIcon className="h-4 w-4 mr-2" />
            Agendar
          </Link>}
      </div>
    </div>;
};
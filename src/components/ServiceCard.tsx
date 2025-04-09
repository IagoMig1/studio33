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

  const statusBadge = servico.ativo ? (
    <span className="bg-brand.aqua text-brand.dark text-xs font-semibold px-2 py-1 rounded-full">
      Ativo
    </span>
  ) : (
    <span className="bg-brand.gray text-brand.dark text-xs font-semibold px-2 py-1 rounded-full">
      Inativo
    </span>
  );

  return (
    <div
      className={`bg-brand.white rounded-lg shadow-md overflow-hidden border border-brand.gray transition-opacity ${
        !servico.ativo && !isAdminView ? 'opacity-60' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-brand.black mb-1">
              {servico.nome}
            </h3>
            <div className="flex items-center text-brand.dark mb-2">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{servico.duracao} minutos</span>
            </div>
            {statusBadge}
          </div>
          <div className="bg-brand.aqua text-brand.black font-bold py-1 px-3 rounded-full text-sm">
            {formatPrice(servico.preco)}
          </div>
        </div>

        <div className="mt-4">
          {isAdminView ? (
            <div className="flex justify-between">
              <button
                onClick={() => onEdit && onEdit(servico.id)}
                className="bg-brand.light hover:bg-brand.dark text-brand.white py-1 px-4 rounded font-medium"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete && onDelete(servico.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded font-medium"
              >
                Excluir
              </button>
            </div>
          ) : (
            <Link
              to={`/agendar/${servico.id}`}
              className="mt-4 bg-brand.black hover:bg-brand.dark text-brand.white py-2 px-4 rounded flex items-center justify-center"
            >
              <ScissorsIcon className="h-4 w-4 mr-2" />
              Agendar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

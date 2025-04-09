import React from 'react';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon } from 'lucide-react';
import { Agendamento } from '../utils/supabase';

interface AppointmentCardProps {
  agendamento: Agendamento;
  onStatusChange: (id: string, status: 'confirmado' | 'cancelado') => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  agendamento,
  onStatusChange
}) => {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return 'Horário inválido';
      date.setHours(date.getHours() + 3);
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo',
      });
    } catch {
      return 'Horário inválido';
    }
  };

  const getStatusBadge = () => {
    switch (agendamento.status) {
      case 'confirmado':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Confirmado
          </span>
        );
      case 'cancelado':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pendente
          </span>
        );
    }
  };

  const statusBorder = {
    confirmado: 'border-green-500',
    cancelado: 'border-red-500',
    pendente: 'border-amber-500',
  }[agendamento.status];

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${statusBorder}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">
            {agendamento.servico?.nome}
          </h3>
          <div className="text-sm text-gray-600 mt-1">
            <div className="flex items-center mb-1">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{agendamento.nome}</span>
            </div>
            <div className="flex items-center mb-1">
              <PhoneIcon className="h-4 w-4 mr-1" />
              <span>{agendamento.telefone}</span>
            </div>
            <div className="flex items-center mb-1">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{formatDate(agendamento.data_hora)}</span>
              <ClockIcon className="h-4 w-4 ml-2 mr-1" />
              <span>{formatTime(agendamento.data_hora)}</span>
            </div>
            <div className="flex items-center mb-1">
              <span>Barbeiro: {agendamento.barbeiros?.nome || 'Não informado'}</span>
            </div>
            <div className="flex items-center mb-1">
              <span>Preço: {agendamento.servico?.preco?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }) || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {agendamento.status === 'pendente' && (
        <div className="mt-3 flex space-x-2">
          <button
            title="Confirmar agendamento"
            onClick={() => onStatusChange(agendamento.id, 'confirmado')}
            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
          >
            Confirmar
          </button>
          <button
            title="Cancelar agendamento"
            onClick={() => onStatusChange(agendamento.id, 'cancelado')}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon } from 'lucide-react';
import { Agendamento } from '../utils/supabase';

// Interface para o objeto Barbeiro
interface Barbeiro {
  id: string;
  nome: string;
  foto: string;
  especialidade: string;
}

interface AppointmentCardProps {
  agendamento: Agendamento;
  onStatusChange: (id: string, status: 'confirmado' | 'cancelado') => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  agendamento,
  onStatusChange
}) => {
  // Lista estática de barbeiros
  const barbeiros: Barbeiro[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      nome: 'João Silva',
      foto: 'https://images.unsplash.com/photo-1565787154274-c8d076ad34e7?auto=format&fit=crop&w=800&q=80',
      especialidade: 'Especialista em Cortes Modernos',
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      nome: 'Pedro Santos',
      foto: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80',
      especialidade: 'Especialista em Barba',
    },
  ];

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
      date.setHours(date.getHours() + 3); // Ajuste do fuso horário
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo',
      };
      return date.toLocaleTimeString('pt-BR', options);
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

  // Localiza o barbeiro correspondente ao barbeiros_id no agendamento
  const barbeiroNome = agendamento.barbeiros?.nome || 'Barbeiro não informado';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500">
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
              <span>Barbeiro: {barbeiroNome}</span>
            </div>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {agendamento.status === 'pendente' && (
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => onStatusChange(agendamento.id, 'confirmado')}
            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
          >
            Confirmar
          </button>
          <button
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
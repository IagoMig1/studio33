import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  getAgendamentosDoDia,
  updateStatusAgendamento
} from '../utils/supabase';
import { AppointmentCard } from '../components/AppointmentCard';
import {
  CalendarIcon,
  LoaderIcon,
  AlertTriangleIcon
} from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [faturamentoDia, setFaturamentoDia] = useState(0);
  const [totalAgendamentos, setTotalAgendamentos] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) navigate('/login');
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      if (!selectedDate) return;
      setLoading(true);
      try {
        const data = await getAgendamentosDoDia(selectedDate);
        setAgendamentos(data);
        const faturamento = data.filter(a => a.status === 'confirmado')
          .reduce((total, a) => total + (a.servico?.preco || 0), 0);
        setFaturamentoDia(faturamento);
        setTotalAgendamentos(data.length);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        setError('Não foi possível carregar os agendamentos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchAgendamentos();
  }, [selectedDate]);

  const handleStatusChange = async (id: string, status: 'confirmado' | 'cancelado') => {
    try {
      await updateStatusAgendamento(id, status);
      setAgendamentos(agendamentos.map(agendamento =>
        agendamento.id === id ? { ...agendamento, status } : agendamento));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Não foi possível atualizar o status do agendamento.');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const pendentes = agendamentos.filter(a => a.status === 'pendente');
  const confirmados = agendamentos.filter(a => a.status === 'confirmado');
  const cancelados = agendamentos.filter(a => a.status === 'cancelado');

  if (loading && agendamentos.length === 0) {
    return (
      <div className="min-h-screen bg-brand-gray flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderIcon className="h-10 w-10 text-brand-aqua animate-spin" />
          <p className="mt-4 text-brand-dark">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-black">Painel Administrativo</h1>
            <p className="text-sm text-brand-dark mt-1">Gerencie agendamentos da Studio Barber 33</p>
          </div>
          <button
            onClick={() => navigate('/admin/servicos')}
            className="mt-4 sm:mt-0 bg-brand-light hover:bg-brand-dark text-white font-semibold py-2 px-5 rounded-lg shadow transition"
          >
            Gerenciar Serviços
          </button>
        </div>

        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ResumoCard titulo="Total de Agendamentos" valor={totalAgendamentos} />
          <ResumoCard
            titulo="Faturamento do Dia"
            valor={faturamentoDia.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
            cor="text-green-600"
          />
          <ResumoCard titulo="Confirmados" valor={confirmados.length} />
        </div>

        {/* Agendamentos */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-semibold text-brand-black">Agendamentos do Dia</h2>
            <div className="flex items-center mt-2 sm:mt-0">
              <CalendarIcon className="h-5 w-5 text-brand-dark mr-2" />
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="border text-sm px-3 py-1 rounded-md shadow-sm focus:ring-2 focus:ring-brand-light"
              />
            </div>
          </div>

          {error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <AgendamentosSecao titulo="Pendentes" agendamentos={pendentes} onStatusChange={handleStatusChange} />
              <AgendamentosSecao titulo="Confirmados" agendamentos={confirmados} onStatusChange={handleStatusChange} />
              <AgendamentosSecao titulo="Cancelados" agendamentos={cancelados} onStatusChange={handleStatusChange} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ResumoCard = ({ titulo, valor, cor = 'text-brand-light' }: { titulo: string; valor: number | string; cor?: string }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between">
    <h3 className="text-base font-medium text-brand-dark mb-2">{titulo}</h3>
    <p className={`text-3xl font-bold ${cor}`}>{valor}</p>
  </div>
);

const AgendamentosSecao = ({
  titulo,
  agendamentos,
  onStatusChange
}: {
  titulo: string;
  agendamentos: any[];
  onStatusChange: (id: string, status: 'confirmado' | 'cancelado') => void;
}) => (
  <div className="mb-8">
    <h3 className="font-semibold text-brand-black text-lg mb-3">
      {titulo} ({agendamentos.length})
    </h3>
    {agendamentos.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agendamentos.map((a) => (
          <AppointmentCard key={a.id} agendamento={a} onStatusChange={onStatusChange} />
        ))}
      </div>
    ) : (
      <p className="text-brand-dark">Nenhum agendamento {titulo.toLowerCase()} para esta data.</p>
    )}
  </div>
);

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getAgendamentosDoDia, updateStatusAgendamento } from '../utils/supabase';
import { AppointmentCard } from '../components/AppointmentCard';
import { CalendarIcon, LoaderIcon, AlertTriangleIcon } from 'lucide-react';
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
        if (!user) {
          navigate('/login');
        }
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
        const faturamento = data.filter(a => a.status === 'confirmado').reduce((total, agendamento) => total + (agendamento.servico?.preco || 0), 0);
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
      setAgendamentos(agendamentos.map(agendamento => agendamento.id === id ? {
        ...agendamento,
        status
      } : agendamento));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Não foi possível atualizar o status do agendamento. Tente novamente.');
    }
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };
  if (loading && agendamentos.length === 0) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderIcon className="h-10 w-10 text-amber-500 animate-spin" />
          <p className="mt-4 text-gray-600">
            Carregando painel administrativo...
          </p>
        </div>
      </div>;
  }
  const pendentes = agendamentos.filter(a => a.status === 'pendente');
  const confirmados = agendamentos.filter(a => a.status === 'confirmado');
  const cancelados = agendamentos.filter(a => a.status === 'cancelado');
  return <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie agendamentos e serviços da Studio Barber 33
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button onClick={() => navigate('/admin/servicos')} className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded">
              Gerenciar Serviços
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Total de Agendamentos
            </h3>
            <p className="text-3xl font-bold text-amber-500">
              {totalAgendamentos}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Faturamento do Dia
            </h3>
            <p className="text-3xl font-bold text-green-500">
              {faturamentoDia.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Confirmados
            </h3>
            <p className="text-3xl font-bold text-blue-500">
              {confirmados.length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
              Agendamentos do Dia
            </h2>
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              <input type="date" value={selectedDate} onChange={handleDateChange} className="border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" />
            </div>
          </div>
          {error ? <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div> : <div>
              <h3 className="font-medium text-gray-700 mb-2">
                Pendentes ({pendentes.length})
              </h3>
              {pendentes.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {pendentes.map(agendamento => <AppointmentCard key={agendamento.id} agendamento={agendamento} onStatusChange={handleStatusChange} />)}
                </div> : <p className="text-gray-500 mb-6">
                  Nenhum agendamento pendente para esta data.
                </p>}
              <h3 className="font-medium text-gray-700 mb-2">
                Confirmados ({confirmados.length})
              </h3>
              {confirmados.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {confirmados.map(agendamento => <AppointmentCard key={agendamento.id} agendamento={agendamento} onStatusChange={handleStatusChange} />)}
                </div> : <p className="text-gray-500 mb-6">
                  Nenhum agendamento confirmado para esta data.
                </p>}
              <h3 className="font-medium text-gray-700 mb-2">
                Cancelados ({cancelados.length})
              </h3>
              {cancelados.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cancelados.map(agendamento => <AppointmentCard key={agendamento.id} agendamento={agendamento} onStatusChange={handleStatusChange} />)}
                </div> : <p className="text-gray-500">
                  Nenhum agendamento cancelado para esta data.
                </p>}
            </div>}
        </div>
      </div>
    </div>;
};
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServicos, getServicoById, Servico } from '../utils/supabase';
import { ScissorsIcon, LoaderIcon, ChevronRightIcon } from 'lucide-react';
import { BarbeiroCard } from '../components/BarbeiroCard';
import { formatCPF, formatTelefone } from '../utils/formatters';
interface Barbeiro {
  id: string;
  nome: string;
  foto: string;
  especialidade: string;
}
export const Booking = () => {
  const {
    servicoId
  } = useParams();
  const navigate = useNavigate();
  const [servico, setServico] = useState<Servico | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedServico, setSelectedServico] = useState<string>(servicoId || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<string>('');
  const barbeiros: Barbeiro[] = [{
    id: '1',
    nome: 'João Silva',
    foto: 'https://images.unsplash.com/photo-1565787154274-c8d076ad34e7?auto=format&fit=crop&w=800&q=80',
    especialidade: 'Especialista em Cortes Modernos'
  }, {
    id: '2',
    nome: 'Pedro Santos',
    foto: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80',
    especialidade: 'Especialista em Barba'
  }];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicosData = await getServicos();
        setServicos(servicosData);
        if (servicoId) {
          const servicoData = await getServicoById(servicoId);
          setServico(servicoData);
          setSelectedServico(servicoId);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [servicoId]);
  useEffect(() => {
    if (selectedDate) {
      const times = [];
      for (let hour = 9; hour <= 19; hour++) {
        if (hour !== 12 && hour !== 13) {
          times.push(`${hour}:00`);
          if (hour !== 19) times.push(`${hour}:30`);
        }
      }
      setAvailableTimes(times);
    }
  }, [selectedDate]);
  const handleServicoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServico(e.target.value);
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
  };
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };
  const handleBarbeiroSelect = (id: string) => {
    setSelectedBarbeiro(id);
  };
  const handleContinue = () => {
    if (!selectedServico || !selectedDate || !selectedTime || !nome || !cpf || !telefone || !selectedBarbeiro) {
      alert('Por favor, preencha todos os campos obrigatórios, incluindo a escolha do barbeiro.');
      return;
    }
    const cpfClean = cpf.replace(/\D/g, '');
    const telefoneClean = telefone.replace(/\D/g, '');
    if (cpfClean.length !== 11) {
      alert('CPF inválido. Digite 11 números.');
      return;
    }
    if (telefoneClean.length < 10) {
      alert('Telefone inválido. Digite pelo menos 10 números incluindo DDD.');
      return;
    }
    const dateTime = `${selectedDate}T${selectedTime}:00`;
    navigate('/pagamento', {
      state: {
        servicoId: selectedServico,
        dataHora: dateTime,
        nome,
        cpf: cpfClean,
        telefone: telefoneClean,
        barbeiroId: selectedBarbeiro,
        barbeiroNome: barbeiros.find(b => b.id === selectedBarbeiro)?.nome
      }
    });
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderIcon className="h-10 w-10 text-amber-500 animate-spin" />
          <p className="mt-4 text-gray-600">Carregando...</p>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-full mb-4">
            <ScissorsIcon className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Agendar Horário</h1>
          <p className="mt-2 text-lg text-gray-600">
            Escolha o serviço, data e horário para seu agendamento
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
            1. Escolha o serviço
          </h2>
          <div className="mb-6">
            <label htmlFor="servico" className="block text-sm font-medium text-gray-700 mb-1">
              Serviço
            </label>
            <select id="servico" value={selectedServico} onChange={handleServicoChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required>
              <option value="">Selecione um serviço</option>
              {servicos.map(s => <option key={s.id} value={s.id}>
                  {s.nome} -{' '}
                  {s.preco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
                </option>)}
            </select>
          </div>
        </div>
        {selectedServico && <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
              2. Escolha a data e horário
            </h2>
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input type="date" id="date" value={selectedDate} onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
            </div>
            {selectedDate && <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário Disponível
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimes.map(time => <button key={time} type="button" className={`py-2 px-3 text-sm border rounded-md ${selectedTime === time ? 'bg-amber-500 border-amber-500 text-black font-medium' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => handleTimeChange(time)}>
                      {time}
                    </button>)}
                </div>
              </div>}
          </div>}
        {selectedServico && selectedDate && selectedTime && <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
              3. Escolha seu barbeiro
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {barbeiros.map(barbeiro => <BarbeiroCard key={barbeiro.id} {...barbeiro} selected={selectedBarbeiro === barbeiro.id} onSelect={handleBarbeiroSelect} />)}
            </div>
          </div>}
        {selectedServico && selectedDate && selectedTime && selectedBarbeiro && <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                4. Seus dados
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
                </div>
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input type="text" id="cpf" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} maxLength={14} placeholder="000.000.000-00" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
                </div>
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input type="text" id="telefone" value={telefone} onChange={e => setTelefone(formatTelefone(e.target.value))} maxLength={15} placeholder="(00) 00000-0000" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
                </div>
              </div>
            </div>}
        <div className="flex justify-end">
          <button type="button" onClick={handleContinue} disabled={!selectedServico || !selectedDate || !selectedTime || !nome || !cpf || !telefone || !selectedBarbeiro} className="inline-flex items-center bg-black text-white px-6 py-3 rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800">
            Continuar para pagamento
            <ChevronRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>;
};
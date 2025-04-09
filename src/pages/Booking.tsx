import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServicos, getServicoById, getAgendamentosPorDia, Servico } from '../utils/supabase';
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
  const { servicoId } = useParams();
  const navigate = useNavigate();

  const [servico, setServico] = useState<Servico | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedServico, setSelectedServico] = useState<string>(servicoId || '');
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const barbeiros: Barbeiro[] = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      nome: 'Carlos Eduardo',
      foto: 'https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      especialidade: '-',
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      nome: 'Caio Augusto',
      foto: 'https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      especialidade: '-',
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      nome: 'Rhian Vinicius',
      foto: 'hhttps://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
      especialidade: '-',
    },
  ];

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
    if (!selectedDate) return;

    const times: string[] = [];
    for (let hour = 9; hour <= 19; hour++) {
      if (hour !== 12 && hour !== 13) {
        const h1 = `${String(hour).padStart(2, '0')}:00`;
        const h2 = `${String(hour).padStart(2, '0')}:30`;
        times.push(h1);
        if (hour !== 19) times.push(h2);
      }
    }
    setAvailableTimes(times);
  }, [selectedDate]);

  useEffect(() => {
    const fetchHorariosOcupados = async () => {
      if (!selectedDate || !selectedBarbeiro) return;

      try {
        const agendamentos = await getAgendamentosPorDia(selectedDate, selectedBarbeiro);
        const horariosOcupados = agendamentos.map((ag: any) => {
          const horaCompleta = ag.data_hora.split('T')[1];
          return horaCompleta.slice(0, 5);
        });

        setAvailableTimes(prev =>
          prev.filter(horario => !horariosOcupados.includes(horario))
        );
      } catch (error) {
        console.error('Erro ao buscar horários ocupados:', error);
      }
    };

    fetchHorariosOcupados();
  }, [selectedDate, selectedBarbeiro]);

  const handleContinue = () => {
    if (!selectedServico || !selectedBarbeiro || !selectedDate || !selectedTime || !nome || !cpf || !telefone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
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
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderIcon className="h-10 w-10 text-brand-aqua animate-spin" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-brand-aqua text-black font-bold py-2 px-4 rounded hover:opacity-90">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-brand-aqua rounded-full mb-4">
            <ScissorsIcon className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Agendar Horário</h1>
          <p className="mt-2 text-lg text-gray-600">
            Escolha o serviço, barbeiro, data e horário
          </p>
        </div>

        {/* 1. Serviço */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">1. Escolha o serviço</h2>
          <select value={selectedServico} onChange={(e) => setSelectedServico(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-aqua focus:border-brand-aqua">
            <option value="">Selecione um serviço</option>
            {servicos.map(s => (
              <option key={s.id} value={s.id}>
                {s.nome} - {s.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Barbeiro */}
        {selectedServico && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">2. Escolha o barbeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {barbeiros.map(barbeiro => (
                <BarbeiroCard
                  key={barbeiro.id}
                  {...barbeiro}
                  selected={selectedBarbeiro === barbeiro.id}
                  onSelect={setSelectedBarbeiro}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. Data e horário */}
        {selectedServico && selectedBarbeiro && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">3. Escolha a data e horário</h2>
            <input type="date" value={selectedDate} onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime('');
            }} min={new Date().toISOString().split('T')[0]} className="w-full mb-4 border-gray-300 rounded-md shadow-sm focus:ring-brand-aqua focus:border-brand-aqua" />
            {selectedDate && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.map(time => (
                  <button key={time} onClick={() => setSelectedTime(time)} className={`py-2 px-3 text-sm border rounded-md ${selectedTime === time ? 'bg-brand-aqua border-brand-aqua text-black font-medium' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                    {time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Dados do cliente */}
        {selectedServico && selectedBarbeiro && selectedDate && selectedTime && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">4. Seus dados</h2>
            <div className="space-y-4">
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-aqua focus:border-brand-aqua" />
              <input type="text" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} maxLength={14} placeholder="CPF" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-aqua focus:border-brand-aqua" />
              <input type="text" value={telefone} onChange={e => setTelefone(formatTelefone(e.target.value))} maxLength={15} placeholder="Telefone" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-aqua focus:border-brand-aqua" />
            </div>
          </div>
        )}

        {/* Botão continuar */}
        <div className="flex justify-end">
          <button type="button" onClick={handleContinue} disabled={!selectedServico || !selectedBarbeiro || !selectedDate || !selectedTime || !nome || !cpf || !telefone} className="inline-flex items-center bg-black text-white px-6 py-3 rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-gray-800">
            Continuar para pagamento
            <ChevronRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
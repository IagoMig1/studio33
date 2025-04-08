import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getServicoById, createAgendamento } from '../utils/supabase';
import { CheckCircleIcon, LoaderIcon, CreditCardIcon } from 'lucide-react';
interface LocationState {
  servicoId: string;
  dataHora: string;
  nome: string;
  cpf: string;
  telefone: string;
  barbeiroId: string;
  barbeiroNome: string;
}
export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState(0);
  const state = location.state as LocationState;
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        if (!state || !state.servicoId || !state.dataHora) {
          setError('Dados de agendamento incompletos. Por favor, volte e tente novamente.');
          setLoading(false);
          return;
        }
        const servico = await getServicoById(state.servicoId);
        setServiceName(servico.nome);
        setServicePrice(servico.preco);
      } catch (error) {
        console.error('Erro ao buscar detalhes do serviço:', error);
        setError('Não foi possível carregar os detalhes do serviço. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetails();
  }, [state]);
  const handleSubmit = async () => {
    if (!state) return;
    setSubmitting(true);
    try {
      await createAgendamento({
        nome: state.nome,
        cpf: state.cpf,
        telefone: state.telefone,
        data_hora: state.dataHora,
        servico_id: state.servicoId,
        pagamento: 'presencial',
        status: 'pendente'
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      setError('Não foi possível finalizar seu agendamento. Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      const dia = date.getDate().toString().padStart(2, '0');
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      return 'Data inválida';
    }
  };
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Horário inválido';
      const hora = date.getHours().toString().padStart(2, '0');
      const minuto = date.getMinutes().toString().padStart(2, '0');
      return `${hora}:${minuto}`;
    } catch (error) {
      return 'Horário inválido';
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderIcon className="h-10 w-10 text-amber-500 animate-spin" />
          <p className="mt-4 text-gray-600">
            Carregando informações de pagamento...
          </p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => navigate('/agendar')} className="bg-amber-500 text-black font-bold py-2 px-4 rounded hover:bg-amber-400">
            Voltar para Agendamento
          </button>
        </div>
      </div>;
  }
  if (success) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Agendamento Confirmado!
          </h2>
          <p className="text-gray-600 mb-6">
            Seu horário foi agendado com sucesso. Você será redirecionado para a
            página inicial em instantes.
          </p>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <p className="text-sm text-gray-600">
              <strong>Serviço:</strong> {serviceName}
              <br />
              <strong>Data:</strong> {state && formatDate(state.dataHora)}
              <br />
              <strong>Horário:</strong> {state && formatTime(state.dataHora)}
              <br />
              <strong>Nome:</strong> {state && state.nome}
              <br />
              <strong>Barbeiro:</strong> {state?.barbeiroNome}
            </p>
          </div>
          <button onClick={() => navigate('/')} className="bg-amber-500 text-black font-bold py-2 px-6 rounded hover:bg-amber-400">
            Voltar ao Início
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500 rounded-full mb-4">
            <CreditCardIcon className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Finalizar Agendamento
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Confira os detalhes do seu agendamento e confirme
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
              Resumo do Agendamento
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Serviço:</span>
                <span className="font-medium">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-medium">
                  {servicePrice.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span className="font-medium">
                  {state && formatDate(state.dataHora)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horário:</span>
                <span className="font-medium">
                  {state && formatTime(state.dataHora)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium">{state && state.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Telefone:</span>
                <span className="font-medium">{state && state.telefone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Barbeiro:</span>
                <span className="font-medium">{state?.barbeiroNome}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6">
            <h3 className="text-lg font-medium mb-4">Forma de Pagamento</h3>
            <div className="border border-gray-200 rounded-md p-4 bg-white">
              <div className="flex items-center">
                <input id="pagamento-local" name="pagamento" type="radio" checked readOnly className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300" />
                <label htmlFor="pagamento-local" className="ml-3 block text-sm font-medium text-gray-700">
                  Pagamento na Barbearia
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500 pl-7">
                Pague diretamente na barbearia no dia do seu atendimento.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300">
            Voltar
          </button>
          <button type="button" onClick={handleSubmit} disabled={submitting} className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {submitting ? 'Processando...' : 'Confirmar Agendamento'}
          </button>
        </div>
      </div>
    </div>;
};
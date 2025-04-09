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
        barbeiro_id: state.barbeiroId,
        pagamento: 'presencial',
        status: 'pendente'
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      setError(error.message || 'Erro desconhecido');
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

  const gerarLinkWhatsApp = () => {
    const mensagem = `
      Olá! Por favor, confirme o meu agendamento:
      Cliente: ${state.nome}
      Serviço: ${serviceName}
      Data: ${formatDate(state.dataHora)}
      Hora: ${formatTime(state.dataHora)}
      Telefone: ${state.telefone}
      Barbeiro: ${state.barbeiroNome}
    `;
    
    const mensagemUrl = encodeURIComponent(mensagem);  // Codifica a mensagem para a URL do WhatsApp
    return `https://wa.me/+5512997310938?text=${mensagemUrl}`;  // Substitua o número pelo WhatsApp da barbearia
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#CBD5E0] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderIcon className="h-10 w-10 text-[#319795] animate-spin" />
          <p className="mt-4 text-[#1A202C]">Carregando informações de pagamento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#CBD5E0] flex justify-center items-center">
        <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
          <p className="text-[#1A202C] mb-4">{error}</p>
          <button
            onClick={() => navigate('/agendar')}
            className="bg-[#319795] text-[#1A202C] font-bold py-2 px-4 rounded hover:bg-[#4FD1C5]"
          >
            Voltar para Agendamento
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#CBD5E0] flex justify-center items-center">
        <div className="bg-[#FFFFFF] p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A202C] mb-2">Agendamento Confirmado!</h2>
          <p className="text-[#1A202C] mb-6">
            Seu horário foi agendado com sucesso. Você será redirecionado para a
            página inicial em instantes.
          </p>
          <div className="bg-[#CBD5E0] p-4 rounded-md mb-4">
            <p className="text-sm text-[#1A202C]">
              <strong>Serviço:</strong> {serviceName}
              <br />
              <strong>Data:</strong> {formatDate(state.dataHora)}
              <br />
              <strong>Horário:</strong> {formatTime(state.dataHora)}
              <br />
              <strong>Nome:</strong> {state.nome}
              <br />
              <strong>Barbeiro:</strong> {state.barbeiroNome}
            </p>
          </div>
          <a
            href={gerarLinkWhatsApp()}  // Link para WhatsApp gerado com os dados do agendamento
            target="_blank"
            className="bg-[#319795] text-white px-6 py-3 rounded-md font-medium hover:bg-[#4FD1C5]"
          >
            Confirmar via WhatsApp
          </a>
          <button
            onClick={() => navigate('/')}
            className="bg-[#319795] text-[#1A202C] font-bold py-2 px-6 rounded hover:bg-[#4FD1C5] mt-4"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#CBD5E0] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#319795] rounded-full mb-4">
            <CreditCardIcon className="h-8 w-8 text-[#FFFFFF]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A202C]">Finalizar Agendamento</h1>
          <p className="mt-2 text-lg text-[#1A202C]">
            Confira os detalhes do seu agendamento e confirme
          </p>
        </div>
        <div className="bg-[#FFFFFF] rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#CBD5E0]">
              Resumo do Agendamento
            </h2>
            <div className="space-y-4">
              <Info label="Serviço" value={serviceName} />
              <Info label="Valor" value={servicePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
              <Info label="Data" value={formatDate(state.dataHora)} />
              <Info label="Horário" value={formatTime(state.dataHora)} />
              <Info label="Cliente" value={state.nome} />
              <Info label="Telefone" value={state.telefone} />
              <Info label="Barbeiro" value={state.barbeiroNome} />
            </div>
          </div>
          <div className="bg-[#CBD5E0] p-6">
            <h3 className="text-lg font-medium mb-4 text-[#1A202C]">Forma de Pagamento</h3>
            <div className="border border-[#CBD5E0] rounded-md p-4 bg-[#FFFFFF]">
              <div className="flex items-center">
                <input
                  id="pagamento-local"
                  name="pagamento"
                  type="radio"
                  checked
                  readOnly
                  className="h-4 w-4 text-[#319795] focus:ring-[#319795] border-[#CBD5E0]"
                />
                <label htmlFor="pagamento-local" className="ml-3 block text-sm font-medium text-[#1A202C]">
                  Pagamento na Barbearia
                </label>
              </div>
              <p className="mt-2 text-sm text-[#1A202C] pl-7">
                Pague diretamente na barbearia no dia do seu atendimento.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-[#CBD5E0] text-[#1A202C] px-6 py-3 rounded-md font-medium hover:bg-[#A0AEC0]"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#1A202C] text-white px-6 py-3 rounded-md font-medium hover:bg-[#285E61] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processando...' : 'Confirmar Agendamento'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-[#1A202C]">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

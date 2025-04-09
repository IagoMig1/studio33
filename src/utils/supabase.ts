import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://jzqbegstsseheaovevxi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cWJlZ3N0c3NlaGVhb3ZldnhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNzkzMTYsImV4cCI6MjA1OTY1NTMxNn0.qUs94Xab74kmBQOXn7N5PsBtGyuh__77K6E5AD93R0g';
export const supabase = createClient(supabaseUrl, supabaseKey);
// Tipos
export interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracao: number;
  ativo: boolean;
  criado_em: string;
}
export interface Agendamento {
  id: string;
  nome: string;
  telefone: string;
  data_hora: string;
  servico_id: string;
  pagamento: 'pix' | 'cartão' | 'presencial';
  status: 'pendente' | 'confirmado' | 'cancelado';
  criado_em: string;
  barbeiro_id: string; // ID do barbeiro
  barbeiros?: { nome: string }; // Dados do barbeiro relacionado
} interface Usuario {
  id: string;
  role: 'admin' | 'cliente';
}
// Funções para serviços
export const getServicos = async () => {
  const {
    data,
    error
  } = await supabase.from('servicos').select('*').eq('ativo', true).order('nome');
  if (error) throw error;
  return data as Servico[];
};
export const getServicoById = async (id: string) => {
  const {
    data,
    error
  } = await supabase.from('servicos').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Servico;
};
export const createServico = async (servico: Omit<Servico, 'id' | 'criado_em'>) => {
  const {
    data,
    error
  } = await supabase.from('servicos').insert(servico).select();
  if (error) throw error;
  return data[0] as Servico;
};
export const updateServico = async (id: string, servico: Partial<Servico>) => {
  const {
    data,
    error
  } = await supabase.from('servicos').update(servico).eq('id', id).select();
  if (error) throw error;
  return data[0] as Servico;
};
export const deleteServico = async (id: string) => {
  const {
    error
  } = await supabase.from('servicos').update({
    ativo: false
  }).eq('id', id);
  if (error) throw error;
  return true;
};
// Verifique se você já tem a função assíncrona correta, então remova qualquer duplicata
export const getAgendamentos = async (): Promise<Agendamento[]> => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select(`
      id,
      nome,
      telefone,
      data_hora,
      servico_id,
      pagamento,
      status,
      criado_em,
      barbeiro_id,
      barbeiros:barbeiro_id (nome) -- Relacionamento correto
    `);

  if (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return [];
  }

  console.log('Agendamentos com barbeiro:', data);
  return data as Agendamento[];
};







export const getAgendamentosDoDia = async (data: string) => {
  const dataInicio = new Date(`${data}T00:00:00-03:00`).toISOString();
  const dataFim = new Date(`${data}T23:59:59-03:00`).toISOString();

  const { data: agendamentos, error } = await supabase
    .from('agendamentos')
    .select(`
      *,
      servico:servico_id (
        nome,
        preco
      ),
      barbeiros:barbeiros!fk_barbeiro (
        nome
      )
    `)
    
    .gte('data_hora', dataInicio)
    .lte('data_hora', dataFim)
    .order('data_hora');

  if (error) throw error;
  return agendamentos as Agendamento[];
};




export const createAgendamento = async (data: {
  nome: string;
  cpf: string;
  telefone: string;
  data_hora: string;
  servico_id: string;
  barbeiro_id: string;
  pagamento: string;
  status: string;
}) => {
  const { data: existing, error: fetchError } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('data_hora', data.data_hora)
    .eq('barbeiro_id', data.barbeiro_id);

  if (fetchError) throw fetchError;

  if (existing.length > 0) {
    throw new Error('Horário já está ocupado para esse barbeiro.');
  }

  const { error: insertError } = await supabase
    .from('agendamentos')
    .insert(data);

  if (insertError) throw insertError;
};


export const updateStatusAgendamento = async (id: string, status: 'pendente' | 'confirmado' | 'cancelado') => {
  const {
    data,
    error
  } = await supabase.from('agendamentos').update({
    status
  }).eq('id', id).select();
  if (error) throw error;
  return data[0] as Agendamento;
};
// Autenticação
export const login = async (email: string, password: string) => {
  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};
export const logout = async () => {
  const {
    error
  } = await supabase.auth.signOut();
  if (error) throw error;
};
export const getCurrentUser = async () => {
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();
  return user;
};
export const getUserRole = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  const {
    data,
    error
  } = await supabase.from('perfis').select('role').eq('id', user.id).single();
  if (error) return null;
  return data.role;
};

// utils/supabase.ts

export async function getAgendamentosPorDia(date: string, barbeiroId: string) {
  const startOfDay = `${date}T00:00:00`;
  const endOfDay = `${date}T23:59:59`;

  const { data, error } = await supabase
    .from('agendamentos')
    .select('data_hora')
    .eq('barbeiro_id', barbeiroId)
    .gte('data_hora', startOfDay)
    .lte('data_hora', endOfDay);

  if (error) {
    console.error('Erro ao buscar agendamentos por dia:', error.message);
    return [];
  }

  return data || [];
}




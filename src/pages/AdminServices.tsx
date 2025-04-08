import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getServicos, createServico, updateServico, deleteServico, Servico } from '../utils/supabase';
import { ServiceCard } from '../components/ServiceCard';
import { PlusIcon, LoaderIcon, XIcon } from 'lucide-react';
export const AdminServices = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServico, setCurrentServico] = useState<Partial<Servico>>({
    nome: '',
    preco: 0,
    duracao: 30,
    ativo: true
  });
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
    const fetchServicos = async () => {
      try {
        const data = await getServicos();
        setServicos(data);
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicos();
  }, []);
  const handleOpenModal = (isEdit = false, servico?: Servico) => {
    if (isEdit && servico) {
      setCurrentServico(servico);
      setIsEditing(true);
    } else {
      setCurrentServico({
        nome: '',
        preco: 0,
        duracao: 30,
        ativo: true
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    if (type === 'number') {
      setCurrentServico({
        ...currentServico,
        [name]: parseFloat(value)
      });
    } else {
      setCurrentServico({
        ...currentServico,
        [name]: value
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentServico.id) {
        const updated = await updateServico(currentServico.id, currentServico);
        setServicos(servicos.map(s => s.id === updated.id ? updated : s));
      } else {
        const created = await createServico(currentServico as Omit<Servico, 'id' | 'criado_em'>);
        setServicos([...servicos, created]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Não foi possível salvar o serviço. Tente novamente.');
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await deleteServico(id);
        setServicos(servicos.filter(s => s.id !== id));
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        alert('Não foi possível excluir o serviço. Tente novamente.');
      }
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <LoaderIcon className="h-10 w-10 text-amber-500 animate-spin" />
          <p className="mt-4 text-gray-600">Carregando serviços...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Serviços
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Adicione, edite ou remova serviços oferecidos pela Studio Barber
              33
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button onClick={() => navigate('/admin')} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
              Voltar ao Painel
            </button>
            <button onClick={() => handleOpenModal()} className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" />
              Novo Serviço
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Serviços Disponíveis
          </h2>
          {servicos.length === 0 ? <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhum serviço cadastrado.</p>
              <button onClick={() => handleOpenModal()} className="bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded inline-flex items-center">
                <PlusIcon className="h-5 w-5 mr-1" />
                Adicionar Serviço
              </button>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicos.map(servico => <ServiceCard key={servico.id} servico={servico} isAdminView={true} onEdit={() => handleOpenModal(true, servico)} onDelete={() => handleDelete(servico.id)} />)}
            </div>}
        </div>
      </div>
      {/* Modal de Serviço */}
      {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Serviço
                  </label>
                  <input type="text" id="nome" name="nome" value={currentServico.nome} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
                </div>
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <input type="number" id="preco" name="preco" min="0" step="0.01" value={currentServico.preco} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
                </div>
                <div>
                  <label htmlFor="duracao" className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (minutos)
                  </label>
                  <input type="number" id="duracao" name="duracao" min="5" step="5" value={currentServico.duracao} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500" required />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-300">
                  Cancelar
                </button>
                <button type="submit" className="bg-amber-500 text-black px-4 py-2 rounded font-medium hover:bg-amber-600">
                  {isEditing ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
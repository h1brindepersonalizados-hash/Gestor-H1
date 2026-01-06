import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { PlusCircleIcon, SearchIcon, EditIcon, Trash2Icon } from '../components/icons';
import ClientForm from '../components/ClientForm';
import type { Client } from '../types';
import { formatDoc, formatPhone } from '../utils/helpers';

const Clients: React.FC = () => {
  const { state, dispatch } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    return state.clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''))
    );
  }, [state.clients, searchTerm]);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };
  
  const handleDeleteClient = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
        dispatch({ type: 'DELETE_CLIENT', payload: id });
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
        <button
          onClick={handleAddClient}
          className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Novo Cliente
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">CPF/CNPJ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map(client => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{formatDoc(client.doc)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPhone(client.phone)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <button onClick={() => handleEditClient(client)} className="text-indigo-600 hover:text-indigo-900">
                        <EditIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={() => handleDeleteClient(client.id)} className="text-red-600 hover:text-red-900">
                        <Trash2Icon className="w-5 h-5"/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {filteredClients.length === 0 && <p className="text-center py-4 text-gray-500">Nenhum cliente encontrado.</p>}
      </div>

      {isModalOpen && (
        <ClientForm
          client={editingClient}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Clients;
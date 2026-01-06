
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import type { Client } from '../types';
import { useData } from '../context/DataContext';

interface ClientFormProps {
  client: Client | null;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
  const { dispatch } = useData();
  const [formData, setFormData] = useState<Client>(
    client || {
      id: '', name: '', doc: '', phone: '',
      address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
      observations: ''
    }
  );

  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    const cep = formData.address.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      setCepLoading(true);
      // Simulating fetch from ViaCEP API
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf
              }
            }));
          }
        })
        .catch(console.error)
        .finally(() => setCepLoading(false));
    }
  }, [formData.address.cep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
        const addressField = name.split('.')[1];
        setFormData(prev => ({ ...prev, address: { ...prev.address, [addressField]: value } }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      dispatch({ type: 'UPDATE_CLIENT', payload: formData });
    } else {
      dispatch({ type: 'ADD_CLIENT', payload: { ...formData, id: `c${Date.now()}` } });
    }
    onClose();
  };

  return (
    <Modal title={client ? 'Editar Cliente' : 'Novo Cliente'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo / Razão Social</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF / CNPJ</label>
            <input type="text" name="doc" value={formData.doc} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">CEP</label>
                    <input type="text" name="address.cep" value={formData.address.cep} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                    {cepLoading && <p className="text-xs text-blue-500 mt-1">Buscando CEP...</p>}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Rua / Logradouro</label>
                    <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Número</label>
                    <input type="text" name="address.number" value={formData.address.number} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Complemento</label>
                    <input type="text" name="address.complement" value={formData.address.complement} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Bairro</label>
                    <input type="text" name="address.neighborhood" value={formData.address.neighborhood} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Cidade</label>
                    <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                </div>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea name="observations" value={formData.observations} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md"></textarea>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
            Cancelar
          </button>
          <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">
            {client ? 'Salvar Alterações' : 'Cadastrar Cliente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientForm;
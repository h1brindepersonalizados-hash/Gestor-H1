import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Trash2Icon, PlusCircleIcon, SearchIcon } from '../components/icons';
import { formatCurrency } from '../utils/helpers';
import type { QuoteItem, Quote } from '../types';
import { QuoteStatus } from '../types';

const QuoteForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useData();
  const { clients, products } = state;

  const isEditing = !!id;
  
  const existingQuote = useMemo(() => {
    return id ? state.quotes.find(q => q.id === id) : null;
  }, [id, state.quotes]);

  const [clientId, setClientId] = useState(existingQuote?.clientId || '');
  const [items, setItems] = useState<QuoteItem[]>(existingQuote?.items || []);
  const [deliveryTime, setDeliveryTime] = useState(existingQuote?.deliveryTime || '');
  const [paymentMethod, setPaymentMethod] = useState(existingQuote?.paymentMethod || '');
  const [observations, setObservations] = useState(existingQuote?.observations || '');
  
  const [productSearch, setProductSearch] = useState('');

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [items]);

  const availableProducts = useMemo(() => {
    return products.filter(p => 
      !items.some(item => item.productId === p.id) &&
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, items, productSearch]);
  
  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setItems([...items, { productId, quantity: 1, unitPrice: product.sellPrice }]);
      setProductSearch('');
    }
  };

  const handleUpdateItem = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
    const newItems = [...items];
    if(value >= 0) {
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || items.length === 0) {
      alert('Por favor, selecione um cliente e adicione pelo menos um produto.');
      return;
    }

    const quoteData: Quote = {
      id: isEditing ? existingQuote!.id : `q${Date.now()}`,
      clientId,
      items,
      total,
      deliveryTime,
      paymentMethod,
      observations,
      status: isEditing ? existingQuote!.status : QuoteStatus.Open,
      createdAt: isEditing ? existingQuote!.createdAt : new Date(),
    };
    
    if (isEditing) {
        dispatch({ type: 'UPDATE_QUOTE', payload: quoteData });
    } else {
        dispatch({ type: 'ADD_QUOTE', payload: quoteData });
    }

    navigate(`/quotes/${quoteData.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Editar' : 'Novo'} Orçamento</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cliente</h2>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="" disabled>Selecione um cliente</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Itens do Orçamento</h2>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2">Produto</th>
                <th className="text-right py-2">Qtd.</th>
                <th className="text-right py-2">Vlr. Unit.</th>
                <th className="text-right py-2">Subtotal</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <tr key={index} className="border-t">
                    <td className="py-2 pr-2">{product?.name || 'Produto não encontrado'}</td>
                    <td className="py-2 px-2">
                        <input type="number" value={item.quantity} onChange={(e) => handleUpdateItem(index, 'quantity', parseFloat(e.target.value))} className="w-20 text-right p-1 border rounded" />
                    </td>
                    <td className="py-2 px-2">
                        <input type="number" step="0.01" value={item.unitPrice} onChange={(e) => handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value))} className="w-24 text-right p-1 border rounded" />
                    </td>
                    <td className="py-2 pl-2 text-right font-semibold">{formatCurrency(item.quantity * item.unitPrice)}</td>
                    <td className="py-2 pl-2 text-center">
                      <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                          <Trash2Icon className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
           {items.length === 0 && <p className="text-center py-4 text-gray-500">Nenhum produto adicionado.</p>}
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon className="w-5 h-5 text-gray-400" /></span>
          <input type="text" placeholder="Adicionar produto..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full pl-10 p-2 border rounded-lg" />
          {productSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {availableProducts.map(p => (
                <div key={p.id} onClick={() => handleAddProduct(p.id)} className="p-2 hover:bg-gray-100 cursor-pointer">{p.name} - {formatCurrency(p.sellPrice)}</div>
              ))}
              {availableProducts.length === 0 && <div className="p-2 text-gray-500">Nenhum produto encontrado</div>}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Detalhes e Total</h2>
        <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Prazo de Entrega</label>
                <input type="text" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                <input type="text" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea value={observations} onChange={(e) => setObservations(e.target.value)} rows={3} className="w-full mt-1 p-2 border rounded-lg"></textarea>
            </div>
        </div>
        <div className="text-right mt-6">
            <span className="text-2xl font-bold text-gray-800">Total: {formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button type="button" onClick={() => navigate(-1)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">{isEditing ? 'Salvar Alterações' : 'Criar Orçamento'}</button>
      </div>
    </form>
  );
};

export default QuoteForm;
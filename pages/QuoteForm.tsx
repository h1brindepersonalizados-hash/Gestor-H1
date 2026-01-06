import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Trash2Icon, SearchIcon } from '../components/icons';
import { formatCurrency, getMinShippingDateISO } from '../utils/helpers';
import type { QuoteItem, Quote } from '../types';
import { QuoteStatus } from '../types';

const QuoteForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useData();
  const { clients, products, quotes, draftQuote } = state;

  const isEditing = !!id;
  
  const existingQuote = useMemo(() => {
    return id ? quotes.find(q => q.id === id) : null;
  }, [id, quotes]);

  const [productSearch, setProductSearch] = useState('');
  const minDate = useMemo(() => getMinShippingDateISO(), []);

  // Effect to initialize or clear the draft when the component mounts or route changes
  useEffect(() => {
    const defaultNewQuote: Partial<Quote> = {
      clientId: '', items: [], shippingDate: '', paymentMethod: '',
      observations: '', shippingFee: 0, status: QuoteStatus.Open
    };

    if (isEditing) {
        // Editing: if draft is not for this quote, load it from main state
        if (!draftQuote || draftQuote.id !== id) {
            // If quote is not found for the ID, it could be a bad link.
            // We'll proceed with an empty form to avoid crashing, but this could be improved (e.g., redirect).
            const initialDraft = existingQuote ? { ...existingQuote } : { ...defaultNewQuote, id };
            dispatch({ type: 'SET_DRAFT_QUOTE', payload: initialDraft });
        }
    } else {
        // Creating: if no draft exists, or if the draft is from an old edit (has an ID), reset it
        if (!draftQuote || draftQuote.id) {
            dispatch({ type: 'SET_DRAFT_QUOTE', payload: defaultNewQuote });
        }
    }
  }, [id, isEditing, existingQuote, draftQuote, dispatch]);
  
  const subtotal = useMemo(() => {
    return draftQuote?.items?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0;
  }, [draftQuote?.items]);

  const total = useMemo(() => {
    return subtotal + (draftQuote?.shippingFee || 0);
  }, [subtotal, draftQuote?.shippingFee]);

  const availableProducts = useMemo(() => {
    return products.filter(p => 
      !draftQuote?.items?.some(item => item.productId === p.id) &&
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, draftQuote?.items, productSearch]);

  const updateDraft = (updatedFields: Partial<Quote>) => {
    dispatch({ type: 'SET_DRAFT_QUOTE', payload: { ...(draftQuote || {}), ...updatedFields, id: isEditing ? id : undefined } });
  }
  
  const handleAddProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newItems = [...(draftQuote?.items || []), { productId, quantity: 1, unitPrice: product.sellPrice }];
      updateDraft({ items: newItems });
      setProductSearch('');
    }
  };

  const handleUpdateItem = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
    if (!draftQuote?.items) return;
    const newItems = [...draftQuote.items];
    if(value >= 0) {
        newItems[index] = { ...newItems[index], [field]: value };
        updateDraft({ items: newItems });
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = draftQuote?.items?.filter((_, i) => i !== index) || [];
    updateDraft({ items: newItems });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftQuote || !draftQuote.clientId || draftQuote.clientId === '' || !draftQuote.items || draftQuote.items.length === 0) {
      alert('Por favor, selecione um cliente e adicione pelo menos um produto.');
      return;
    }

    if (isEditing && !existingQuote) {
        alert('Erro: O orçamento que você está tentando editar não foi encontrado.');
        navigate('/quotes');
        return;
    }

    const quoteData: Quote = {
      id: isEditing ? existingQuote.id : `q${Date.now()}`,
      clientId: draftQuote.clientId,
      items: draftQuote.items,
      shippingFee: draftQuote.shippingFee || 0,
      total: total,
      shippingDate: draftQuote.shippingDate || '',
      paymentMethod: draftQuote.paymentMethod || '',
      observations: draftQuote.observations || '',
      status: isEditing ? existingQuote.status : QuoteStatus.Open,
      createdAt: isEditing ? existingQuote.createdAt : new Date(),
    };
    
    if (isEditing) {
        dispatch({ type: 'UPDATE_QUOTE', payload: quoteData });
    } else {
        dispatch({ type: 'ADD_QUOTE', payload: quoteData });
    }
    
    // Clear draft after successful submission
    dispatch({ type: 'SET_DRAFT_QUOTE', payload: null });
    navigate(`/quotes/${quoteData.id}`);
  };

  if (!draftQuote) {
    return <div>Carregando formulário...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Editar' : 'Novo'} Orçamento</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cliente</h2>
        <select
          value={draftQuote.clientId || ''}
          onChange={(e) => updateDraft({ clientId: e.target.value })}
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
              {draftQuote.items?.map((item, index) => {
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
           {draftQuote.items?.length === 0 && <p className="text-center py-4 text-gray-500">Nenhum produto adicionado.</p>}
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
                <label className="block text-sm font-medium text-gray-700">Data de Envio</label>
                <input
                  type="date"
                  value={draftQuote.shippingDate || ''}
                  min={minDate}
                  onChange={(e) => updateDraft({ shippingDate: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg"
                  required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
                <input type="text" value={draftQuote.paymentMethod || ''} onChange={(e) => updateDraft({ paymentMethod: e.target.value })} className="w-full mt-1 p-2 border rounded-lg" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Frete (R$)</label>
                <input 
                    type="number" 
                    step="0.01"
                    value={draftQuote.shippingFee || 0} 
                    onChange={(e) => updateDraft({ shippingFee: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 p-2 border rounded-lg" 
                />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea value={draftQuote.observations || ''} onChange={(e) => updateDraft({ observations: e.target.value })} rows={3} className="w-full mt-1 p-2 border rounded-lg"></textarea>
            </div>
        </div>
        <div className="text-right mt-6 space-y-2">
            <p className="text-lg text-gray-600">Subtotal: {formatCurrency(subtotal)}</p>
            <p className="text-lg text-gray-600">Frete: {formatCurrency(draftQuote.shippingFee || 0)}</p>
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
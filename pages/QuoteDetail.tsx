import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PrinterIcon, WhatsAppIcon, EditIcon, Trash2Icon, H1BrindesLogo } from '../components/icons';
import { formatCurrency, formatDate, formatPhone } from '../utils/helpers';
import { QuoteStatus } from '../types';
import type { Quote } from '../types';

const QuoteDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { state, dispatch } = useData();
    const navigate = useNavigate();
    const quote = state.quotes.find(q => q.id === id);
    const { companyData } = state;
    
    if (!quote) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl text-gray-700">Orçamento não encontrado</h1>
                <Link to="/quotes" className="text-primary hover:text-secondary mt-4 inline-block">Voltar para a lista de orçamentos</Link>
            </div>
        );
    }
    
    const client = state.clients.find(c => c.id === quote.clientId);
    
    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
            dispatch({ type: 'DELETE_QUOTE', payload: quote.id });
            navigate('/quotes');
        }
    };
    
    const handleStatusChange = (status: QuoteStatus) => {
        dispatch({ type: 'UPDATE_QUOTE_STATUS', payload: { id: quote.id, status } });
    }

    const generateWhatsAppMessage = (quote: Quote) => {
        const clientName = client?.name || 'Prezado(a) cliente';
        let message = `Olá, ${clientName}!\n\n`;
        message += `Segue o seu orçamento da *${companyData.name}* (Nº ${quote.id.substring(0,6)}):\n\n`;
        
        quote.items.forEach(item => {
            const product = state.products.find(p => p.id === item.productId);
            if (product) {
                message += `*${product.name}*\n`;
                message += `_Qtd: ${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.quantity * item.unitPrice)}_\n\n`;
            }
        });
        
        message += `*VALOR TOTAL: ${formatCurrency(quote.total)}*\n\n`;
        message += `Forma de Pagamento: ${quote.paymentMethod}\n`;
        message += `Prazo de Entrega: ${quote.deliveryTime}\n\n`;
        if (quote.observations) {
            message += `Observações: ${quote.observations}\n\n`;
        }
        message += `Qualquer dúvida, estamos à disposição!\n\n`;
        message += `*${companyData.name}*\n`;
        message += `${companyData.phone}\n`;
        message += `${companyData.email}`;
        
        return encodeURIComponent(message);
    }

    const sendWhatsApp = () => {
        if(client?.phone) {
            const message = generateWhatsAppMessage(quote);
            const phone = client.phone.replace(/\D/g, '');
            window.open(`https://api.whatsapp.com/send?phone=55${phone}&text=${message}`, '_blank');
        } else {
            alert('Cliente não possui um número de telefone cadastrado.');
        }
    }
    
    const handlePrint = () => {
        window.print();
    }

    const getStatusBadge = (status: QuoteStatus) => {
        switch (status) {
          case QuoteStatus.Approved: return 'bg-green-100 text-green-800';
          case QuoteStatus.Canceled: return 'bg-red-100 text-red-800';
          default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto print:shadow-none">
            <header className="flex flex-col items-center text-center mb-8 pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold text-primary">{companyData.name}</h2>
                    <p className="text-sm text-gray-600">{companyData.doc}</p>
                </div>
                <H1BrindesLogo className="w-32 h-auto my-4" />
                <div className="text-sm text-gray-600">
                    <p>{companyData.address.street}</p>
                    <p>{`${companyData.address.city}, ${companyData.address.state} - CEP: ${companyData.address.cep}`}</p>
                    <p><strong>Telefone:</strong> {companyData.phone}</p>
                    <p><strong>Email:</strong> {companyData.email}</p>
                </div>
            </header>

            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Orçamento #{quote.id.substring(0, 6)}</h1>
                    <p className="text-sm text-gray-500 mt-1">Data: {formatDate(quote.createdAt)}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadge(quote.status)}`}>
                        {quote.status}
                    </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Cliente</h2>
                    {client ? (
                        <div className="text-gray-600">
                            <p className="font-bold">{client.name}</p>
                            <p>{formatPhone(client.phone)}</p>
                            <p>{client.address.street}, {client.address.number}</p>
                            <p>{client.address.city} - {client.address.state}</p>
                        </div>
                    ) : <p className="text-gray-500">Cliente não encontrado.</p>}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Detalhes</h2>
                    <div className="text-gray-600">
                      <p><span className="font-semibold">Pagamento:</span> {quote.paymentMethod}</p>
                      <p><span className="font-semibold">Prazo de Entrega:</span> {quote.deliveryTime}</p>
                       {quote.observations && <p><span className="font-semibold">Observações:</span> {quote.observations}</p>}
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qtd</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Vlr. Unit.</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {quote.items.map((item, index) => {
                            const product = state.products.find(p => p.id === item.productId);
                            return (
                                <tr key={index}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{product?.name || 'Produto Removido'}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-600">{item.quantity}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-600">{formatCurrency(item.unitPrice)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-800">{formatCurrency(item.unitPrice * item.quantity)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end items-center mb-8">
                <div className="text-right">
                    <p className="text-gray-600">Subtotal: {formatCurrency(quote.total)}</p>
                    <p className="text-xl font-bold text-gray-800">Total: {formatCurrency(quote.total)}</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t print:hidden">
                <div className="flex space-x-2 mb-4 sm:mb-0">
                    <button onClick={() => handleStatusChange(QuoteStatus.Approved)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 disabled:bg-gray-300" disabled={quote.status === QuoteStatus.Approved}>Aprovar</button>
                    <button onClick={() => handleStatusChange(QuoteStatus.Canceled)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 disabled:bg-gray-300" disabled={quote.status === QuoteStatus.Canceled}>Cancelar</button>
                    <button onClick={() => handleStatusChange(QuoteStatus.Open)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 disabled:bg-gray-300" disabled={quote.status === QuoteStatus.Open}>Reabrir</button>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={sendWhatsApp} className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"><WhatsAppIcon className="w-5 h-5 mr-2"/> WhatsApp</button>
                    <button onClick={handlePrint} className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"><PrinterIcon className="w-5 h-5 mr-2"/> Imprimir/PDF</button>
                    <button onClick={() => navigate(`/quotes/edit/${quote.id}`)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary"><EditIcon className="w-5 h-5"/></button>
                    <button onClick={handleDelete} className="flex items-center bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"><Trash2Icon className="w-5 h-5"/></button>
                </div>
            </div>

        </div>
    );
};

export default QuoteDetail;
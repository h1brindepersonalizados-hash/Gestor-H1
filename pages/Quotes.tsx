
import React from 'react';
import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircleIcon } from '../components/icons';
import type { Quote } from '../types';
import { QuoteStatus } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';

const Quotes: React.FC = () => {
  const { state } = useData();
  const navigate = useNavigate();

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case QuoteStatus.Approved:
        return 'bg-green-100 text-green-800';
      case QuoteStatus.Canceled:
        return 'bg-red-100 text-red-800';
      case QuoteStatus.Open:
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orçamentos</h1>
        <button
          onClick={() => navigate('/quotes/new')}
          className="flex items-center bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Novo Orçamento
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Data</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ver</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.quotes.map(quote => {
              const client = state.clients.find(c => c.id === quote.clientId);
              return (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{quote.id.substring(0, 6)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{formatDate(quote.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatCurrency(quote.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/quotes/${quote.id}`} className="text-indigo-600 hover:text-indigo-900">
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {state.quotes.length === 0 && <p className="text-center py-4 text-gray-500">Nenhum orçamento encontrado.</p>}
      </div>
    </div>
  );
};

export default Quotes;

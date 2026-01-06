import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { useData } from '../context/DataContext';
import { UsersIcon, PackageIcon, FileTextIcon } from '../components/icons';
import { formatCurrency, formatDate } from '../utils/helpers';
import { QuoteStatus } from '../types';

const Dashboard: React.FC = () => {
  const { state } = useData();
  const { clients, products, quotes, user } = state;
  
  const isDefaultPassword = user.password === '123';

  const quotesThisMonth = quotes.filter(q => {
    const quoteDate = q.createdAt;
    const today = new Date();
    return quoteDate.getMonth() === today.getMonth() && quoteDate.getFullYear() === today.getFullYear();
  });
  
  const recentQuotes = quotes.slice(0, 5);

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
      {isDefaultPassword && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md shadow-sm" role="alert">
          <p className="font-bold">Aviso de Segurança</p>
          <p>Sua senha é a padrão. Por segurança, recomendamos fortemente que você <Link to="/settings" className="font-bold underline hover:text-yellow-800">altere sua senha</Link> o mais rápido possível.</p>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total de Clientes" value={clients.length} icon={<UsersIcon className="w-6 h-6 text-white" />} color="bg-primary" />
        <DashboardCard title="Total de Produtos" value={products.length} icon={<PackageIcon className="w-6 h-6 text-white" />} color="bg-success" />
        <DashboardCard title="Orçamentos do Mês" value={quotesThisMonth.length} icon={<FileTextIcon className="w-6 h-6 text-white" />} color="bg-accent" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Orçamentos Recentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentQuotes.map(quote => {
                const client = clients.find(c => c.id === quote.clientId);
                return (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/quotes/${quote.id}`} className="text-sm font-medium text-primary hover:text-secondary">
                        {client?.name || 'Cliente não encontrado'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(quote.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{formatCurrency(quote.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
           {recentQuotes.length === 0 && <p className="text-center py-4 text-gray-500">Nenhum orçamento recente.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-gray-700">Página não encontrada</p>
      <p className="mt-2 text-gray-500">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 font-semibold text-white transition-colors duration-300 rounded-md bg-primary hover:bg-secondary"
      >
        Voltar para o Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
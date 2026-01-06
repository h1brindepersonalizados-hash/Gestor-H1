
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import type { Client, Product, Quote, CompanyData } from '../types';
import { MOCK_CLIENTS, MOCK_PRODUCTS, MOCK_QUOTES } from '../data/mockData';
import { COMPANY_DATA } from '../data/companyData';
import { QuoteStatus } from '../types';

interface AppState {
  clients: Client[];
  products: Product[];
  quotes: Quote[];
  companyData: CompanyData;
}

type Action =
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_QUOTE'; payload: Quote }
  | { type: 'UPDATE_QUOTE'; payload: Quote }
  | { type: 'DELETE_QUOTE'; payload: string }
  | { type: 'UPDATE_QUOTE_STATUS'; payload: { id: string; status: QuoteStatus } }
  | { type: 'UPDATE_COMPANY_DATA', payload: CompanyData };

const initialState: AppState = {
  clients: MOCK_CLIENTS,
  products: MOCK_PRODUCTS,
  quotes: MOCK_QUOTES,
  companyData: COMPANY_DATA,
};

const dataReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter((c) => c.id !== action.payload) };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
        return {
            ...state,
            products: state.products.map((p) => (p.id === action.payload.id ? action.payload : p)),
        };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter((p) => p.id !== action.payload) };
    case 'ADD_QUOTE':
        return { ...state, quotes: [action.payload, ...state.quotes] };
    case 'UPDATE_QUOTE':
        return {
            ...state,
            quotes: state.quotes.map((q) => (q.id === action.payload.id ? action.payload : q)),
        };
    case 'DELETE_QUOTE':
        return { ...state, quotes: state.quotes.filter((q) => q.id !== action.payload) };
    case 'UPDATE_QUOTE_STATUS':
        return {
            ...state,
            quotes: state.quotes.map((q) => q.id === action.payload.id ? {...q, status: action.payload.status} : q),
        };
    case 'UPDATE_COMPANY_DATA':
        return {
            ...state,
            companyData: action.payload,
        };
    default:
      return state;
  }
};

const DataContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
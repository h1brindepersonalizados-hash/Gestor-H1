
export interface Client {
  id: string;
  name: string;
  doc: string; // CPF or CNPJ
  phone: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  observations: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  costPrice: number;
  sellPrice: number;
}

export enum QuoteStatus {
  Open = 'Aberto',
  Approved = 'Aprovado',
  Canceled = 'Cancelado',
}

export interface QuoteItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id:string;
  clientId: string;
  items: QuoteItem[];
  shippingFee: number;
  total: number;
  shippingDate: string;
  paymentMethod: string;
  observations: string;
  status: QuoteStatus;
  createdAt: Date;
}

export interface CompanyData {
  name: string;
  doc: string;
  address: {
    street: string;
    city: string;
    state: string;
    cep: string;
  };
  phone: string;
  email: string;
}

export interface User {
    email: string;
    password: string;
}
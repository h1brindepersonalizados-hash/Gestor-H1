
import type { Client, Product, Quote } from '../types';
import { QuoteStatus } from '../types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Ana Silva',
    doc: '123.456.789-00',
    phone: '11987654321',
    address: { cep: '01001-000', street: 'Praça da Sé', number: '100', complement: 'Lado par', neighborhood: 'Sé', city: 'São Paulo', state: 'SP' },
    observations: 'Cliente prefere contato via WhatsApp.',
  },
  {
    id: '2',
    name: 'Construções XYZ Ltda',
    doc: '12.345.678/0001-99',
    phone: '21912345678',
    address: { cep: '20040-004', street: 'Avenida Rio Branco', number: '156', complement: 'Sala 201', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ' },
    observations: 'Empresa de grande porte. Faturar no CNPJ.',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Tinta Acrílica Premium Branca 18L',
    category: 'Tintas',
    description: 'Tinta de alta qualidade para paredes internas e externas.',
    costPrice: 250,
    sellPrice: 350,
  },
  {
    id: 'p2',
    name: 'Cimento Votoran Todas as Obras 50kg',
    category: 'Construção',
    description: 'Cimento versátil para diversos tipos de obra.',
    costPrice: 28,
    sellPrice: 38,
  },
  {
    id: 'p3',
    name: 'Furadeira de Impacto Bosch GSB 13 RE',
    category: 'Ferramentas',
    description: 'Furadeira potente e confiável para uso profissional.',
    costPrice: 300,
    sellPrice: 450,
  },
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'q1',
    clientId: '1',
    items: [
      { productId: 'p1', quantity: 2, unitPrice: 350 },
      { productId: 'p3', quantity: 1, unitPrice: 450 },
    ],
    shippingFee: 25.00,
    total: 2 * 350 + 1 * 450 + 25.00,
    shippingDate: '2024-08-10',
    paymentMethod: 'Cartão de Crédito 3x',
    observations: 'Entregar em horário comercial.',
    status: QuoteStatus.Approved,
    createdAt: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: 'q2',
    clientId: '2',
    items: [{ productId: 'p2', quantity: 100, unitPrice: 38 }],
    shippingFee: 250.00,
    total: 100 * 38 + 250.00,
    shippingDate: '2024-08-22',
    paymentMethod: 'Boleto 30 dias',
    observations: 'Descarregar na doca 3.',
    status: QuoteStatus.Open,
    createdAt: new Date('2024-07-22T15:30:00Z'),
  },
];
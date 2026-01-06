
import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import type { Product } from '../types';
import { useData } from '../context/DataContext';

interface ProductFormProps {
    product: Product | null;
    onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
    const { dispatch } = useData();
    const [formData, setFormData] = useState<Product>(
        product || {
            id: '', name: '', category: '', description: '', costPrice: 0, sellPrice: 0
        }
    );

    const profitMargin = useMemo(() => {
        if (formData.sellPrice > 0 && formData.costPrice > 0) {
            return ((formData.sellPrice - formData.costPrice) / formData.sellPrice) * 100;
        }
        return 0;
    }, [formData.costPrice, formData.sellPrice]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'costPrice' || name === 'sellPrice' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            dispatch({ type: 'UPDATE_PRODUCT', payload: formData });
        } else {
            dispatch({ type: 'ADD_PRODUCT', payload: { ...formData, id: `p${Date.now()}` } });
        }
        onClose();
    };

    return (
        <Modal title={product ? 'Editar Produto' : 'Novo Produto'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Preço de Custo (R$)</label>
                        <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} step="0.01" className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Preço de Venda (R$)</label>
                        <input type="number" name="sellPrice" value={formData.sellPrice} onChange={handleChange} step="0.01" className="mt-1 w-full p-2 border rounded-md" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Margem de Lucro</label>
                        <div className="mt-1 w-full p-2 border rounded-md bg-gray-100 text-gray-700">
                           {profitMargin.toFixed(2)}%
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">
                        {product ? 'Salvar Alterações' : 'Cadastrar Produto'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProductForm;

import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { CompanyData, User } from '../types';

const Settings: React.FC = () => {
    const { state, dispatch } = useData();
    const [companyFormData, setCompanyFormData] = useState<CompanyData>(state.companyData);
    const [userFormData, setUserFormData] = useState({
        email: state.user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    
    const [companySaveStatus, setCompanySaveStatus] = useState('');
    const [userSaveStatus, setUserSaveStatus] = useState('');

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setCompanyFormData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }));
        } else {
            setCompanyFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompanySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'UPDATE_COMPANY_DATA', payload: companyFormData });
        setCompanySaveStatus('Salvo com sucesso!');
        setTimeout(() => setCompanySaveStatus(''), 3000);
    };

    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUserSaveStatus('');
        
        if (userFormData.currentPassword !== state.user.password) {
            setUserSaveStatus('Senha atual incorreta.');
            return;
        }
        if (userFormData.newPassword !== userFormData.confirmPassword) {
            setUserSaveStatus('As novas senhas não correspondem.');
            return;
        }
        if (!userFormData.newPassword) {
            setUserSaveStatus('A nova senha não pode estar em branco.');
            return;
        }

        const newCredentials: User = {
            email: userFormData.email,
            password: userFormData.newPassword
        };
        
        dispatch({ type: 'UPDATE_USER_CREDENTIALS', payload: newCredentials });
        
        setUserFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }));
        
        setUserSaveStatus('Credenciais atualizadas com sucesso!');
        setTimeout(() => setUserSaveStatus(''), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Configurações</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-8">
                <form onSubmit={handleCompanySubmit} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Dados da Empresa</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                                <input type="text" name="name" value={companyFormData.name} onChange={handleCompanyChange} className="mt-1 w-full p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                                <input type="text" name="doc" value={companyFormData.doc} onChange={handleCompanyChange} className="mt-1 w-full p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input type="tel" name="phone" value={companyFormData.phone} onChange={handleCompanyChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                                <input type="email" name="email" value={companyFormData.email} onChange={handleCompanyChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-6 border-b pb-2">Endereço da Empresa</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700">CEP</label>
                                <input type="text" name="address.cep" value={companyFormData.address.cep} onChange={handleCompanyChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Rua / Logradouro</label>
                                <input type="text" name="address.street" value={companyFormData.address.street} onChange={handleCompanyChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                                <input type="text" name="address.city" value={companyFormData.address.city} onChange={handleCompanyChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Estado</label>
                                <input type="text" name="address.state" value={companyFormData.address.state} onChange={handleCompanyChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center space-x-4 pt-4 border-t mt-6">
                        {companySaveStatus && <span className="text-green-600 font-medium">{companySaveStatus}</span>}
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">
                            Salvar Dados da Empresa
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <form onSubmit={handleUserSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Alterar Credenciais de Acesso</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700">E-mail de Acesso</label>
                            <input type="email" name="email" value={userFormData.email} onChange={handleUserChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
                            <input type="password" name="currentPassword" value={userFormData.currentPassword} onChange={handleUserChange} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                        <div></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
                            <input type="password" name="newPassword" value={userFormData.newPassword} onChange={handleUserChange} className="mt-1 w-full p-2 border rounded-md" required/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                            <input type="password" name="confirmPassword" value={userFormData.confirmPassword} onChange={handleUserChange} className="mt-1 w-full p-2 border rounded-md" required/>
                        </div>
                    </div>
                    <div className="flex justify-end items-center space-x-4 pt-4 border-t mt-6">
                        {userSaveStatus && <span className={`${userSaveStatus.includes('sucesso') ? 'text-green-600' : 'text-red-600'} font-medium`}>{userSaveStatus}</span>}
                        <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">
                            Salvar Credenciais
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
'use client';

import { useState } from 'react';
import CreateQuoteForm from './components/CreateQuoteForm';
import QuoteSearch from './components/QuoteSearch';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [token, setToken] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      // Después de registrar, iniciamos sesión automáticamente
      await handleLogin(email, password);
      setIsRegistering(false);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Error en el login');
      }

      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleCreateQuote = async (data: { amount: number; from: string; to: string }) => {
    try {
      const response = await fetch(`${API_URL}/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error al crear la cotización');
      }

      const quote = await response.json();
      return quote;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  };

  const handleSearchQuote = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/quotes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al buscar la cotización');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching quote:', error);
      throw error;
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? 'Crear una cuenta' : 'Iniciar Sesión'}
          </h2>
        </div>

        {isRegistering ? (
          <RegisterForm 
            onRegister={handleRegister}
            onSwitchToLogin={() => setIsRegistering(false)}
          />
        ) : (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={() => setIsRegistering(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Cotizaciones de Criptomonedas
          </h2>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Crear Nueva Cotización
              </h3>
              <CreateQuoteForm onSubmit={handleCreateQuote} />
            </div>

            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Buscar Cotización
              </h3>
              <QuoteSearch onSearch={handleSearchQuote} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
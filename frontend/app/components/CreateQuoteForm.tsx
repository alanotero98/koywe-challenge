'use client';

import { useState } from 'react';

interface CreateQuoteFormProps {
  onSubmit: (data: { amount: number; from: string; to: string }) => Promise<any>;
}

export default function CreateQuoteForm({ onSubmit }: CreateQuoteFormProps) {
  const [error, setError] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('ARS');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setQuote(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      amount: Number(formData.get('amount')),
      from: formData.get('from') as string,
      to: formData.get('to') as string,
    };

    try {
      const result = await onSubmit(data);
      setQuote(result);
    } catch (err) {
      setError('Error al crear la cotización');
    } finally {
      setLoading(false);
    }
  };

  const fromCurrencyOptions = [
    { value: 'ARS', label: 'ARS (Peso Argentino)' },
    { value: 'BTC', label: 'BTC (Bitcoin)' },
    { value: 'ETH', label: 'ETH (Ethereum)' },
    { value: 'USDC', label: 'USDC (USD Coin)' },
    { value: 'USDT', label: 'USDT (Tether)' },
  ];

  const getValidToCurrencies = (from: string) => {
    switch (from) {
      case 'ARS':
        return [
          { value: 'ETH', label: 'ETH (Ethereum)' },
          { value: 'BTC', label: 'BTC (Bitcoin)' },
          { value: 'USDC', label: 'USDC (USD Coin)' },
          { value: 'USDT', label: 'USDT (Tether)' },
        ];
      case 'ETH':
        return [
          { value: 'BTC', label: 'BTC (Bitcoin)' },
          { value: 'USDC', label: 'USDC (USD Coin)' },
          { value: 'USDT', label: 'USDT (Tether)' },
        ];
      case 'BTC':
        return [
          { value: 'USDT', label: 'USDT (Tether)' },
        ];
      case 'USDC':
      case 'USDT':
        return [
          { value: 'ARS', label: 'ARS (Peso Argentino)' },
          { value: 'ETH', label: 'ETH (Ethereum)' },
          { value: 'BTC', label: 'BTC (Bitcoin)' },
        ];
      default:
        return [];
    }
  };

  const handleFromCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFromCurrency = e.target.value;
    setFromCurrency(newFromCurrency);
    // Reset the to currency when changing from currency
    const form = e.target.form;
    if (form) {
      const toSelect = form.elements.namedItem('to') as HTMLSelectElement;
      if (toSelect) {
        toSelect.value = getValidToCurrencies(newFromCurrency)[0]?.value || '';
      }
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Monto
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">
            Desde (Moneda)
          </label>
          <select
            id="from"
            name="from"
            required
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {fromCurrencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">
            A (Moneda)
          </label>
          <select
            id="to"
            name="to"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {getValidToCurrencies(fromCurrency).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Cotizando...' : 'Cotizar'}
        </button>
      </form>

      {quote && (
        <div className="mt-4 p-4 bg-green-50 rounded-md">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-sm text-gray-500 mb-2">
              ID: {quote.id}
            </div>
            <div className="text-gray-600 text-lg">
              {quote.amount.toLocaleString('es-AR', { maximumFractionDigits: 8 })} {quote.from}
            </div>
            <div className="text-gray-500">↓</div>
            <div className="text-2xl font-bold text-green-700">
              {quote.convertedAmount.toLocaleString('es-AR', { maximumFractionDigits: 8 })} {quote.to}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
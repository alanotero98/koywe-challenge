export interface Quote {
  id: string;
  amount: number;
  from: string;
  to: string;
  rate: number;
  result: number;
  timestamp: string;
}

export interface CreateQuoteFormProps {
  onSubmit: (data: { amount: number; from: string; to: string }) => Promise<void>;
}

export interface QuoteSearchProps {
  onSearch: (id: string) => Promise<Quote>;
} 
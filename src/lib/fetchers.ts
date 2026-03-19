export const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000'

export const fetcher = (url: string) => fetch(url).then((res) => res.json())

export const expenseFetcher = `${API_BASE}/expenses/`
export const predictionFetcher = (budget: number) => `${API_BASE}/predict/?budget=${budget}`

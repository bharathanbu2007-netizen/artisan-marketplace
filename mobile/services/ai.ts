import api from './api';

export const analyzeProduct = (imageUrl: string) => api.post('/ai/analyze-product', { imageUrl });

export const enhanceImage = (imageUrl: string, background: string) =>
  api.post('/ai/enhance-image', { imageUrl, background });

export const analyzeScene = (imageUrl: string) => api.post('/ai/analyze-scene', { imageUrl });

export const generateCatalog = (payload: {
  audioUrl?: string;
  transcript?: string;
  sourceLanguage?: string;
  detectedObject?: string;
  material?: string;
}) => api.post('/ai/catalog', payload);

export const suggestPrice = (payload: {
  category?: string;
  material?: string;
  rawMaterialEstimate?: number;
  comparableProducts?: number[];
}) => api.post('/ai/price', payload);

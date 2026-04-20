import { APP_ID } from '@/constants';

export const getApiUrl = () => {
  return `https://script.google.com/macros/s/${APP_ID}/exec`;
};

export const Request = {
  get: async <T = unknown>(params: URLSearchParams) => {
    const baseUrl = getApiUrl();
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    return (await response.json()) as T;
  },
  post: async <T = unknown>(
    params: URLSearchParams,
    data: Record<string, unknown>,
  ) => {
    const baseUrl = getApiUrl();
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return (await response.json()) as T;
  },
};

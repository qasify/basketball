

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!API_BASE_URL) {
  console.error(
    "API_BASE_URL is not set. Please check your environment variables."
  );
}

if (!API_HOST) {
  console.error(
    "API_HOST is not set. Please check your environment variables."
  );
}

if (!API_KEY) {
  console.error("API_KEY is not set. Please check your environment variables.");
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

interface ApiResponse<T> {
    get: string;
    parameters: Record<string, string>;
    errors: string[];
    results: number;
    response: T;
  }
  

async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
    //   "Content-Type": "application/json",
      "x-rapidapi-host": API_HOST ?? "",
      "x-rapidapi-key": API_KEY ?? "",
      ...fetchOptions.headers,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || "An error occurred while fetching data"
    );
  }

  const data: ApiResponse<T> = await response.json();
  
  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors.join(', '));
  }

  return data.response;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
};

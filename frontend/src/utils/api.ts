interface RequestOptions extends RequestInit {
  token?: string;
  body?: object;
}

const API_BASE_URL = 'http://localhost:8000/api';

async function callApi<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  if (options?.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    body: options?.body ? JSON.stringify(options.body) : options?.body,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || response.statusText);
  }

  return response.json();
}

// Specific API calls
export const api = {
  // Auth endpoints
  signup: (userData: object) => callApi('/auth/signup', { method: 'POST', body: userData }),
  signin: (credentials: object) => callApi('/auth/signin', { method: 'POST', body: credentials }),
  signout: (token: string) => callApi('/auth/signout', { method: 'POST', token }),
  getCurrentUser: (token: string) => callApi('/auth/me', { method: 'GET', token }),

  // Profile endpoints
  getProfile: (token: string) => callApi('/profile', { method: 'GET', token }),
  createProfile: (profileData: object, token: string) => callApi('/profile', { method: 'POST', body: profileData, token }),
  updateProfile: (profileData: object, token: string) => callApi('/profile', { method: 'PUT', body: profileData, token }),

  // Chat endpoint (supports optional auth)
  chat: (questionData: object, token?: string) => callApi('/chat', { method: 'POST', body: questionData, token }),

  // Translate endpoint
  translate: (textData: object, token?: string) => callApi('/translate', { method: 'POST', body: textData, token }),
};

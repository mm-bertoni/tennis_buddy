// HTTP utility functions for API calls

export async function http(method, url, body) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Attach Authorization header when token is available
  try {
    const token = localStorage.getItem('token');
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
    // Mark unauthorized responses so callers can handle them
    if (response.status === 401) {
      err.name = 'Unauthorized';
    }
    throw err;
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return {};
}

export const get = (url) => http('GET', url);
export const post = (url, body) => http('POST', url, body);
export const patch = (url, body) => http('PATCH', url, body);
export const del = (url) => http('DELETE', url);

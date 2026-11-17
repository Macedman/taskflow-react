// Where the JWT is kept between page reloads.
// localStorage is simple, but any script on the page can read it (XSS risk).
// The more secure option is an httpOnly cookie set by the server.
const TOKEN_KEY = 'taskflow.token'

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null // storage can be blocked (e.g. some private windows)
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // ignore: the user stays logged in until they reload
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // ignore
    }
  },
}

// AuthProvider registers its logout here, so any 401 (e.g. an expired token)
// logs the user out, no matter which component made the request
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

// One place that knows how to talk to the API.
// fetch() does NOT throw on 404/500, so we check res.ok ourselves.
export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = tokenStorage.get()

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  // Only when we SENT a token: a wrong password on the login form is also a 401,
  // and that should show an error, not log anyone out
  if (res.status === 401 && token) {
    onUnauthorized?.()
  }

  if (!res.ok) {
    // Our API sends { error: '...' }; fall back to the status code if not
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? `Request failed with status ${res.status}`)
  }

  // 204 No Content has no body, so res.json() would throw
  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

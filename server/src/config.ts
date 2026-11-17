// Read required settings once, at startup. If one is missing, crash immediately
// with a clear message instead of failing later on the first login.
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const config = {
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: '1h',
} as const

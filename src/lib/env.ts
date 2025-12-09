/**
 * Validação centralizada de variáveis de ambiente
 * Falha em build time se variáveis obrigatórias estiverem faltando
 */

const requiredEnvVars = {
  jwtSecret: process.env.JWT_SECRET,
} as const

// Validação - falha em build time se faltarem variáveis
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `Please check your .env.local (or Wrangler env) and ensure it contains:\n` +
      `JWT_SECRET=your_secret_key`
    )
  }
})

export const env = {
  jwtSecret: requiredEnvVars.jwtSecret!,
}

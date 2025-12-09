/**
 * Validação centralizada de variáveis de ambiente
 * Falha em build time se variáveis obrigatórias estiverem faltando
 */

const requiredEnvVars = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const

// Validação - falha em build time se faltarem variáveis
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `Please check your .env.local file and ensure it contains:\n` +
      `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n` +
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`
    )
  }
})

export const env = {
  supabaseUrl: requiredEnvVars.supabaseUrl!,
  supabaseAnonKey: requiredEnvVars.supabaseAnonKey!,
}

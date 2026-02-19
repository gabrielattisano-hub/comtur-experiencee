# COMTUR EXPERIENCE — Demo completo (IA + Login + Compra + Mapa + Diário)

Este projeto é **apresentável** e funciona em **modo DEMO** mesmo sem chaves.
Se você adicionar as chaves, vira integração real.

## Rodar
```bash
npm install
npm run dev
```
Abra: http://localhost:3000

## Configurar chaves
Copie `.env.example` para `.env.local` e preencha:
- OpenAI (IA + tradução)
- Stripe (checkout test)
- Mapbox (mapa)
- Supabase (login real e dados)

## Deploy (Vercel)
- Suba para GitHub
- Importar na Vercel
- Colocar env vars
- Deploy

# Versus Web

Portal público do **Versus**: onde e quando tem batalha de rima, o ranking de cada batalha e a chave de cada edição concluída, com link para compartilhar.

- **No ar:** https://versusproject.vercel.app/
- **Rotas:** `/` (batalhas) · `/b/<slug>` (batalha) · `/e/<id>` (edição com a chave) · `/legado` (protótipo antigo)
- **Dados:** API pública do `service-versus` (`/v1/public/*`), sem login. As páginas são regeneradas a cada 5 minutos (ISR).
- Quem organiza usa o app **Versus** (`versus-app`): as batalhas concluídas lá aparecem aqui.

## Rodar localmente

```bash
npm install
npm run dev -- -p 5178   # http://localhost:5178
npm run check            # lint + tipos + testes
```

`VERSUS_API_URL` aponta para outra API (padrão: production). Ex.: staging para ver edições de teste.

## Deploy

Vercel (projeto `versusproject`), framework **Next.js**. Cada push na `main` publica; branches ganham preview.

## Protótipo antigo

O primeiro Versus Web (um `index.html`, chave no navegador com histórico no `localStorage`) parou de evoluir e continua em [`/legado`](https://versusproject.vercel.app/legado), na mesma origem, para ninguém perder o histórico salvo. Documentação dele em [docs/legado/](docs/legado/).

## Para quem vai mexer no código

1. [AGENTS.md](AGENTS.md): regras do repositório.
2. [docs/DECISIONS.md](docs/DECISIONS.md): por que está assim.

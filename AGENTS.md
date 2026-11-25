<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent guidelines — versus-web (portal público)

Vitrine pública do Versus: onde e quando tem batalha de rima, ranking de cada batalha e a chave de cada edição concluída. Next.js 16 (App Router) na Vercel, ISR por tempo (5 min). Lê só `GET /v1/public/*` do `service-versus` (production por padrão; `VERSUS_API_URL` troca). Organizar batalha é no app `versus-app`, não aqui.

## Comandos

```bash
npm run dev -- -p 5178   # http://localhost:5178
npm run check            # lint + typegen + tsc + testes (node --test)
npm run build            # confira a tabela de rotas: / e /b/* com Revalidate 5m
```

## Mapa

| Caminho | O que faz |
|---------|-----------|
| `app/page.tsx` | `/`: batalhas (nome, cidade, dia/horário, endereço com link do OpenStreetMap) |
| `app/b/[slug]/page.tsx` | `/b/[slug]`: batalha com ranking e edições concluídas; `generateStaticParams` pré-gera as que existem |
| `app/e/[id]/page.tsx` | `/e/[id]`: edição com a chave (ou lista de confrontos do palco antigo); gerada no 1º acesso |
| `lib/api.ts` | Cliente da API pública; 404 → `null` → `notFound()` |
| `lib/bracket.ts` | **Lógica pura**: chave a partir dos confrontos, com a mesma checagem do `sandboxFromDetail` do app |
| `public/legado/index.html` | Protótipo antigo (parado), servido em `/legado`. Docs em `docs/legado/` |

## Invariantes

- **Só leitura pública.** Nada de login, escrita ou rota privada da API aqui.
- **Chave só quando válida** (`bracketFromMatches`): palco antigo, repescagem ou fase incompleta → lista. Nunca desenhe chave errada.
- **`/legado` na mesma origem**: o save do protótipo (`versus-web:v2` no `localStorage`) é de quem usa. Não mova o arquivo nem troque o domínio sem migração.
- Identidade do app: preto + amarelo, sem gradiente; verde só vitória, vermelho só derrota; Anton + Barlow Condensed.
- ISR clássico (`export const revalidate = 300` + `fetch` com `next.revalidate`); `cacheComponents` desligado. Leia a doc local antes de mudar cache.

## Antes de concluir

1. `npm run check` verde e `npm run build` com a tabela de rotas esperada.
2. Tela: ver no browser pane em 375 e 768 de largura (`.claude/launch.json` → `versus-web`).
3. Lógica nova em `lib/`: teste em `lib/*.test.mts`.
4. Decisão durável: uma linha em `docs/DECISIONS.md`.

## Relação com os outros repositórios

- `service-versus`: API (`/v1/public/*` é o contrato deste portal).
- `versus-app`: app do organizador e do público (Expo). Plano da F2: `../versus-app/docs/plans/2026-11-24-f2-publico.md`.

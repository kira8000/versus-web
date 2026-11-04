# Agent guidelines — versus-web

Chave de batalha de MCs no navegador. **Um arquivo: `index.html`** (CSS + JS vanilla inline). Sem build, sem dependências, sem backend. Deploy estático na Vercel a cada push na `main`.

## Comandos

```bash
python -m http.server 5178   # http://localhost:5178
```

- Testes: `console.assert` no topo do script, rodam a cada carregamento. Console sem `Assertion failed` = verde.
- Preview no Claude Code: `.claude/launch.json` (`versus-web`, porta 5178).

## Mapa do `index.html`

| Bloco | O que faz |
|-------|-----------|
| `<style>` | Tema (variáveis em `:root`), layout em coluna de altura total, barra de rolagem visível |
| `fresh()` / `derive()` | **Lógica pura.** Todo o placar sai de `names + overrides + taps` |
| auto-teste | 7 `console.assert` sobre `derive()` |
| `load()` / `save()` | `localStorage["versus-web:v1"]`, sempre dentro de `try/catch` |
| `render()` | Recalcula a geometria (`COL` = largura da tela, `ROW` = altura útil / vagas) e redesenha SVG + slots |
| ações | Barra (`grow`, `start`, `undo`, `edit`, `new`), digitação (`input`/`change`), tocar e segurar (`pointer*`) |

Detalhes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Invariantes (não quebre)

- **Estado mínimo e derivado.** Não salve placar, vencedor ou campeão; derive. Desfazer é `taps.pop()`.
- **Formato do save** `{ current: { id, createdAt, size, started, names[], overrides{}, taps[{match, winner|null}] }, history[{ ...current, champion }] }`. Mudar esse formato exige uma chave nova (`versus-web:v2`) e migração da v1. Senão o operador perde a chave no meio do evento.
- **IDs:** slot `c-i` (coluna, posição) e confronto `c-m` (slots `c-2m` e `c-2m+1`).
- **Sem ordem obrigatória, sem bye automático, sem lógica de repescagem nem sorteio.** São decisões de produto: ver [docs/DECISIONS.md](docs/DECISIONS.md).
- **Não re-renderizar com campo focado** (o teclado do celular redimensiona a tela).
- **Um arquivo só.** Dividir ou adicionar dependência só com motivo forte, registrado em DECISIONS.

## Antes de concluir

1. Console sem asserts falhando.
2. Mudança de tela: ver no browser pane em **375×812** e **768×1024**, montando, jogando, empatando, desfazendo e recarregando.
3. Mudança na lógica: novo `console.assert` cobrindo o caso.
4. Decisão durável: uma linha em `docs/DECISIONS.md`.

## Fora de escopo (Fase 1)

API, login, organizações, ranking, telão, double three, sorteio, i18n.

## Relação com os outros repositórios

- `mobile-versus` (Flutter) e `service-versus` (API) são o produto completo. Este repositório é o laboratório de UX simples.
- Domínio de referência (se você tiver os repositórios irmãos em `../`): `../mobile-versus/AGENTS.md`, `../mobile-versus/docs/FLOW.md` e `../service-versus/.cursor/skills/versus-domain/reference.md`.

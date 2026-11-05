# Agent guidelines — versus-web

Chave de batalha de MCs no navegador, com Histórico e Ranking. **Um arquivo: `index.html`** (CSS + JS vanilla inline). Sem build, sem dependências, sem backend. Deploy estático na Vercel a cada push na `main`.

## Comandos

```bash
python -m http.server 5178   # http://localhost:5178
```

- Testes: `console.assert` no topo do script, rodam a cada carregamento. Console sem `Assertion failed` = verde.
- Preview no Claude Code: `.claude/launch.json` (`versus-web`, porta 5178).

## Mapa do `index.html`

| Bloco | O que faz |
|-------|-----------|
| `<style>` | Tema (variáveis em `:root`), layout em coluna de altura total, barra de rolagem visível, Home, janela sobreposta (`#win`), barra inferior |
| `fresh()` / `view()` / `derive()` | **Lógica pura.** A chave é uma linha do tempo (`events` + `cursor`); `view()` faz o replay para `names + overrides + taps` e `derive()` tira o placar disso |
| `push()` / `undo()` / `redo()` / `target()` / `usedNames()` | **Lógica pura.** Ação nova (trunca o redo), mover o cursor, a vaga iluminada e os MCs vivos na chave (carta travada) |
| `migrate()` | **Lógica pura.** Save v1 → v2 |
| `rank(history)` | **Lógica pura.** Ranking derivado do histórico (regra do `service-versus`: 3 / +1 / 5) |
| auto-teste | 25 `console.assert` sobre `derive()`, `rank()`, timeline, migração, lixeira, carta travada e limites do zoom |
| `load()` / `save()` | `localStorage["versus-web:v2"]` (sem v2, migra a v1 e mantém a v1 como backup), sempre dentro de `try/catch` |
| `bracket()` | Desenha uma chave (SVG + slots); `live` liga toques, vaga iluminada, laterais do colchete e sugestão. Usada no palco e no card do histórico |
| `render()` | Barra inferior + Home + janela `win`; na janela CHAVE calcula `COL` (largura da tela) e `ROW` (altura útil / vagas) e chama `bracket(..., { live: true })`; desenha o character select (`roster()`) quando há vaga iluminada |
| `renderPage()` | HISTÓRICO (cards que expandem com a chave, `openHist`) e RANKING (tabela) em `#page` |
| ações | Um `click` no `document` para `data-tab`, `data-act` (`grow`, `undo`, `redo`, `new`), `data-view`, `data-pick` (vaga vazia), `data-mc` (carta) e `data-del` (lixeira); `submit` do `Adicionar`; tocar e segurar (`pointer*`); pinça (`touch*` com 2 dedos, `ctrl+wheel`) amplia só a chave (`setZoom`, `clampZoom`) |

Detalhes: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Invariantes (não quebre)

- **Estado mínimo e derivado.** Não salve placar, vencedor ou campeão; derive. Desfazer é `cursor--`, refazer é `cursor++`.
- **Formato do save** `versus-web:v2`: `{ current: { id, createdAt, size, events[{t:'place',slot,name} | {t:'round',match,winner} | {t:'draw',match}], cursor }, history[{ ...current, champion }] }`. `place` com `name: ''` = vaga esvaziada pela lixeira. Mudar esse formato exige uma chave nova (`versus-web:v3`) e migração da v2. Senão o operador perde a chave no meio do evento. A chave `versus-web:v1` nunca é apagada (backup).
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

API, login, organizações, telão, double three, sorteio, i18n, sincronização entre aparelhos.

## Relação com os outros repositórios

- `mobile-versus` (Flutter) e `service-versus` (API) são o produto completo. Este repositório é o laboratório de UX simples.
- Domínio de referência (se você tiver os repositórios irmãos em `../`): `../mobile-versus/AGENTS.md`, `../mobile-versus/docs/FLOW.md` e `../service-versus/.cursor/skills/versus-domain/reference.md`.

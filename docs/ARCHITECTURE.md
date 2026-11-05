# Arquitetura

Tudo vive em `index.html`. Uma Home (`#home`) no fundo e três janelas sobrepostas (`#win`): CHAVE, HISTÓRICO (lista) e RANKING (tabela). O fluxo é sempre o mesmo:

```
ação do operador → push(evento) | undo | redo → save() → render() → derive(view(current)) → SVG + slots
```

## Estado (`localStorage["versus-web:v2"]`)

```js
{
  current: {
    id, createdAt,
    size: 4 | 8 | 16,           // vagas na 1ª fase
    events: [                   // linha do tempo, em ordem
      { t: "place", slot: "0-3", name: "Alma" },     // MC posto numa vaga (1ª fase ou repescagem); name "" = lixeira (esvazia a vaga)
      { t: "round", match: "0-0", winner: "0-1" },   // bolinha
      { t: "draw",  match: "0-0" }                   // empate
    ],
    cursor: 3                   // eventos valendo = events.slice(0, cursor); o resto é o redo
  },
  history: [ { ...current, champion } ]  // eventos até o cursor; entradas antigas só têm { createdAt, champion, size }
}
```

Só isso é salvo. Placar, vencedores, vaga iluminada, confronto sugerido e campeão são **sempre recalculados**.

## Linha do tempo (puras)

- `view(s)`: replay de `events.slice(0, cursor)` → `{ size, names, overrides, taps }`. `place` na 1ª fase vira `names[i]`; nas seguintes, `overrides[slot]`; `round`/`draw` viram `taps` (`draw` = `winner: null`). Entrada no formato v1 passa direto.
- `push(s, ev)`: corta o redo (`events.slice(0, cursor)`), acrescenta e avança o cursor.
- `undo(s)` / `redo(s)`: `cursor--` / `cursor++`, com limites.
- `target(s, pick)`: vaga iluminada = `pick` (vaga vazia tocada) ou a 1ª vaga vazia da 1ª fase. Coluna do campeão nunca.

## Migração v1 → v2

`load()` lê `versus-web:v2`. Sem v2, lê `versus-web:v1` e roda `migrate()`: `names` viram `place` na 1ª fase, `taps` viram `round`/`draw`, `overrides` viram `place` nas fases seguintes, `cursor = events.length`. Vale para a chave atual e para cada entrada do histórico com chave inteira; entradas só com o campeão ficam como estão. A v2 é gravada logo depois, e **a v1 nunca é apagada** (backup). Como `derive()` não depende da ordem entre nomes e taps, o placar, o campeão e o ranking saem idênticos (há assert para isso).

## IDs

- Coluna `c`: 0 = 1ª fase … `log2(size)` = campeão.
- Slot `c-i`: posição `i` na coluna `c`.
- Confronto `c-m`: slots `c-2m` (de cima) e `c-2m+1` (de baixo). O vencedor vai para o slot `(c+1)-m`.

## `derive({ size, names, overrides, taps })` (pura)

Para cada coluna, da esquerda para a direita, e cada confronto:
1. `dots` de cada slot = taps daquele `match` com `winner === slot.id`. Empates não contam.
2. Quem chega a 2 vence (`state: win`) e o outro perde (`state: lose`).
3. O nome do slot seguinte é `overrides[id]` **ou** o vencedor derivado. O override ganha.
4. Confronto jogável: 2 nomes e sem vencedor. `suggested` = primeiro jogável (coluna → cima para baixo).
5. `editable` = confronto sem nenhum tap.

Retorna `{ cols, suggested, champion, playable }`.

Desfazer é `cursor--`: como tudo é derivado, isso também desfaz um avanço ou tira um MC da vaga.

## Render

`bracket(s, { col, row, slotH, live })` devolve o HTML de uma chave (SVG + slots). O palco usa `live: true` com `col` = largura da tela; o histórico usa uma versão mini, só leitura.


- `COL` = largura do contêiner de rolagem (1 fase = 1 tela, com `scroll-snap`).
- `ROW` = `(altura útil − LIVE_PAD) / size`, no mínimo `MIN_ROW` = 60 (alvo de 48px + 12 de respiro). Com a grade aberta ou 16 vagas no celular, a chave rola na vertical e a vaga iluminada é trazida à vista sozinha.
- `LIVE_PAD` = 76: espaço no topo para o undo/redo flutuante não cobrir o 1º nome.
- Posição do slot: `x = c·COL + 16`, `y = PAD + (i + ½)·2ᶜ·ROW`. O nome fica **sobre** a linha.
- Linhas em um `<svg>` atrás: horizontal sob o nome, vertical ligando o par, horizontal até a fase seguinte. A cor segue o `state` (verde, vermelho ou cinza).
- Vaga vazia (no palco) vira `<button data-pick>`; a iluminada ganha `.target` (brilho + pulso). Vaga com nome vira `<button>` com o nome e as bolinhas.
- `.area` = duas faixas invisíveis de 56px nas laterais do colchete jogável: a de cima é do MC de cima, a de baixo do MC de baixo. Toque = round; segurar = empate.
- `fx` (estado de tela) anima a última ação: `.land` (MC pousa / vencedor sobe), `.bump` (bolinha nova), `.flash` (empate). `prefers-reduced-motion` desliga.
- Character select (`#select`): só aparece com vaga iluminada. `roster()` = MCs do ranking em ordem de pontos + todo nome de evento `place` do histórico e da chave atual (quem saiu pela lixeira continua com a carta). Quem está em `usedNames(s)` (vivo na chave: tem nome e `state !== 'lose'`) fica `.used` + `disabled`; quem só aparece perdendo fica livre para a repescagem. `place()` recusa nome em `usedNames` (cobre o `Adicionar`).
- Lixeira (`.del`, `data-del`): botão 48×48 ao lado do nome, fora do `button.slot`. Só em vaga preenchida por `place` (1ª fase com nome, ou override não vazio) e com `editable` (confronto sem round). O clique faz `push` de `{ t:'place', slot, name:'' }` e põe `pick = slot`.
- Zoom (`zoom = { board, hist }`, estado de tela): CSS `zoom` no `#board` e no wrapper de cada `.mini`, limitado por `clampZoom()` a 0,4x–2,5x. `touchstart`/`touchmove` com 2 dedos dentro de `#scroll` ou `.mini` (não passivos, com `preventDefault`) e `wheel` com `ctrlKey` chamam `setZoom()`, que mantém o ponto entre os dedos parado ajustando `scrollLeft/Top`. A pinça cancela o segurar em curso, e o `pointerdown` ignora o 2º dedo (`isPrimary`). `#scroll.zoomed` desliga o snap. O auto-scroll da vaga iluminada mede com `getBoundingClientRect`, que já inclui o zoom. O zoom da página fica bloqueado por viewport, `html { touch-action: pan-x pan-y }` e `gesturestart`.
- Na carga, `render()` roda 2 vezes: o 2º passe mede a altura com `#tools` já preenchido.

## Eventos

| Evento | Efeito |
|--------|--------|
| `click` em `data-act` | `grow` (dobra `size`, só antes do 1º round) e `new` = Encerrar (arquiva os eventos até o cursor e cria `fresh()`) em `#tools`; `undo`/`redo` no botão flutuante |
| clique em `data-pick` (vaga vazia) | `pick = slot` (tocar de novo solta) |
| clique em `data-mc` (carta) | `place` na vaga iluminada (carta de MC vivo na chave fica `disabled`) |
| clique em `data-del` (lixeira) | `place` com `name: ''` na vaga e `pick = slot` |
| `touch*` com 2 dedos / `wheel` + `ctrlKey` na chave | zoom só da chave (`setZoom`) |
| `submit` do `Adicionar` | `place` do nome digitado na vaga iluminada |
| `pointerdown` | inicia o timer de 1200 ms e a classe `.holding` (barra enchendo) no confronto |
| `pointerup` antes do tempo | round para aquele slot (nome ou lateral do colchete) |
| timer completo | empate (`winner: null`) + `.flash` |
| `pointercancel` / `pointerleave` | cancela |
| clique em `data-tab` | abre a janela `win` (`hist` · `battle` · `rank`); o mesmo botão de novo (ou o ✕, `data-close`) fecha e volta à Home. Fora de `battle`, `render()` esconde o tabuleiro e chama `renderPage()` |
| clique em `data-view` (card do histórico) | alterna `i` em `openHist`; o card expandido desenha `bracket(db.history[i], { col: 170, row: 40, slotH: 30 })` só leitura |
| `resize` | re-renderiza, exceto com campo focado |

## Ranking: `rank(history)` (pura)

Mesma regra do `service-versus` (`organization-ranking.service.ts`): vitória de confronto +3, vitória sem ceder round (o adversário ficou com 0 bolinhas) +1, título +5. Desempate: pontos → títulos → 2x0 → vitórias. Os nomes são agrupados sem diferenciar maiúsculas e ignorando espaços. Só batalhas **encerradas** contam; a batalha em andamento não. Entradas antigas (só o campeão) somam apenas o título.

## Telas

`win` (não é salvo): `null` = só a Home; `battle` mostra `#tools` + `#arena` (chave + undo/redo) + `#select` (character select, se houver vaga iluminada); `hist` e `rank` mostram `#page`. Na carga, `win` começa em `battle` se a chave atual tem eventos. A barra inferior só abre/fecha janelas (HISTÓRICO · CHAVE · RANKING).

## Auto-teste

São 25 `console.assert` logo após `rank()`. Os 8 da v8 cobrem a lixeira e a carta travada (MC na chave travado, lixeira esvazia a vaga e solta o MC, undo da lixeira, eliminado volta para a repescagem, repescado fica travado, override segue valendo, lixeira no override volta ao vencedor derivado) e os limites do zoom. Os 17 anteriores: Os 8 originais (avanço com 2 bolinhas, empate não pontua, vaga vazia bloqueia o confronto, jogo fora de ordem, override ganha, desfazer avanço, campeão e ranking) e 9 da v2: `place` no slot iluminado, `pick` move o destaque, montagem fora de ordem, round pela timeline, undo de round, undo de place, redo, ação nova limpa o redo e migração v1 → v2 (placar, campeão e ranking idênticos).

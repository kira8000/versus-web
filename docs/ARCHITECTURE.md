# Arquitetura

Tudo vive em `index.html`. Três telas (abas): BATALHA (chave), HISTÓRICO (lista) e RANKING (tabela). O fluxo é sempre o mesmo:

```
ação do operador → muda db.current → save() → render() → derive(current) → SVG + slots
```

## Estado (`localStorage["versus-web:v1"]`)

```js
{
  current: {
    id, createdAt,
    size: 4 | 8 | 16,           // vagas na 1ª fase
    started: false,             // montagem × ao vivo
    names: ["Alma", "", ...],   // 1ª fase, length === size
    overrides: { "1-0": "Zeca" },  // nomes digitados à mão em fases seguintes (repescagem)
    taps: [ { match: "0-0", winner: "0-1" }, { match: "0-0", winner: null } ]  // null = empate
  },
  history: [ { ...current, champion } ]  // chave inteira; entradas antigas só têm { createdAt, champion, size }
}
```

Só isso é salvo. Placar, vencedores, confronto sugerido e campeão são **sempre recalculados**.

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

Desfazer é `taps.pop()`: como tudo é derivado, isso também desfaz um avanço.

## Render

- `COL` = largura do contêiner de rolagem (1 fase = 1 tela, com `scroll-snap`).
- `ROW` = `(altura útil − PAD) / size`, no mínimo `MIN_ROW` = 56. Com 16 vagas no celular, a tela rola na vertical.
- Posição do slot: `x = c·COL + 16`, `y = PAD + (i + ½)·2ᶜ·ROW`. O nome fica **sobre** a linha.
- Linhas em um `<svg>` atrás: horizontal sob o nome, vertical ligando o par, horizontal até a fase seguinte. A cor segue o `state` (verde, vermelho ou cinza).
- Slot vira `<input>` na montagem (1ª fase) ou no modo `Editar` (slots editáveis). Senão vira `<button>` com o nome e as bolinhas.
- `.area` = faixa invisível sobre o colchete do confronto jogável, para segurar e marcar empate.
- Na carga, `render()` roda 2 vezes: o 2º passe mede a altura com a navbar já preenchida.

## Eventos

| Evento | Efeito |
|--------|--------|
| `click` em `data-act` (`#tools`) | `grow` (dobra `size` e `names`), `start`, `undo`, `edit` (liga/desliga), `new` = Encerrar (arquiva a chave inteira e cria `fresh()`), `back` (sai do modo leitura) |
| `input` | atualiza `names` ou `overrides` e salva, **sem re-renderizar** (mantém o foco) |
| `change` | re-renderiza ao sair do campo |
| `pointerdown` | inicia o timer de 1200 ms e a classe `.holding` (barra enchendo) no confronto |
| `pointerup` antes do tempo | round para aquele slot |
| timer completo | empate (`winner: null`) + `.flash` |
| `pointercancel` / `pointerleave` | cancela |
| clique em `data-tab` | troca `tab` (`hist` · `battle` · `rank`). Fora de `battle`, `render()` esconde o tabuleiro e chama `renderPage()` |
| clique em `data-view` (card do histórico) | `viewing = i`: desenha `db.history[i]` em modo leitura (sem inputs, toques nem sugestão); `back` volta à lista |
| `resize` | re-renderiza, exceto com campo focado |

## Ranking: `rank(history)` (pura)

Mesma regra do `service-versus` (`organization-ranking.service.ts`): vitória de confronto +3, vitória sem ceder round (o adversário ficou com 0 bolinhas) +1, título +5. Desempate: pontos → títulos → 2x0 → vitórias. Os nomes são agrupados sem diferenciar maiúsculas e ignorando espaços. Só batalhas **encerradas** contam; a batalha em andamento não. Entradas antigas (só o campeão) somam apenas o título.

## Telas

`tab` (não é salvo): `battle` mostra `#tools` (ações) + `#scroll` (chave); `hist` e `rank` mostram `#page`. A navbar só navega; as ações (`Desfazer`, `Editar`, `Encerrar`, `+ vagas`, `Iniciar`) ficam em `#tools`, no topo do palco.

## Auto-teste

São 8 `console.assert` logo após `rank()`: avanço com 2 bolinhas, empate não pontua, vaga vazia bloqueia o confronto, jogo fora de ordem, override ganha, desfazer avanço, campeão e ranking.

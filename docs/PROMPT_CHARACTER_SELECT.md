# Prompt — Versus Web: Character Select + Undo/Redo

> Cole tudo abaixo da linha no Claude Code, na raiz do repositório `kira8000/versus-web` (com `main` atualizada).

---

Você vai evoluir o **Versus Web** (`index.html` único, vanilla, sem build). Trabalhe em **modo plano primeiro**: leia o contexto, proponha o plano, e só implemente depois que eu aprovar.

## 0. Contexto obrigatório (leia antes de planejar)
- `AGENTS.md`, `CLAUDE.md` e `.claude/skills/cerberus/SKILL.md`. Siga o ciclo do Cerberus: farejar → construir → morder → provar.
- `docs/ARCHITECTURE.md`: estado, `derive()`, `rank()`, `bracket()`, eventos.
- `docs/DECISIONS.md`: decisões de produto que não podem ser quebradas sem registro.
- Princípio: **a menor mudança completa** (Ponytail). Nada de framework, dependência ou arquivo novo de código.

## 1. Objetivo
Trocar a montagem por digitação nos galhos por um fluxo de **character select** (estilo jogo de luta). A chave deve mostrar, passo a passo, como ela se forma, e todo erro deve ser reversível com **undo/redo em ordem**.

## 2. Layout da janela CHAVE (mobile-first, 375×812)
- **Metade de cima: a chave.** Mesmo desenho de `bracket()` (nome sobre a linha). Os confrontos precisam ser grandes o bastante para evitar toque errado: alvo de toque ≥ 48px de altura, com espaço entre os confrontos. Continua rolando para o lado por fase.
- **Metade de baixo: o character select.** Uma grade de "cartas" com os MCs (alvo ≥ 48px).
  - Um campo + botão "Adicionar" põe um MC novo na grade.
  - A grade já vem com os MCs conhecidos do histórico e do ranking, em ordem de pontos, para não ter que digitar de novo.
  - Um MC já colocado na chave aparece esmaecido. Ainda dá para tocar nele, porque um MC eliminado pode voltar na repescagem.
- **Botão flutuante ↶ Undo** no canto superior direito da metade de cima, com **↷ Redo** ao lado. Os dois ficam sempre visíveis e desabilitados quando não há o que desfazer ou refazer. Avalie se o `DESFAZER` da barra inferior vira redundante; se virar, troque ou remova e registre a decisão.

## 3. Interação
1. **Slot iluminado:** antes de começar, as vagas ficam **sem cor de vitória ou derrota**. O **próximo slot vazio** (coluna → de cima para baixo) fica destacado com brilho e pulso.
2. **Tocar num MC da grade** coloca o MC **no slot iluminado**. O destaque passa para o próximo slot vazio.
3. **Tocar num slot vazio qualquer** move o destaque para ele. É assim que se faz repescagem e se monta fora de ordem.
4. **Confronto fechado** (2 nomes): o operador toca **no nome** ou **na lateral do colchete** do vencedor do round. Cada lado do colchete é uma área de toque grande. Isso marca uma bolinha (●).
   - Com 2 bolinhas, o MC vence: os nomes ganham as cores (verde e vermelho) e o vencedor sobe para o próximo slot com uma animação curta.
   - Isso reaproveita a regra que já existe em `derive()`.
5. **Empate** continua sendo segurar 1,2 s no confronto (não remova).
6. **Feedback visual claro** a cada ação: o MC "voa" ou aparece com destaque no slot, a bolinha pulsa ao entrar e o vencedor sobe com animação. Respeite `prefers-reduced-motion`.

## 4. Undo/Redo: uma linha do tempo única
- Toda ação vira um **evento numa pilha ordenada**: `place` (MC no slot), `round` (bolinha), `draw` (empate). Remover um MC de um slot é só desfazer o `place`.
- **Undo** desfaz o último evento, seja a bolinha marcada por engano ou o MC colocado no slot errado. **Redo** refaz. Dá para voltar até o início da batalha e refazer tudo.
- Uma ação nova depois de um undo descarta o que estava no redo (comportamento padrão de editor).
- O estado continua **derivado**: placar, slots, vencedor e campeão saem do replay dos eventos até o cursor. Nunca salve nenhum deles.

## 5. Dados (risco alto: as três cabeças do Cerberus, completas)
- O formato muda, então use a **nova chave `versus-web:v2`**, com **migração automática da v1**:
  - `names[i]` vira um `place` no slot `0-i`;
  - `overrides` vira um `place` nos slots seguintes;
  - `taps` vira `round`, ou `draw` quando `winner === null`.
- **O histórico e o ranking da v1 não podem se perder.** Teste com um save v1 real antes e depois de carregar.
- Mantenha `rank()` funcionando sobre o histórico migrado.
- Mantenha os IDs `c-i` (slot) e `c-m` (confronto).

## 6. Testes (`console.assert`, no padrão do arquivo)
Adicione asserts para:
- `place` vai para o slot iluminado;
- tocar num slot vazio move o destaque;
- undo de `place` e de `round`;
- redo;
- ação nova depois de undo limpa o redo;
- migração v1 → v2 preserva placar, campeão e ranking.

Todos os 8 asserts atuais continuam passando.

## 7. Prova antes do PR
- Browser pane (`.claude/launch.json` → `versus-web`) em **375×812** e **768×1024**:
  - montar 8 MCs pela grade, inclusive um fora de ordem;
  - jogar com toques no nome e na lateral do colchete;
  - empatar;
  - errar de propósito e desfazer (MC e bolinha);
  - refazer;
  - encerrar;
  - conferir o Histórico (card expande) e o Ranking;
  - recarregar no meio da batalha.
- Console sem `Assertion failed`.
- Atualize `README.md` (tabela "Como usar"), `docs/ARCHITECTURE.md` (eventos, estado v2, migração) e `docs/DECISIONS.md` (character select, linha do tempo com undo/redo, save v2).

## 8. Entrega
- Branch `feat/character-select-undo-redo` a partir da `main`.
- Commits pequenos e descritivos.
- **Abra um PR** com:
  - resumo;
  - screenshots em 375px (montagem, confronto, campeão);
  - o que foi testado e o que não foi;
  - nota explícita sobre a migração v1 → v2.
- Não faça merge. Push na `main` publica em produção (Vercel).

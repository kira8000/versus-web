# Decisões

Cada decisão traz o motivo. Mudar uma delas exige registrar aqui.

## Produto
- **A chave é a interface (1 tela).** O Mobile Versus tinha hub, modal de configuração e etapas select → match → result → overview. No palco, o operador precisa de 1 toque por round.
- **Melhor de 3:** 2 rounds vencidos fazem o MC avançar automaticamente, sem tela de resultado.
- **Empate = segurar 1,2 s** no nome ou na área do confronto. Um toque curto continua sendo round, então o empate não pode ser marcado sem querer. Tem feedback visual (barra enchendo e flash).
- **Sem ordem obrigatória.** A batalha é imprevisível (MC atrasa, inverte a ordem). O brilho só sugere o próximo confronto; qualquer confronto com 2 nomes pode ser jogado.
- **Sem bye automático.** Tamanhos perfeitos são 4, 8 e 16. Com outro número de MCs, sobram vagas vazias, e o app assume repescagem ou MC que chega depois.
- **Repescagem e sorteio ficam fora do app.** O operador só digita o nome na vaga (`Editar`). Nada é guardado além do texto (`overrides`).
- **Nome digitado substitui o vencedor sem avisar.** É aceito: quem edita sabe o que está fazendo, e um aviso custaria um toque a mais.
- **Histórico = a chave inteira** (nomes, overrides e rounds), que dá para reabrir em modo leitura. Arquiva se houver campeão ou pelo menos 1 round. Entradas antigas (só o campeão) continuam listadas, sem abrir. O formato só ganhou campos opcionais, por isso não houve `v2`.

- **Navbar = navegação entre 3 telas** (HISTÓRICO · BATALHA · RANKING, com BATALHA maior no meio). As ações da batalha subiram para o topo do palco: ficam perto da chave e não competem com a navegação. `Nova chave` virou `Encerrar`, porque é isso que leva a batalha ao histórico e ao ranking.
- **Ranking com a regra do `service-versus`** (3 / +1 / 5), calculado a partir do histórico local. Nada é salvo à parte, então editar ou apagar o histórico nunca deixa o ranking dessincronizado.

## Técnica
- **Um `index.html`, vanilla, sem build.** Custo mínimo de manutenção e de tokens, e deploy estático trivial.
- **Estado derivado** (`names + overrides + taps`). Evita estado inconsistente, e desfazer vira `pop()`.
- **`localStorage` com `try/catch`.** No modo privado, o app funciona sem salvar.
- **Mesmo padrão do Aura Farmer** (save local, agente Cerberus). Do Cerberus, só o processo foi importado; o `ui-ux-pro-max` (3,6 MB) ficou de fora.

## UI (v2, feedback do dono)
- Título `VERSUS` grande e centralizado. Sem placeholders "MC 1…" e sem traço em vaga vazia.
- Campos sem caixa: texto sobre a linha do galho.
- 1 fase = 1 tela de largura (`scroll-snap`). A 1ª fase ocupa a altura útil.
- A barra de rolagem lateral é visível e fica colada acima dos botões. Antes, parecia uma "linha no meio da tela".

## Histórico do processo
- v1: prompt do Gemini → Claude Code. A revisão está em [GEMINI_REVIEW.md](GEMINI_REVIEW.md).
- v2: polimento de UI pedido pelo Gemini com base nessa revisão.

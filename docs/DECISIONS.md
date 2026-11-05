# Decisões

Cada decisão traz o motivo. Mudar uma delas exige registrar aqui.

## Produto
- **A chave é a interface (1 tela).** O Mobile Versus tinha hub, modal de configuração e etapas select → match → result → overview. No palco, o operador precisa de 1 toque por round.
- **Melhor de 3:** 2 rounds vencidos fazem o MC avançar automaticamente, sem tela de resultado.
- **Empate = segurar 1,2 s** no nome ou na área do confronto. Um toque curto continua sendo round, então o empate não pode ser marcado sem querer. Tem feedback visual (barra enchendo e flash).
- **Sem ordem obrigatória.** A batalha é imprevisível (MC atrasa, inverte a ordem). O brilho só sugere o próximo confronto; qualquer confronto com 2 nomes pode ser jogado.
- **Sem bye automático.** Tamanhos perfeitos são 4, 8 e 16. Com outro número de MCs, sobram vagas vazias, e o app assume repescagem ou MC que chega depois.
- **Repescagem e sorteio ficam fora do app.** O operador toca na vaga vazia e escolhe o MC na grade. Nada é guardado além do `place`.
- **MC posto numa vaga das fases seguintes substitui o vencedor sem avisar.** É aceito: quem escolhe a vaga sabe o que está fazendo, e um aviso custaria um toque a mais.
- **Histórico = a chave inteira** (nomes, overrides e rounds). O card expande no lugar com a chave só leitura, igual ao `ExpansionTile` do Mobile Versus (dá para comparar várias edições na mesma lista). Arquiva se houver campeão ou pelo menos 1 round. Entradas antigas (só o campeão) continuam listadas, sem abrir. No v7, a chave passou a ser guardada como linha do tempo (ver abaixo).

- **Home + janelas sobrepostas (v5, pedido do dono).** O app abre numa Home (`VERSUS` + `Batalhar`). Chave, Histórico e Ranking abrem como janela com respiro e borda sobre a Home; a barra inferior (HISTÓRICO · DESFAZER · CHAVE · EDITAR · RANKING) abre e fecha a janela com o mesmo botão. `Desfazer` e `Editar` desceram para a barra (alcance do polegar) e abrem a chave se ela estiver fechada, para o operador ver o efeito. Recarregar com batalha iniciada volta direto para a chave, sem passar pela Home. O round continua sendo 1 toque: a janela da chave fica aberta durante o ao vivo. `Encerrar`, `+ vagas` e `Iniciar` ficam no topo da janela. Substitui a decisão v4 de "navbar só navega".
- **Character select (v7, pedido do dono).** A montagem deixou de ser digitação nos galhos. Na janela CHAVE, a chave fica em cima e a grade de MCs embaixo; tocar numa carta põe o MC na **vaga iluminada**, e tocar numa vaga vazia move o destaque (montagem fora de ordem e repescagem). A grade já traz os MCs do histórico em ordem de pontos, e quem já está na chave aparece esmaecido, mas tocável (repescagem).
  - **O destaque automático só percorre a 1ª fase.** Nas fases seguintes, a vaga vazia espera um vencedor; pôr um MC ali exige tocar na vaga antes, para um toque a mais na grade nunca jogar alguém direto na semifinal.
  - **`Adicionar` põe o MC novo direto na vaga iluminada.** É um passo a menos e não pede uma lista à parte no save.
  - **A grade só aparece quando há vaga iluminada.** Com a chave cheia, a batalha ganha a janela inteira; tocar numa vaga vazia traz a grade de volta, e tocar de novo nela solta o destaque.
  - **Sem `Iniciar` e sem `Editar`.** Confronto com 2 nomes já é jogável. Trocar um MC = desfazer o `place`. Custo aceito: um nome errado lá atrás obriga a desfazer o que veio depois.
  - **Round também pela lateral do colchete** (duas faixas de 56px, uma por MC). Alvos de toque ≥ 48px.
- **Sem MC duplicado na chave (v8, pedido do dono).** A carta de quem está **vivo** na chave fica cinza e não aceita toque, e o `Adicionar` recusa o mesmo nome (o nome fica no campo). Quem só aparece perdendo volta a ficar tocável: a repescagem continua (escolha do dono). Substitui o "esmaecido, mas tocável" do v7.
- **Lixeira na vaga (v8, opção B do pedido).** Uma lixeira vermelha ao lado do nome tira aquele MC da vaga, sem tirar a carta da grade. A vaga fica iluminada para receber outro MC. Só aparece em vaga preenchida por `place` (vencedor derivado não tem) e enquanto o confronto não teve round: depois do 1º round, trocar o MC mudaria um placar já jogado. Na carta da grade não funcionaria, porque a grade some com a chave cheia.
- **Zoom por pinça só na chave (v8, pedido do dono).** A pinça (ou ctrl + roda/trackpad) amplia a chave no palco e no card do histórico, entre 0,4x e 2,5x, com o ponto entre os dedos parado. O zoom da página fica bloqueado (viewport `user-scalable=no`, `touch-action: pan-x pan-y`, `gesturestart` no iOS). Custo de acessibilidade aceito: as fontes já são grandes, os alvos têm ≥ 48px, a própria chave amplia e o zoom do teclado (Ctrl +/−) continua. O zoom é estado de tela: não é salvo e volta a 1x ao encerrar.
- **Linha do tempo com undo/redo (v7).** Toda ação é um evento (`place`, `round`, `draw`) numa pilha ordenada com cursor. Undo e redo ficam num botão flutuante no canto da chave, sempre visíveis; ação nova depois de undo descarta o redo, como num editor. Com isso, `DESFAZER` saiu da barra inferior, que voltou a ser só navegação (HISTÓRICO · CHAVE · RANKING). `+ vagas` fica fora da timeline e só aparece antes do 1º round.
- **Telas cheias, sem modal (v10, pedido do dono).** Chave, Histórico e Ranking deixam de ser janelas (borda, ✕, fundo escurecido) e viram telas cheias acima da barra, que é a única navegação, com a aba ativa destacada. A Home continua: o botão central mostra CHAVE (BATALHA, ao vivo) fora da chave e HOME dentro dela. A chave em andamento continua abrindo direto ao recarregar. Substitui as janelas sobrepostas do v5. As folhas VAGAS e ENCERRAR continuam como `<dialog>`: são escolhas com Cancelar, não telas.
- **Zoom inicial afastado (v10).** `MIN_ROW` cai de 60 para 44 (alvo mínimo): uma chave de 8 cabe na 1ª tela do celular, mesmo com a grade aberta. Fica claro que é uma chave e convida a rolar ou dar pinça. Rolagem e pinça não mudam.
- **`Adicionar` só cria a carta (v10).** O MC entra na chave só ao tocar na carta. A carta nova não é salva (vive na sessão); quem entrou na chave já está nos eventos e volta na grade. Assim o formato do save não muda e o undo não mexe na carta.
- **Vaga selecionada = contorno suave + seta ▶ (v10)** antes do ponto onde o nome entra. A seta reforça o estado além da cor; o contorno não pulsa.
- **Chave generativa (v10).** A 1ª fase aparece inteira; das seguintes, só o caminho de quem venceu: galho solto até a vaga do vencedor e o colchete quando os 2 confrontos que se enfrentam têm vencedor. O campeão só aparece no fim. Exceção para manter a repescagem: a vaga vazia ao lado de um vencedor aparece quando o confronto que a alimenta travou (falta MC lá atrás). É só desenho (`visible()`): `derive()`, IDs e o save não mudam.
- **VAGAS e ENCERRAR na barra inferior (v9, pedido do dono).** A barra passa a ser HISTÓRICO · VAGAS · CHAVE · ENCERRAR · RANKING (alcance do polegar, como no v5). Substitui "a barra só navega" do v7. `#tools` fica só com a dica do ao vivo.
  - **VAGAS aumenta e diminui** (4 · 8 · 16), só antes do 1º round, numa folha com os 3 tamanhos. Diminuir corta as vagas de baixo; a folha mostra antes quem sai. Quem sai perde a vaga e sai da timeline, sem undo (o tamanho segue fora da timeline). Custo aceito: um MC cadastrado só nessa chave some da grade.
  - **ENCERRAR = recomeçar a chave**, em vermelho, com folha de confirmação: **Salvar e recomeçar** (Histórico + Ranking, só se houver round) ou **Recomeçar sem salvar** (botão vermelho; apaga a chave, não conta). O foco começa no Cancelar, para Enter nunca apagar. A chave nova mantém o número de vagas. Substitui o `confirm()` do Encerrar.
- **Ranking com a regra do `service-versus`** (3 / +1 / 5), calculado a partir do histórico local. Nada é salvo à parte, então editar ou apagar o histórico nunca deixa o ranking dessincronizado.

## Técnica
- **Um `index.html`, vanilla, sem build.** Custo mínimo de manutenção e de tokens, e deploy estático trivial.
- **Estado derivado** (`events + cursor`; `view()` faz o replay para `names + overrides + taps` e `derive()` continua o mesmo). Evita estado inconsistente; desfazer e refazer só movem o cursor.
- **Save `versus-web:v2` com migração automática da v1.** A v1 nunca é apagada nem sobrescrita: fica como backup no aparelho.
- **Lixeira = `place` com `name: ''` (v8).** É um evento que já existe, então o formato do save não muda (sem v3) e undo/redo funcionam de graça. Numa vaga das fases seguintes, o nome vazio faz `derive()` voltar ao vencedor derivado.
- **CSS `zoom` em vez de `transform: scale`.** O `zoom` muda o layout, então a área de rolagem e os toques acompanham a escala. O snap de coluna fica desligado enquanto a chave está ampliada ou reduzida.
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
- v3: histórico guarda a chave inteira.
- v4: navbar com 3 abas (Histórico · Batalha · Ranking), ações no topo do palco, ranking com a regra do `service-versus`.
- v5: Home inicial; chave, histórico e ranking em janelas sobrepostas; barra inferior com toggle, `Desfazer` e `Editar`.
- v6: card do histórico expande no lugar com a chave (padrão do Mobile Versus); `bracket()` reusado no palco e no histórico.
- v7: character select, linha do tempo com undo/redo, save v2 com migração da v1.
- v8: zoom por pinça na chave (palco e histórico), carta travada para MC vivo, lixeira na vaga.
- v9: VAGAS (aumentar e diminuir) e ENCERRAR (salvar ou recomeçar sem salvar) na barra inferior.
- v10: telas cheias sem modal, zoom inicial afastado, `Adicionar` só cria a carta, vaga selecionada com seta, chave generativa.

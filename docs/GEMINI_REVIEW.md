# Para o Gemini — revisão do Versus Web v1 + prompt de correção

Você é especialista em prompts e revisor de produto. Abaixo está o relatório do que o Claude Code construiu a partir do seu prompt anterior, mais o feedback do dono do produto. Sua tarefa:

1. Avaliar o resultado aplicando duas lentes:
   - **Ponytail:** a menor mudança completa. Sem abstração, opção ou feature que ninguém pediu. Prefira apagar a adicionar.
   - **UI/UX Pro Max:** hierarquia visual, simetria, alvos de toque, contraste, affordance de rolagem e de toque, estados e feedback, mobile-first.
2. Devolver **um único prompt curto** para o Claude Code corrigir só os pontos finos. Só o necessário para a funcionalidade e para uma interface impecável, gastando o mínimo de tokens. Nada de refatorar o que funciona.

---

## 1. Contexto
O **Versus** é uma ferramenta para o operador de batalhas de rima (batalhas de MCs). O Mobile Versus (Flutter + API) ficou pesado, com hub, modais, várias etapas no palco e ordem obrigatória. O **Versus Web** é o MVP enxuto: **uma tela, e a própria chave é a interface**.

- Repositório: github.com/kira8000/versus-web
- No ar: https://versusproject.vercel.app/
- Stack: um único `index.html` com cerca de 270 linhas, CSS e JS vanilla inline, sem build e sem dependências.

## 2. O que foi construído (v1)
- **Montagem:** chave com 4 vagas, botão `+` que dobra (4 → 8 → 16) e `Iniciar` liberado com pelo menos 4 nomes. Vagas vazias continuam vazias (repescagem ou MC que chega depois), sem bye automático.
- **Ao vivo:**
  - Tocar no nome dá 1 round (●). Com 2 bolinhas, o MC vence e sobe para o próximo galho, que fica verde (o perdedor fica vermelho).
  - Segurar 1,2 s no nome ou na área do confronto marca empate: barra amarela enchendo e um flash ao confirmar.
  - Não há ordem obrigatória. O confronto sugerido pulsa em amarelo e os demais ficam esmaecidos.
  - O botão `✎ Editar` transforma as vagas ainda não disputadas em campos de texto. É assim que funciona a repescagem manual.
  - Barra fixa embaixo com `Desfazer`, `Editar` e `Nova chave`. Nova chave pede confirmação e arquiva o campeão no histórico.
- **Estado:** `localStorage["versus-web:v1"]` = `{ current: { size, started, names[], overrides{}, taps[{match, winner|null}] }, history[] }`.
  - Placar, avanço, sugestão e campeão são calculados por uma função pura, `derive()`.
  - Desfazer é só `taps.pop()`.
  - Há 7 auto-testes com `console.assert`, todos passando.
- **Layout:** posicionamento absoluto, com colunas de 150px e linhas a cada 60px. As linhas da chave ficam num SVG atrás dos nomes. A rolagem horizontal fica num contêiner que tem a altura da chave.
- **Verificado em viewport de 375px:** montagem, pontuação fora de ordem, empate, desfazer, repescagem via Editar, campeão, recarregar a página e histórico.

## 3. Problemas conhecidos (relatório do Claude)
- Empate não aparece no placar, só no flash do momento.
- "Segurar" foi testado só por script, não com o dedo num aparelho real.
- Nome digitado em vaga de fase seguinte substitui o vencedor sem avisar (decisão aceita).
- Nomes longos são cortados (`overflow:hidden`), sem reticências.

## 4. Feedback do dono (prioridade máxima)
1. **Título "VERSUS"** grande e centralizado no topo.
2. **Sem placeholders** "MC 1", "MC 2"… nos campos.
3. **O traço "—"** nas vagas vazias das fases seguintes parece estranho. Remover.
4. **A caixa cinza de fundo** dos campos não combina com as linhas da chave. Os campos devem parecer parte do galho (texto sobre a linha), não caixas soltas.
5. **Sensação de assimetria:** hoje a chave fica pequena, presa no canto superior esquerdo, com muito espaço vazio.
6. **Tratar a tela como uma página:** a 1ª fase deve ocupar quase a altura útil toda, com campos maiores e espaço generoso entre eles. As ramificações devem sair claramente dos campos para as fases seguintes.
7. **Cada fase com a largura de uma tela,** para ir às fases seguintes rolando para o lado.
8. **Rolagem horizontal bem visível e encostada na barra de botões.** Hoje a barra de rolagem aparece como uma "linha no meio da tela", porque o contêiner termina onde termina a chave. Ela deve deixar óbvio que dá para puxar para o lado.
9. **Bolinhas (●) sempre visíveis ao lado do nome do MC** durante o confronto.
10. **Espaço confortável para os botões de operação** embaixo.

## 5. Restrições para o prompt que você vai gerar
- Continuar com um único `index.html`, sem dependências e sem build. Não mexer em `derive()`, no formato do `localStorage` nem nos auto-testes. A lógica está correta; isto é polimento de layout e CSS.
- Listar as mudanças como itens objetivos e verificáveis.
- Incluir no final um critério de pronto curto: testar em 375×812 e 768×1024; uma fase por tela; rolagem lateral visível acima da barra de botões; sem placeholders e sem traços; título centralizado.
- Responder **só com o prompt final**, em português, para o Claude Code.

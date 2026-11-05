# Versus Web

Chave de batalha de rima (batalha de MCs) que roda no navegador do celular. **A própria chave é a interface**: você escolhe os MCs numa grade (estilo seleção de personagem), eles caem nas vagas da chave, e você toca em quem venceu cada round. Encerrou, a batalha vai para o **Histórico** e soma no **Ranking**.

- **No ar:** https://versusproject.vercel.app/
- **Código:** um único [`index.html`](index.html) com HTML, CSS e JS vanilla. Sem build e sem dependências.
- **Dados:** `localStorage` do navegador. Não tem backend nem login.

É o MVP enxuto do **Mobile Versus** (app Flutter + API `service-versus`), que ficou pesado demais para o operador no meio da batalha. A ideia é validar aqui a interação simples e depois levar essa simplicidade de volta ao app.

## Funcionalidades

| Tela | O que tem |
|------|-----------|
| **CHAVE** | Chave de 4, 8 ou 16 vagas; character select com os MCs do histórico; 1 fase por tela (arrasta para o lado); round com 1 toque no nome ou na lateral do colchete; empate segurando; desfazer e refazer tudo, em ordem; repescagem tocando na vaga vazia; confronto sugerido piscando; campeão com 👑 |
| **HISTÓRICO** | Todas as batalhas encerradas (data, tamanho, campeão); toque no card expande a chave completa ali mesmo, como no Mobile Versus |
| **RANKING** | Tabela por MC: pontos, vitórias, vitórias 2x0, títulos; top 3 em destaque |
| Sempre | Salva sozinho no navegador a cada toque; recarregar continua de onde parou; funciona offline depois de aberto uma vez* |

\* O app é um único arquivo estático: depois de carregado, nada depende da rede. Não há service worker, então abrir do zero sem internet não funciona.

## Como usar (operador)

O app abre na Home: **VERSUS** + **Batalhar**. Chave, Histórico e Ranking são telas cheias, sem janela nem ✕: a barra de baixo é a única navegação, com **HISTÓRICO** · **VAGAS** · botão central · **ENCERRAR** (em vermelho) · **RANKING**. Fora da chave, o botão central mostra **CHAVE** (ou **BATALHA**, com a chave ao vivo) e abre a chave; dentro dela, vira **HOME** e volta para a Home. Tocar de novo em HISTÓRICO ou RANKING também volta para a Home. Na tela da chave: a chave em cima, com **↶ ↷** (desfazer/refazer) no canto, e a grade de MCs embaixo enquanto houver vaga para preencher.

| Ação | Como |
|------|------|
| Montar a chave | A vaga selecionada (contorno suave e seta **▶**) recebe o MC que você tocar na grade; a seleção passa para a próxima vaga |
| Montar fora de ordem | Toque numa vaga vazia (o contorno e a seta vão para ela) e depois no MC. Toque de novo na vaga para soltar |
| MC novo | Digite o nome e `Adicionar`: aparece uma carta nova (destacada) no topo da grade. Toque nela para pôr o MC na vaga. A carta vale só nesta sessão; se o MC entrou na chave, ele continua na grade depois |
| Ver a chave | Ela abre afastada (uma chave de 8 cabe na tela do celular). Role ou dê **pinça** para aproximar. As fases seguintes aparecem conforme os vencedores sobem: um galho por vencedor e o colchete quando os 2 confrontos que se enfrentam têm vencedor |
| Aumentar ou diminuir a chave | `VAGAS` na barra → escolha 4, 8 ou 16 (só antes do 1º round). Ao diminuir, a folha avisa quem sai da chave |
| Dar um round | Toque no nome de quem venceu **ou** na lateral do colchete do lado dele (aparece ●) |
| Vencer o confronto | Com 2 bolinhas, o MC sobe sozinho para a próxima fase |
| Empate | **Segure** 1,2 s no nome ou na área do confronto (uma barra enche) |
| MC errado numa vaga | Toque na **lixeira vermelha** ao lado do nome (só antes do 1º round daquele confronto): a vaga esvazia e fica selecionada, e o MC volta a ficar disponível na grade. MC que já está vivo na chave fica cinza e não entra de novo |
| Ampliar a chave | **Pinça** com 2 dedos sobre a chave (ou no card do Histórico); só a chave muda de tamanho. No computador, Ctrl + roda/trackpad |
| Errou | **↶** desfaz a última ação (MC posto, round, empate), uma por vez, até o início. **↷** refaz. Uma ação nova depois de desfazer apaga o que dava para refazer |
| Repescagem / MC atrasado | Toque na vaga vazia onde ele entra e escolha o MC na grade (MC já eliminado também pode) |
| Ver outras fases | Arraste para o lado (cada fase ocupa uma tela) |
| Encerrar / recomeçar | `ENCERRAR` na barra → **Salvar e recomeçar** (a chave vai para o Histórico e conta no Ranking) ou **Recomeçar sem salvar** (vermelho: apaga a chave, não conta). A chave nova mantém o número de vagas |
| Rever uma batalha | `HISTÓRICO` → toque no card: a chave abre dentro dele (só leitura; arraste para o lado). Toque de novo para fechar |
| Ranking | aba `RANKING`: vitória 3 pts, vitória 2x0 +1, título 5 (mesma regra do `service-versus`) |

Regras de propósito:
- **Não há ordem obrigatória.** O confronto sugerido pisca, mas dá para jogar qualquer um que tenha 2 nomes.
- **Chave incompleta não dá "bye".** Uma vaga vazia espera o operador escolher o MC.
- **Sorteio e definição de confrontos ficam fora do app.**

## Rodar localmente

Basta abrir o `index.html` no navegador. Para testar como site (necessário para o browser pane do Claude Code):

```bash
python -m http.server 5178
```

Depois acesse http://localhost:5178. O auto-teste roda ao carregar a página: qualquer `Assertion failed` no console é bug.

## Deploy

Vercel (projeto `versusproject`, preset **Other**, sem build). Cada push na `main` publica sozinho.

## Limitações conhecidas

- Os dados ficam **só no navegador daquele aparelho**. Trocar de celular, limpar os dados do site ou usar aba anônima perde o histórico e o ranking.
- Não dá para apagar uma batalha do histórico nem renomear um MC no ranking: o nome conta exatamente como foi digitado (ignorando maiúsculas e espaços nas pontas).
- Trocar um MC colocado lá atrás exige desfazer tudo o que veio depois (a linha do tempo é única).
- "Segurar para empate" foi testado por script; falta validar com o dedo em aparelho real.

## Próximos passos (não implementados)

- Exportar/importar o histórico (JSON) para não depender de um aparelho só.
- Integrar com a API `service-versus` (`/v1/editions/...`) quando o fluxo simples estiver validado.
- Levar a interação "a chave é a interface" de volta para o Mobile Versus.

## Para quem vai mexer no código

1. [AGENTS.md](AGENTS.md): regras do repositório (para humanos e agentes).
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): estado, `derive()`, render e eventos.
3. [docs/DECISIONS.md](docs/DECISIONS.md): por que está assim.
4. [.claude/skills/cerberus](.claude/skills/cerberus/SKILL.md): fluxo de trabalho do agente (Claude Code).

# Versus Web

Chave de batalha de rima (batalha de MCs) que roda no navegador do celular. **Uma tela só, e a própria chave é a interface**: você digita os nomes nos galhos, inicia, e toca em quem venceu cada round.

- **No ar:** https://versusproject.vercel.app/
- **Código:** um único [`index.html`](index.html) com HTML, CSS e JS vanilla. Sem build e sem dependências.
- **Dados:** `localStorage` do navegador. Não tem backend nem login.

É o MVP enxuto do **Mobile Versus** (app Flutter + API `service-versus`), que ficou pesado demais para o operador no meio da batalha. A ideia é validar aqui a interação simples e depois levar essa simplicidade de volta ao app.

## Como usar (operador)

| Ação | Como |
|------|------|
| Escrever os MCs | Toque no galho da 1ª fase e digite |
| Aumentar a chave | `+` dobra: 4 → 8 → 16 |
| Começar | `Iniciar` (precisa de pelo menos 4 nomes) |
| Dar um round | Toque no nome de quem venceu (aparece ●) |
| Vencer o confronto | Com 2 bolinhas, o MC sobe sozinho para a próxima fase |
| Empate | **Segure** 1,2 s no nome ou na área do confronto (uma barra enche) |
| Errou | `Desfazer` (desfaz rounds, empates e avanços, um por vez) |
| Repescagem / MC atrasado | `Editar` → digite o nome na vaga vazia onde ele entra |
| Ver outras fases | Arraste para o lado (cada fase ocupa uma tela) |
| Encerrar | `Nova chave` (o campeão vai para o Histórico) |

Regras de propósito:
- **Não há ordem obrigatória.** O confronto sugerido pisca, mas dá para jogar qualquer um que tenha 2 nomes.
- **Chave incompleta não dá "bye".** Uma vaga vazia espera o operador digitar o nome.
- **Sorteio e definição de confrontos ficam fora do app.**

## Rodar localmente

Basta abrir o `index.html` no navegador. Para testar como site (necessário para o browser pane do Claude Code):

```bash
python -m http.server 5178
```

Depois acesse http://localhost:5178. O auto-teste roda ao carregar a página: qualquer `Assertion failed` no console é bug.

## Deploy

Vercel (projeto `versusproject`, preset **Other**, sem build). Cada push na `main` publica sozinho.

## Para quem vai mexer no código

1. [AGENTS.md](AGENTS.md): regras do repositório (para humanos e agentes).
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): estado, `derive()`, render e eventos.
3. [docs/DECISIONS.md](docs/DECISIONS.md): por que está assim.
4. [.claude/skills/cerberus](.claude/skills/cerberus/SKILL.md): fluxo de trabalho do agente (Claude Code).

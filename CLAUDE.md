@AGENTS.md

# Versus Web — Claude Code

- Mudança mínima e completa (Ponytail): o portal só mostra dados públicos. Não adicione login, escrita nem dependências sem motivo registrado em `docs/DECISIONS.md`.
- Valide no browser pane (`preview_start` → `versus-web`) em 375 e 768 de largura.
- A skill **cerberus** (`.claude/skills/cerberus`) é do protótipo em `public/legado/`; use-a só se mexer nele.
- No PowerShell 5, não use `Get-Content`/`Set-Content` sem `-Encoding utf8` (os arquivos têm acentos). Prefira Edit.

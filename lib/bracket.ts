/** Confronto como `/v1/public/editions/:id` entrega (nomes, sem ids internos). */
export type PublicMatch = {
  phase: string;
  sortOrder: number;
  a: string | null;
  b: string | null;
  scoreA: number;
  scoreB: number;
  winner: string | null;
  matchKind: string | null;
};

export type BracketColumn = { phase: string; matches: PublicMatch[] };
export type Bracket = { size: number; columns: BracketColumn[]; champion: string | null };

// Mesmas fases do palco do app (versus-app/src/domain/editionPhases.ts).
const PHASES_BY_SIZE: Record<number, string[]> = {
  16: ['oitavas', 'quartas', 'semi', 'final'],
  8: ['quartas', 'semi', 'final'],
  4: ['semi', 'final'],
};

/**
 * Chave para desenhar, direto dos confrontos (o portal só mostra edição concluída:
 * não precisa derivar placar). Mesma checagem do `sandboxFromDetail` do app: palco
 * antigo, repescagem ou fase incompleta → null, e a página mostra a lista.
 */
export function bracketFromMatches(matches: PublicMatch[]): Bracket | null {
  if (matches.some((m) => (m.matchKind ?? 'standard') !== 'standard')) return null;
  const size = [16, 8, 4].find((s) => matches.length === s - 1);
  if (!size) return null;

  const columns: BracketColumn[] = [];
  for (const [c, phase] of PHASES_BY_SIZE[size].entries()) {
    const inPhase = matches.filter((m) => m.phase === phase).sort((x, y) => x.sortOrder - y.sortOrder);
    if (inPhase.length !== size >> (c + 1) || inPhase.some((m, i) => m.sortOrder !== i)) return null;
    columns.push({ phase, matches: inPhase });
  }
  return { size, columns, champion: columns[columns.length - 1].matches[0].winner };
}

const PHASE_LABELS: Record<string, string> = {
  oitavas: 'Oitavas',
  quartas: 'Quartas',
  semi: 'Semifinal',
  final: 'Final',
  primeira: 'Primeira fase',
};

export const phaseLabel = (phase: string) => PHASE_LABELS[phase] ?? phase;

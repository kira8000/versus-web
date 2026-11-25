import type { PublicMatch } from './bracket';

/** Só a API pública (sem login). Production por padrão: o portal mostra batalhas reais. */
const API = (process.env.VERSUS_API_URL ?? 'https://service-versus-production.up.railway.app').replace(/\/+$/, '');

/** ISR por tempo: a página pode ficar até 5 min atrás do servidor. */
export const REVALIDATE_SECONDS = 300;

export type PublicOrganization = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string | null;
  scheduleText: string | null;
  latitude: number | null;
  longitude: number | null;
  editionCount: number;
};

export type RankingRow = { rank: number; name: string; points: number; wins: number; wins2x0?: number; titles: number };

export type PublicEditionSummary = {
  id: string;
  name: string;
  eventDate: string;
  formatTarget: string | null;
  champion: string | null;
};

export type PublicOrganizationPage = {
  organization: PublicOrganization;
  ranking: RankingRow[];
  editions: PublicEditionSummary[];
};

export type PublicEdition = PublicEditionSummary & {
  organization: { slug: string; name: string };
  matches: PublicMatch[];
};

/** null no 404 (a página chama notFound); outro erro sobe para o error boundary. */
async function get<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API}/v1/public${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status} em ${path}`);
  return (await res.json()) as T;
}

export const listOrganizations = async () =>
  (await get<{ data: PublicOrganization[] }>('/organizations'))?.data ?? [];

export const getOrganization = (slug: string) =>
  get<PublicOrganizationPage>(`/organizations/${encodeURIComponent(slug)}`);

export const getEdition = (id: string) => get<PublicEdition>(`/editions/${encodeURIComponent(id)}`);

export const mapUrl = (org: Pick<PublicOrganization, 'address' | 'city'>) =>
  `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${org.address}, ${org.city}`)}`;

export const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

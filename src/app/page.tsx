import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 3600;

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
});

const CLUBS = [
  { id: 'man-utd', name: 'Man Utd', logo: 'https://resources.premierleague.com/premierleague/badges/t1.svg' },
  { id: 'arsenal', name: 'Arsenal', logo: 'https://resources.premierleague.com/premierleague/badges/t3.svg' },
  { id: 'liverpool', name: 'Liverpool', logo: 'https://resources.premierleague.com/premierleague/badges/t14.svg' },
  { id: 'man-city', name: 'Man City', logo: 'https://resources.premierleague.com/premierleague/badges/t43.svg' },
  { id: 'chelsea', name: 'Chelsea', logo: 'https://resources.premierleague.com/premierleague/badges/t8.svg' },
  { id: 'tottenham', name: 'Tottenham', logo: 'https://resources.premierleague.com/premierleague/badges/t6.svg' },
  { id: 'aston-villa', name: 'Aston Villa', logo: 'https://resources.premierleague.com/premierleague/badges/t7.svg' },
  { id: 'newcastle', name: 'Newcastle', logo: 'https://resources.premierleague.com/premierleague/badges/t4.svg' },
  { id: 'brighton', name: 'Brighton', logo: 'https://resources.premierleague.com/premierleague/badges/t36.svg' },
  { id: 'nottm-forest', name: 'Nottm Forest', logo: 'https://resources.premierleague.com/premierleague/badges/t17.svg' },
  { id: 'brentford', name: 'Brentford', logo: 'https://resources.premierleague.com/premierleague/badges/t94.svg' },
  { id: 'fulham', name: 'Fulham', logo: 'https://resources.premierleague.com/premierleague/badges/t54.svg' },
  { id: 'bournemouth', name: 'Bournemouth', logo: 'https://resources.premierleague.com/premierleague/badges/t91.svg' },
  { id: 'west-ham', name: 'West Ham', logo: 'https://resources.premierleague.com/premierleague/badges/t21.svg' },
  { id: 'leicester', name: 'Leicester', logo: 'https://resources.premierleague.com/premierleague/badges/t13.svg' },
  { id: 'everton', name: 'Everton', logo: 'https://resources.premierleague.com/premierleague/badges/t11.svg' },
  { id: 'wolves', name: 'Wolves', logo: 'https://resources.premierleague.com/premierleague/badges/t39.svg' },
  { id: 'crystal-palace', name: 'Crystal Palace', logo: 'https://resources.premierleague.com/premierleague/badges/t31.svg' },
  { id: 'ipswich', name: 'Ipswich', logo: 'https://resources.premierleague.com/premierleague/badges/t40.svg' },
  { id: 'southampton', name: 'Southampton', logo: 'https://resources.premierleague.com/premierleague/badges/t20.svg' },
];

async function getLiveStandings() {
  try {
    const res = await fetch('https://api-football-standings.azharimm.site/leagues/eng.1/standings?season=2024&sort=asc', { 
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    return data.data.standings.map((s: any) => ({
      rank: s.stats.find((st: any) => st.name === 'rank')?.value || 0,
      team: s.team.displayName,
      points: s.stats.find((st: any) => st.name === 'points')?.value || 0,
      logo: s.team.logos?.[0]?.href || 'https://resources.premierleague.com/premierleague/badges/rb/t3.svg'
    }));
  } catch (e) {
    return [];
  }
}

async function getNews() {
  const SOURCES = [
    { name: 'The Guardian', url: 'https://www.theguardian.com/football/premierleague/rss' },
    { name: 'Mirror Sport', url: 'https://www.mirror.co.uk/sport/football/rss.xml' }
  ];
  const feeds = await Promise.all(SOURCES.map(async (src) => {
    try {
      const res = await parser.parseURL(src.url);
      return res.items.map(i => ({ ...i, sourceName: src.name }));
    } catch (e) { return []; }
  }));
  return feeds.flat().sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()).slice(0, 20);
}

export default async function Page() {
  const [articles, standings] = await Promise.all([getNews(), getLiveStandings()]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-16 bg-[#3d195b] flex md:flex-col gap-1 overflow
import Parser from 'rss-parser';

export const revalidate = 300; // Oppdaterer hvert 5. minutt

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
});

const CLUBS = [
  { name: 'Arsenal', logo: 'https://resources.premierleague.com/premierleague/badges/t3.svg', url: 'https://www.arsenal.com' },
  { name: 'Aston Villa', logo: 'https://resources.premierleague.com/premierleague/badges/t7.svg', url: 'https://www.avfc.co.uk' },
  { name: 'Bournemouth', logo: 'https://resources.premierleague.com/premierleague/badges/t91.svg', url: 'https://www.afcb.co.uk' },
  { name: 'Brentford', logo: 'https://resources.premierleague.com/premierleague/badges/t94.svg', url: 'https://www.brentfordfc.com' },
  { name: 'Brighton', logo: 'https://resources.premierleague.com/premierleague/badges/t36.svg', url: 'https://www.brightonandhovealbion.com' },
  { name: 'Chelsea', logo: 'https://resources.premierleague.com/premierleague/badges/t8.svg', url: 'https://www.chelseafc.com' },
  { name: 'Crystal Palace', logo: 'https://resources.premierleague.com/premierleague/badges/t31.svg', url: 'https://www.cpfc.co.uk' },
  { name: 'Everton', logo: 'https://resources.premierleague.com/premierleague/badges/t11.svg', url: 'https://www.evertonfc.com' },
  { name: 'Fulham', logo: 'https://resources.premierleague.com/premierleague/badges/t54.svg', url: 'https://www.fulhamfc.com' },
  { name: 'Ipswich', logo: 'https://resources.premierleague.com/premierleague/badges/t40.svg', url: 'https://www.itfc.co.uk' },
  { name: 'Leicester', logo: 'https://resources.premierleague.com/premierleague/badges/t13.svg', url: 'https://www.lcfc.com' },
  { name: 'Liverpool', logo: 'https://resources.premierleague.com/premierleague/badges/t14.svg', url: 'https://www.liverpoolfc.com' },
  { name: 'Man City', logo: 'https://resources.premierleague.com/premierleague/badges/t43.svg', url: 'https://www.mancity.com' },
  { name: 'Man Utd', logo: 'https://resources.premierleague.com/premierleague/badges/t1.svg', url: 'https://www.manutd.com' },
  { name: 'Newcastle', logo: 'https://resources.premierleague.com/premierleague/badges/t4.svg', url: 'https://www.nufc.co.uk' },
  { name: 'Nottm Forest', logo: 'https://resources.premierleague.com/premierleague/badges/t17.svg', url: 'https://www.nottinghamforest.co.uk' },
  { name: 'Southampton', logo: 'https://resources.premierleague.com/premierleague/badges/t20.svg', url: 'https://www.southamptonfc.com' },
  { name: 'Tottenham', logo: 'https://resources.premierleague.com/premierleague/badges/t6.svg', url: 'https://www.tottenhamhotspur.com' },
  { name: 'West Ham', logo: 'https://resources.premierleague.com/premierleague/badges/t21.svg', url: 'https://www.whufc.com' },
  { name: 'Wolves', logo: 'https://resources.premierleague.com/premierleague/badges/t39.svg', url: 'https://www.wolves.co.uk' },
];

async function getNews() {
  const SOURCES = [
    { name: 'The Guardian', url: 'https://www.theguardian.com/football/premierleague/rss' },
    { name: 'Mirror Sport', url: 'https://www.mirror.co.uk/sport/football/rss.xml' }
  ];

  try {
    const feeds = await Promise.all(
      SOURCES.map(async (src) => {
        try {
          const res = await parser.parseURL(src.url);
          return res.items.map(i => ({ ...i, sourceName: src.name }));
        } catch (e) { return []; }
      })
    );
    return feeds.flat().sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()).slice(0, 18);
  } catch (e) { return []; }
}

async function getStandings() {
  try {
    // Henter live-tabell fra en åpen kilde (f.eks. via football-data.org eller lignende proxy)
    const res = await fetch('https://api-football-standings.azharimm.site/leagues/eng.1/standings?season=2024&sort=asc', { next: { revalidate: 3600 } });
    const data = await res.json();
    return data.data.standings;
  } catch (e) {
    return []; // Fallback hvis API er nede
  }
}

export default async function Page() {
  const [articles, standings] = await Promise.all([getNews(), getStandings()]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row">
      {/* SIDEBAR - Mindre fargerike logoer */}
      <aside className="w-full md:w-16 bg-[#3d195b] flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto sticky top-0 h-auto md:h-screen z-50 p-1 shadow-2xl">
        {CLUBS.map((club) => (
          <a key={club.name} href={club.url} target="_blank" rel="noopener noreferrer" title={club.name} className="flex-shrink-0 w-10 h-10 p-1.5 hover:bg-[#57287c] rounded-md transition-all group">
            <img src={club.logo} alt={club.name} className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform" />
          </a>
        ))}
      </aside>

      {/* HOVEDINNHOLD */}
      <main className="flex-1 flex flex-col">
        <header className="bg-[#3d195b] text-white p-6 border-b border-[#57287c] sticky top-0 md:relative z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://resources.premierleague.com/premierleague/badges/rb/t3.svg" alt="" className="w-10 h-10 brightness-0 invert" />
              <h1 className="text-3xl font-black uppercase italic tracking-tighter">My PL News</h1>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-[#00ff87] text-[10px] font-bold tracking-widest uppercase">Live UK Feed</p>
              <p className="text-white/50 text-[9px] uppercase">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        </header>

        <div className="flex flex-col xl:flex-row gap-8 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* NYHETSSTRØM */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {articles.length > 0 ? articles.map((item, i) => (
              <article key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-extrabold bg-blue-50 text-[#3d195b] px-2 py-0.5 rounded border border-blue-100 uppercase">{item.sourceName}</span>
                    <span className="text-[10px] text-gray-400 font-medium italic">{item.pubDate ? new Date(item.pubDate).toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'}) : ''}</span>
                  </div>
                  <h2 className="text-lg font-bold leading-tight mb-3 text-gray-900 group">
                    <a href={item.link} target="_blank" className="hover:text-blue-600 transition-colors">{item.title}</a>
                  </h2>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4 italic">
                    {item.contentSnippet || item.content?.replace(/<[^>]*>?/gm, '')}
                  </p>
                </div>
                <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 mt-auto">
                  <a href={item.link} target="_blank" className="text-[10px] font-black text-[#3d195b] uppercase flex items-center gap-1 hover:gap-2 transition-all">
                    Full Coverage <span className="text-[#00ff87]">→</span>
                  </a>
                </div>
              </article>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
                <p className="text-gray-400 font-medium">Re-connecting to UK News Servers...</p>
              </div>
            )}
          </div>

          {/* FLYTENDE LIVE TABELL */}
          <aside className="w-full xl:w-80">
            <div className="sticky top-10 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-[#3d195b] text-white px-5 py-4 flex justify-between items-center">
                <span className="font-black uppercase tracking-tighter text-sm italic">League Table</span>
                <span className="text-[9px] bg-[#00ff87] text-black px-2 py-0.5 rounded-full font-bold">LIVE</span>
              </div>
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 border-b uppercase font-bold">
                    <th className="pl-5 py-3 w-8">#</th>
                    <th className="py-3">Club</th>
                    <th className="py-3 text-center">P</th>
                    <th className="pr-5 py-3 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {standings.length > 0 ? standings.slice(0, 10).map((team: any, i: number) => (
                    <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="pl-5 py-3 font-bold text-gray-400">{i + 1}</td>
                      <td className="py-3 flex items-center gap-2 font-bold text-gray-800">
                        <img src={team.team.logos[0].href} alt="" className="w-4 h-4" />
                        <span className="truncate w-24">{team.team.shortDisplayName}</span>
                      </td>
                      <td className="py-3 text-center text-gray-500">{team.stats.find((s:any) => s.name === 'gamesPlayed')?.value || 0}</td>
                      <td className="pr-5 py-3 text-right font-black text-[#3d195b]">{team.stats.find((s:any) => s.name === 'points')?.value || 0}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="p-10 text-center text-gray-400 italic">Updating standings...</td></tr>
                  )}
                </tbody>
              </table>
              <div className="p-4 bg-gray-50 text-center">
                <a href="https://www.premierleague.com/tables" target="_blank" className="text-[9px] font-bold text-gray-400 hover:text-[#3d195b] uppercase tracking-widest">View Full Table</a>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
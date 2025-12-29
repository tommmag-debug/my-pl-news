import Parser from 'rss-parser';

export const revalidate = 60; // Oppdaterer nyhetene hvert minutt

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

const NEWS_SOURCES = [
  { name: 'Sky Sports', url: 'https://www.skysports.com/rss/11661' },
  { name: 'BBC Sport', url: 'https://push.api.bbci.co.uk/feed/intl/en/news/sports/football/premier_league/rss.xml' },
  { name: 'TalkSport', url: 'https://talksport.com/football/feed/' }
];

async function getNews() {
  try {
    const feeds = await Promise.all(
      NEWS_SOURCES.map(async (src) => {
        const f = await parser.parseURL(src.url);
        return f.items.map(i => ({ ...i, sourceName: src.name }));
      })
    );
    return feeds.flat().sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()).slice(0, 15);
  } catch (e) {
    console.error("RSS Error:", e);
    return [];
  }
}

export default async function Page() {
  const articles = await getNews();

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col md:flex-row">
      {/* SIDEBAR - 50% mindre logoer */}
      <aside className="w-full md:w-14 lg:w-16 bg-[#3d195b] flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto sticky top-0 h-auto md:h-screen z-50 p-1">
        {CLUBS.map((club) => (
          <a key={club.name} href={club.url} target="_blank" rel="noopener noreferrer" title={club.name} className="flex-shrink-0 w-10 h-10 p-2 hover:bg-[#57287c] rounded transition-colors group">
            <img src={club.logo} alt={club.name} className="w-full h-auto brightness-0 invert opacity-70 group-hover:opacity-100" />
          </a>
        ))}
      </aside>

      {/* HOVEDINNHOLD */}
      <main className="flex-1 flex flex-col">
        <header className="bg-[#3d195b] text-white p-6 md:p-8 flex items-center justify-between border-b border-[#57287c]">
          <div className="flex items-center gap-4">
            {/* Premier League Logo i Heading */}
            <img src="https://resources.premierleague.com/premierleague/badges/rb/t3.svg" alt="PL Logo" className="w-12 h-12 brightness-0 invert" />
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">My PL News</h1>
              <p className="text-[#00ff87] text-[10px] font-bold tracking-widest uppercase mt-1">Live Updates • UK Sources</p>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 p-6 md:p-8 max-w-[1400px] mx-auto w-full">
          {/* NYHETER (Venstre/Senter) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.length > 0 ? articles.map((item, i) => (
              <article key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase border">{item.sourceName}</span>
                    <span className="text-[10px] text-gray-400">{item.pubDate ? new Date(item.pubDate).toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'}) : ''}</span>
                  </div>
                  <h2 className="text-lg font-bold leading-tight mb-3 text-gray-900 line-clamp-2">
                    <a href={item.link} target="_blank" className="hover:text-[#3d195b]">{item.title}</a>
                  </h2>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                    {item.contentSnippet || item.content?.replace(/<[^>]*>?/gm, '')}
                  </p>
                  <a href={item.link} target="_blank" className="text-[10px] font-black text-[#3d195b] uppercase border-b-2 border-[#00ff87] hover:border-[#3d195b] transition-all pb-0.5">
                    Read Story →
                  </a>
                </div>
              </article>
            )) : (
              <p className="text-gray-500 italic">Fetching latest news from the UK...</p>
            )}
          </div>

          {/* FLYTENDE TABELL (Høyre side) */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-8 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-[#3d195b] text-white px-4 py-2 font-bold text-sm uppercase tracking-wider">
                League Table
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 border-b">
                    <th className="px-4 py-2 font-medium">Pos</th>
                    <th className="px-2 py-2 font-medium">Club</th>
                    <th className="px-2 py-2 font-medium">PL</th>
                    <th className="px-4 py-2 font-medium">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Eksempeldata (Du kan senere koble denne til et Tabell-API) */}
                  {[
                    { pos: 1, name: 'Liverpool', pts: 45, logo: 't14' },
                    { pos: 2, name: 'Arsenal', pts: 40, logo: 't3' },
                    { pos: 3, name: 'Man City', pts: 39, logo: 't43' },
                    { pos: 4, name: 'Aston Villa', pts: 35, logo: 't7' },
                    { pos: 5, name: 'Chelsea', pts: 34, logo: 't8' },
                  ].map((team) => (
                    <tr key={team.pos} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-400">{team.pos}</td>
                      <td className="px-2 py-3 flex items-center gap-2 font-bold">
                        <img src={`https://resources.premierleague.com/premierleague/badges/t${team.logo.replace('t','')}.svg`} alt="" className="w-4 h-4" />
                        {team.name}
                      </td>
                      <td className="px-2 py-3 text-gray-500">18</td>
                      <td className="px-4 py-3 font-black text-[#3d195b]">{team.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-gray-50 text-center text-[10px] text-gray-400 font-medium">
                Full table at PremierLeague.com
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
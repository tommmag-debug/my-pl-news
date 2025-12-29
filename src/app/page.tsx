import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;

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
  // ... Legg til resten her
];

const NEWS_SOURCES = [
  { name: 'The Guardian', url: 'https://www.theguardian.com/football/premierleague/rss' },
  { name: 'Mirror Sport', url: 'https://www.mirror.co.uk/sport/football/rss.xml' },
  { name: 'Independent', url: 'https://www.independent.co.uk/sport/football/premier-league/rss' }
];

async function getNews() {
  const feeds = await Promise.all(
    NEWS_SOURCES.map(async (src) => {
      try {
        const res = await parser.parseURL(src.url);
        return res.items.map(i => ({ ...i, sourceName: src.name }));
      } catch (e) { return []; }
    })
  );
  return feeds.flat().sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()).slice(0, 20);
}

export default async function Page() {
  const articles = await getNews();
  
  const standings = [
    { rank: 1, team: 'Liverpool', played: 18, points: 46, logo: 't14' },
    { rank: 2, team: 'Arsenal', played: 18, points: 42, logo: 't3' },
    { rank: 3, team: 'Man City', played: 18, points: 40, logo: 't43' },
    { rank: 4, team: 'Chelsea', played: 18, points: 38, logo: 't8' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col md:flex-row font-sans">
      {/* SIDEBAR - Låst til venstre */}
      <aside className="w-full md:w-16 bg-[#3d195b] flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto sticky top-0 h-auto md:h-screen z-[60] p-1 shadow-xl">
        {CLUBS.map((club) => (
          <Link key={club.id} href={`/team/${club.id}`} className="flex-shrink-0 w-10 h-10 p-2 hover:bg-[#57287c] rounded transition-all group">
            <img src={club.logo} alt={club.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
          </Link>
        ))}
      </aside>

      <div className="flex-1 flex flex-col">
        {/* STICKY HEADER - Låst når du scroller */}
        <header className="sticky top-0 z-50 bg-[#3d195b] text-white p-4 md:px-10 flex items-center justify-between border-b border-[#00ff87]/20 shadow-lg backdrop-blur-md bg-opacity-95">
          <div className="flex items-center gap-4">
            <img src="https://resources.premierleague.com/premierleague/badges/rb/t3.svg" alt="PL" className="w-8 h-8 brightness-0 invert" />
            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Latest PL News</h1>
          </div>
          <div className="hidden md:block">
            <span className="text-[10px] font-black bg-[#00ff87] text-[#3d195b] px-3 py-1 rounded-full uppercase tracking-wider">Live Updates</span>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10 max-w-[1500px] mx-auto w-full">
          {/* NYHETER */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((item, i) => (
              <article key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 pt-8 pb-12 hover:border-[#3d195b] hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                  <a href={item.link} target="_blank" className="hover:text-[#3d195b]">
                    {item.title}
                  </a>
                </h2>
                
                {/* Kilde flyttet ned til høyre */}
                <div className="absolute bottom-4 right-4 text-[10px] font-black bg-gray-100 text-[#3d195b] px-2 py-1 rounded uppercase group-hover:bg-[#00ff87] transition-colors">
                  {item.sourceName}
                </div>
                
                <div className="mt-4">
                    <a href={item.link} target="_blank" className="text-xs font-black text-[#3d195b] border-b-2 border-[#00ff87]/30 hover:border-[#00ff87] pb-0.5 transition-all">
                        Full Story →
                    </a>
                </div>
              </article>
            ))}
          </div>

          {/* TABELL - Låst i siden når man scroller */}
          <aside className="w-full lg:w-72">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-[#3d195b] text-white px-4 py-3 font-black italic text-sm border-b border-[#00ff87]/20 flex justify-between">
                LEAGUE TABLE <span className="text-[#00ff87]">25/26</span>
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {standings.map(t => (
                    <tr key={t.rank} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-400 font-bold">{t.rank}</td>
                      <td className="p-3 flex items-center gap-2 font-bold text-gray-800">
                        <img src={`https://resources.premierleague.com/premierleague/badges/${t.logo}.svg`} className="w-4 h-4" alt=""/>
                        {t.team}
                      </td>
                      <td className="p-3 text-right font-black text-[#3d195b]">{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-gray-50 text-[9px] font-bold text-center text-gray-400 uppercase tracking-tighter">
                Click a team logo to see club news
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
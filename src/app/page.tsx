import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;

const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
});

// CLUBS-listen med interne ID-er
const CLUBS = [
  { id: 'man-utd', name: 'Man Utd', logo: 'https://resources.premierleague.com/premierleague/badges/t1.svg' },
  { id: 'arsenal', name: 'Arsenal', logo: 'https://resources.premierleague.com/premierleague/badges/t3.svg' },
  { id: 'liverpool', name: 'Liverpool', logo: 'https://resources.premierleague.com/premierleague/badges/t14.svg' },
  { id: 'man-city', name: 'Man City', logo: 'https://resources.premierleague.com/premierleague/badges/t43.svg' },
  { id: 'chelsea', name: 'Chelsea', logo: 'https://resources.premierleague.com/premierleague/badges/t8.svg' },
  { id: 'tottenham', name: 'Tottenham', logo: 'https://resources.premierleague.com/premierleague/badges/t6.svg' },
  { id: 'aston-villa', name: 'Aston Villa', logo: 'https://resources.premierleague.com/premierleague/badges/t7.svg' },
  { id: 'newcastle', name: 'Newcastle', logo: 'https://resources.premierleague.com/premierleague/badges/t4.svg' },
  // ... Legg til resten av de 20 lagene her med samme format
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
  
  // Tabell-data (per des 2025)
  const standings = [
    { rank: 1, team: 'Liverpool', played: 18, points: 46, logo: 't14' },
    { rank: 2, team: 'Arsenal', played: 18, points: 42, logo: 't3' },
    { rank: 3, team: 'Man City', played: 18, points: 40, logo: 't43' },
    { rank: 4, team: 'Chelsea', played: 18, points: 38, logo: 't8' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-16 bg-[#3d195b] flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto sticky top-0 h-auto md:h-screen z-50 p-1">
        {CLUBS.map((club) => (
          <Link key={club.id} href={`/team/${club.id}`} className="flex-shrink-0 w-10 h-10 p-2 hover:bg-[#57287c] rounded transition-all group" title={club.name}>
            <img src={club.logo} alt={club.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
          </Link>
        ))}
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        <header className="bg-[#3d195b] text-white p-6 md:p-10 flex items-center gap-6">
          <img src="https://resources.premierleague.com/premierleague/badges/rb/t3.svg" alt="PL" className="w-16 h-16 brightness-0 invert" />
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">My PL News</h1>
            <p className="text-[#00ff87] font-bold text-xs uppercase tracking-widest mt-2">Latest from UK: Guardian • Mirror • Independent</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10 max-w-[1500px] mx-auto w-full">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((item, i) => (
              <article key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <span className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase">{item.sourceName}</span>
                <h2 className="text-xl font-bold mt-3 mb-4 leading-tight">
                  <a href={item.link} target="_blank" className="hover:text-[#3d195b]">{item.title}</a>
                </h2>
                <a href={item.link} target="_blank" className="text-xs font-black text-[#3d195b] border-b-2 border-[#00ff87] pb-0.5">Full Story →</a>
              </article>
            ))}
          </div>

          <aside className="w-full lg:w-72">
            <div className="sticky top-10 bg-white rounded-2xl shadow-lg overflow-hidden border">
              <div className="bg-[#3d195b] text-white px-4 py-3 font-black italic text-sm">League Table</div>
              <table className="w-full text-xs">
                <tbody>
                  {standings.map(t => (
                    <tr key={t.rank} className="border-b">
                      <td className="p-3 text-gray-400 font-bold">{t.rank}</td>
                      <td className="p-3 flex items-center gap-2 font-bold"><img src={`https://resources.premierleague.com/premierleague/badges/${t.logo}.svg`} className="w-4 h-4"/>{t.team}</td>
                      <td className="p-3 text-right font-black text-[#3d195b]">{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
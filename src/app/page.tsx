import Parser from 'rss-parser';

const parser = new Parser();

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
];

async function getNews() {
  try {
    const feeds = await Promise.all(
      NEWS_SOURCES.map(async (src) => {
        const f = await parser.parseURL(src.url);
        return f.items.map(i => ({ ...i, sourceName: src.name }));
      })
    );
    return feeds.flat().sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()).slice(0, 21);
  } catch (e) { return []; }
}

export default async function Page() {
  const articles = await getNews();

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col md:flex-row">
      {/* SIDEBAR / LOGOMENY */}
      <aside className="w-full md:w-20 lg:w-24 bg-white border-r border-gray-200 p-2 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto sticky top-0 h-auto md:h-screen z-50 shadow-sm">
        {CLUBS.map((club) => (
          <a 
            key={club.name} 
            href={club.url} 
            target="_blank" 
            rel="noopener noreferrer"
            title={club.name}
            className="flex-shrink-0 w-12 h-12 md:w-full md:h-auto p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <img src={club.logo} alt={club.name} className="w-full h-auto grayscale group-hover:grayscale-0 transition-all" />
          </a>
        ))}
      </aside>

      {/* HOVEDINNHOLD */}
      <main className="flex-1">
        <header className="bg-[#3d195b] text-white p-8 md:p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">My PL News</h1>
            <div className="h-1 w-24 bg-[#00ff87] mt-4"></div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((item, i) => (
              <article key={i} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold bg-[#3d195b] text-white px-2 py-0.5 rounded uppercase">{item.sourceName}</span>
                  </div>
                  <h2 className="text-lg font-bold leading-tight mb-3 text-gray-900">
                    <a href={item.link} target="_blank" className="hover:text-blue-700">{item.title}</a>
                  </h2>
                  <p className="text-gray-500 text-xs line-clamp-3 mb-4">
                    {item.contentSnippet || item.content?.replace(/<[^>]*>?/gm, '')}
                  </p>
                </div>
                <div className="p-5 pt-0 mt-auto">
                  <a href={item.link} target="_blank" className="text-xs font-bold text-[#3d195b] border-b-2 border-[#00ff87] pb-1">
                    READ STORY →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
}
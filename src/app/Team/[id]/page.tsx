import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;
const parser = new Parser({ 
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' } 
});

const TEAM_CONFIG: { [key: string]: { name: string, color: string, logo: string, feed: string } } = {
  'man-utd': { 
    name: 'Manchester United', 
    color: '#DA291C', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t1.svg',
    feed: 'https://www.theguardian.com/football/manchester-united/rss'
  },
  'arsenal': { 
    name: 'Arsenal', 
    color: '#EF0107', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t3.svg',
    feed: 'https://www.theguardian.com/football/arsenal/rss' 
  },
  'liverpool': { 
    name: 'Liverpool', 
    color: '#C8102E', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t14.svg',
    feed: 'https://www.theguardian.com/football/liverpool/rss'
  }
};

interface NewsItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  pubDate?: string;
}

export default async function TeamPage(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = await props.params;
  const id = resolvedParams.id;
  
  const config = TEAM_CONFIG[id] || { 
    name: id.replace(/-/g, ' '), 
    color: '#3d195b', 
    logo: 'https://resources.premierleague.com/premierleague/badges/rb/t3.svg',
    feed: `https://www.theguardian.com/football/${id}/rss`
  };

  let news: NewsItem[] = [];
  try {
    const res = await parser.parseURL(config.feed);
    news = (res.items as NewsItem[]) || [];
  } catch (e) {
    news = [];
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* STICKY HEADER - MATCHET MED FORSIDEN */}
      <header style={{ backgroundColor: config.color }} className="sticky top-0 z-50 text-white p-4 flex items-center justify-between border-b border-white/10 shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-full">
            <img src={config.logo} alt="" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
            {config.name}
          </h1>
        </div>
        <Link href="/" className="text-[10px] font-black bg-white/20 hover:bg-white text-white hover:text-[#3d195b] px-4 py-1.5 rounded-full uppercase transition-all">
          ← All News
        </Link>
      </header>

      <main className="max-w-[1500px] mx-auto p-6 lg:p-10 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.length > 0 ? (
            news.map((item, i) => (
              /* ARTIKKEL-BOKS - IDENTISK MED FORSIDEN */
              <article key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 pt-8 pb-12 hover:border-[#3d195b] hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
                <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                    {item.title}
                  </a>
                </h2>

                {/* KILDE/DATO - IDENTISK PLASSERING NEDE TIL HØYRE */}
                <div className="absolute bottom-4 right-4 text-[10px] font-black bg-gray-100 text-[#3d195b] px-2 py-1 rounded uppercase group-hover:bg-[#00ff87] transition-colors">
                    {item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-GB') : 'UK FEED'}
                </div>

                <div className="mt-4">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-black text-[#3d195b] border-b-2 border-[#00ff87]/30 hover:border-[#00ff87] pb-0.5 transition-all"
                  >
                    Full Story →
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 font-bold">Connecting to {config.name} feed...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
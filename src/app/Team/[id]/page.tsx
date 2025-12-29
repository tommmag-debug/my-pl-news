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
  },
  'man-city': { 
    name: 'Manchester City', 
    color: '#6CABDD', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t43.svg',
    feed: 'https://www.theguardian.com/football/manchester-city/rss'
  },
  'chelsea': { 
    name: 'Chelsea', 
    color: '#034694', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t8.svg',
    feed: 'https://www.theguardian.com/football/chelsea/rss'
  },
  'tottenham': { 
    name: 'Tottenham', 
    color: '#132257', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t6.svg',
    feed: 'https://www.theguardian.com/football/tottenham-hotspur/rss'
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
      {/* STICKY TEAM HEADER */}
      <header style={{ backgroundColor: config.color }} className="sticky top-0 z-50 text-white p-4 shadow-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-full shadow-md">
                <img src={config.logo} alt={config.name} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            </div>
            <h1 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">
                {config.name}
            </h1>
          </div>
          <Link href="/" className="bg-white/20 hover:bg-white/40 text-white px-4 py-1.5 rounded-full font-bold uppercase text-[10px] backdrop-blur-sm border border-white/30 transition-all">
            ← Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.length > 0 ? (
            news.map((item, i) => (
              <article key={i} className="relative bg-white p-6 pt-8 pb-12 rounded-xl shadow-sm border border-gray-200 hover:border-[#3d195b] hover:shadow-xl transition-all duration-200 group flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    </h2>
                    <p className="text-gray-500 text-sm mt-4 line-clamp-2 leading-relaxed italic">{item.contentSnippet}</p>
                </div>

                {/* Dato/Kilde flyttet ned til høyre */}
                <div className="absolute bottom-4 right-4 text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase group-hover:bg-[#00ff87] group-hover:text-[#3d195b] transition-colors">
                    {item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-GB') : 'Recent News'}
                </div>

                <div className="mt-6">
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: config.color }}
                    className="text-[10px] font-black uppercase border-b-2 border-transparent hover:border-current pb-0.5 transition-all"
                  >
                    Read full story →
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic font-medium">Updating club news for {config.name}...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
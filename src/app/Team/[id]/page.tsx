import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;
const parser = new Parser({ 
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' } 
});

const TEAM_CONFIG: { [key: string]: { name: string, color: string, logo: string, feed: string, sourceName: string } } = {
  'man-utd': { 
    name: 'Manchester United', 
    color: '#DA291C', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t1.svg',
    feed: 'https://www.theguardian.com/football/manchester-united/rss',
    sourceName: 'The Guardian'
  },
  'arsenal': { 
    name: 'Arsenal', 
    color: '#EF0107', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t3.svg',
    feed: 'https://www.theguardian.com/football/arsenal/rss',
    sourceName: 'The Guardian'
  },
  'liverpool': { 
    name: 'Liverpool', 
    color: '#C8102E', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t14.svg',
    feed: 'https://www.theguardian.com/football/liverpool/rss',
    sourceName: 'The Guardian'
  },
  'man-city': { 
    name: 'Manchester City', 
    color: '#6CABDD', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t43.svg',
    feed: 'https://www.theguardian.com/football/manchester-city/rss',
    sourceName: 'The Guardian'
  },
  'chelsea': { 
    name: 'Chelsea', 
    color: '#034694', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t8.svg',
    feed: 'https://www.theguardian.com/football/chelsea/rss',
    sourceName: 'The Guardian'
  },
  'tottenham': { 
    name: 'Tottenham', 
    color: '#132257', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t6.svg',
    feed: 'https://www.theguardian.com/football/tottenham-hotspur/rss',
    sourceName: 'The Guardian'
  }
};

interface NewsItem { 
  title?: string; 
  link?: string; 
  contentSnippet?: string; 
  content?: string; // Fikset: TypeScript kjenner nå denne
  pubDate?: string; 
  sourceName?: string; 
}

export default async function TeamPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  
  const config = TEAM_CONFIG[id] || { 
    name: id.replace(/-/g, ' '), 
    color: '#3d195b', 
    logo: 'https://resources.premierleague.com/premierleague/badges/rb/t3.svg',
    feed: `https://www.theguardian.com/football/${id}/rss`,
    sourceName: 'The Guardian'
  };

  let news: NewsItem[] = [];
  try {
    const res = await parser.parseURL(config.feed);
    news = (res.items as NewsItem[]).map(item => ({
      ...item,
      sourceName: config.sourceName
    }));
  } catch (e) { 
    news = []; 
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      {/* STICKY TEAM HEADER */}
      <header style={{ backgroundColor: config.color }} className="sticky top-0 z-50 text-white p-4 flex items-center justify-between shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-full border border-white/20 shadow-sm">
            <img src={config.logo} alt="" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
            {config.name}
          </h1>
        </div>
        <Link href="/" className="text-[10px] font-black bg-white/20 hover:bg-white hover:text-black px-4 py-1.5 rounded-full uppercase transition-all border border-white/30">
          ← All News
        </Link>
      </header>

      <main className="max-w-[1500px] mx-auto p-6 lg:p-10 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, i) => (
            <article key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 pt-8 pb-14 hover:border-[#3d195b] hover:shadow-xl transition-all duration-200 group flex flex-col">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
              </h2>
              
              <p className="text-gray-500 text-sm line-clamp-3 mb-6 group-hover:text-gray-800 transition-colors italic leading-relaxed">
                {item.contentSnippet || (item.content ? item.content.replace(/<[^>]*>?/gm, '') : '')}
              </p>

              {/* Dato nede til venstre */}
              <div className="absolute bottom-4 left-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">
                {item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-GB') : 'RECENT'}
              </div>

              {/* Kilde nede til høyre */}
              <div className="absolute bottom-4 right-6 text-[10px] font-black bg-gray-100 text-[#3d195b] px-2 py-1 rounded uppercase group-hover:bg-[#00ff87] transition-colors">
                {item.sourceName}
              </div>
            </article>
          ))}
          
          {news.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-400 font-bold">Connecting to {config.name} feed...</p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-10 text-center text-gray-400 text-[10px] uppercase tracking-widest font-bold">
        Data aggregated for My PL News • {config.name} Edition
      </footer>
    </div>
  );
}
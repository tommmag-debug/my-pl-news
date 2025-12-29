import React from 'react';

// Kilder lagret i dine preferanser:
// 1. NewsAPI: https://newsapi.org/
// 2. NRK RSS (Hentet via aggregator): https://www.nrk.no/rss/

async function getNews() {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?country=no&apiKey=${process.env.NEWS_API_KEY}`,
    { next: { revalidate: 3600 } } // Autogenererer nye nyheter hver time
  );
  if (!res.ok) return { articles: [] };
  return res.json();
}

export default async function Page() {
  const data = await getNews();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-blue-900 mb-2 uppercase tracking-tighter">My PL News</h1>
        <p className="text-gray-600 mb-8 border-b pb-4 text-sm font-medium">Auto-oppdaterte nyheter fra Norge</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.articles?.map((post: any, i: number) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-4">
              <p className="text-xs font-bold text-red-600 mb-2 uppercase">{post.source.name}</p>
              <h2 className="text-lg font-bold leading-tight mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.description}</p>
              <a href={post.url} target="_blank" className="text-blue-600 font-bold text-sm hover:underline">Les mer hos kilden →</a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
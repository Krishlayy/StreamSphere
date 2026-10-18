import React, { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';

const CATEGORIES = [
  'All',
  'Technology',
  'Coding',
  'Gaming',
  'Education',
  'Music',
  'Entertainment',
  'News',
];

// Fallback seed videos for initial preview
const SEED_VIDEOS = [
  {
    _id: 'seed-1',
    title: 'Building a Full-Stack Video Streaming Service with Node.js and React',
    description: 'Learn how to stream videos chunk by chunk with HTTP 206 Partial Content headers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=640&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '09:56',
    views: 14250,
    category: 'Coding',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    uploader: {
      username: 'AntigravityDev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    },
  },
  {
    _id: 'seed-2',
    title: 'Scalable Microservices Architecture: Node.js, Express & MongoDB',
    description: 'Deep dive into asynchronous event-driven design and JWT-based authentication.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=640&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '14:20',
    views: 38900,
    category: 'Technology',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    uploader: {
      username: 'FullStackForge',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
    },
  },
  {
    _id: 'seed-3',
    title: 'Next-Gen UI Systems: Vite, React 18, and Tailwind CSS Mastery',
    description: 'Creating sleek dark-mode glassmorphic interfaces and custom HTML5 video controls.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=640&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '06:45',
    views: 8200,
    category: 'Coding',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    uploader: {
      username: 'CodeCraft',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
  },
  {
    _id: 'seed-4',
    title: 'Industrial IoT & Sensor Telemetry with ESP32 & MQTT',
    description: 'Connecting distributed sensor nodes to cloud dashboards with real-time alerting.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '11:12',
    views: 22100,
    category: 'Technology',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    uploader: {
      username: 'IoTEdgeLab',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
  },
];

export default function Home({ onSelectVideo, searchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory, searchQuery]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      let url = '/api/videos?';
      if (selectedCategory !== 'All') url += `category=${selectedCategory}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setVideos(data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      // Backend not running or offline, use seed videos
    }

    // Filter seed videos as fallback
    let filtered = SEED_VIDEOS;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((v) => v.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setVideos(filtered);
    setLoading(false);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-white text-black'
                : 'bg-[#222222] hover:bg-[#2e2e2e] text-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-video bg-[#202020] rounded-2xl" />
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-[#202020]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#202020] rounded w-5/6" />
                  <div className="h-3 bg-[#202020] rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No videos found.</p>
          <p className="text-sm mt-1">Try another category or clear your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onSelect={onSelectVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

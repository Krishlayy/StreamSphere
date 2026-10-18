import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function VideoCard({ video, onSelect }) {
  const formatViews = (views = 0) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const [key, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count >= 1) return `${count} ${key}${count > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };

  return (
    <div
      onClick={() => onSelect(video)}
      className="flex flex-col gap-3 cursor-pointer group"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1c1c1c] border border-[#252525]">
        <img
          src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=640&q=80'}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-black/85 text-white text-xs font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
          {video.duration || '03:45'}
        </div>
      </div>

      {/* Video Metadata */}
      <div className="flex gap-3 px-0.5">
        <img
          src={video.uploader?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
          alt={video.uploader?.username || 'Channel'}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-[#333]"
        />
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-brand-500 transition">
            {video.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
            <span>{video.uploader?.username || 'StreamSphere Creator'}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 fill-gray-500" />
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            <span>{formatViews(video.views)} views</span>
            <span className="mx-1">•</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

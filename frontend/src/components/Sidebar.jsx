import React from 'react';
import { Home, Flame, Compass, FolderHeart, History, Clock, ThumbsUp, Radio } from 'lucide-react';

export default function Sidebar({ isOpen, activeTab, onSelectTab }) {
  const primaryLinks = [
    { id: 'Home', label: 'Home', icon: Home },
    { id: 'Trending', label: 'Trending', icon: Flame },
    { id: 'Explore', label: 'Explore', icon: Compass },
    { id: 'Live', label: 'Live Streams', icon: Radio },
  ];

  const libraryLinks = [
    { id: 'Library', label: 'Library', icon: FolderHeart },
    { id: 'History', label: 'History', icon: History },
    { id: 'WatchLater', label: 'Watch Later', icon: Clock },
    { id: 'Liked', label: 'Liked Videos', icon: ThumbsUp },
  ];

  return (
    <aside
      className={`fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] bg-[#0f0f0f] border-r border-[#222] transition-all duration-300 z-30 overflow-y-auto ${
        isOpen ? 'w-60 px-3 py-4' : 'w-0 lg:w-20 px-1 py-4 overflow-hidden'
      }`}
    >
      <div className="space-y-1">
        {primaryLinks.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-[#282828] text-white font-semibold'
                  : 'text-gray-300 hover:bg-[#202020] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-gray-400'}`} />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {isOpen && <hr className="my-4 border-[#222]" />}

      {isOpen && (
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            You
          </p>
          {libraryLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#282828] text-white'
                    : 'text-gray-300 hover:bg-[#202020] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 text-gray-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && (
        <div className="mt-8 px-3 text-xs text-gray-500 leading-relaxed border-t border-[#222] pt-4">
          <p>© 2026 StreamSphere</p>
          <p className="text-[11px] text-gray-600 mt-1">Built with MERN Stack</p>
        </div>
      )}
    </aside>
  );
}

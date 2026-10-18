import React, { useState } from 'react';
import { Search, Video, Bell, User, LogOut, Menu, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSearch, onOpenUpload, onToggleSidebar }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated, logout, setIsAuthModalOpen } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f0f0f] border-b border-[#222] px-4 py-2.5 flex items-center justify-between">
      {/* Brand & Menu Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-[#282828] text-gray-300"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white flex items-center">
            Stream<span className="text-brand-500">Sphere</span>
          </span>
        </div>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-xl mx-4 hidden md:flex items-center">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            placeholder="Search videos, tutorials, creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121212] border border-[#303030] focus:border-brand-500 rounded-l-full py-2 px-4 pl-4 text-sm text-gray-200 outline-none transition"
          />
          <button
            type="submit"
            className="bg-[#222222] hover:bg-[#282828] border border-l-0 border-[#303030] rounded-r-full px-6 py-2 text-gray-400 hover:text-white transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 bg-[#222] hover:bg-[#282828] border border-[#333] text-sm font-medium py-1.5 px-3.5 rounded-full transition"
            >
              <Video className="w-4 h-4 text-brand-500" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <button className="p-2 text-gray-300 hover:bg-[#222] rounded-full hidden sm:block">
              <Bell className="w-5 h-5" />
            </button>
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.username}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-brand-500/50 object-cover"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#202020] border border-[#303030] rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#303030]">
                    <p className="text-sm font-medium text-white">{user.username}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#282828] flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white px-4 py-1.5 rounded-full text-sm font-semibold transition"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}

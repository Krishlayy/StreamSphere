import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import UploadModal from './components/UploadModal';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';

function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  const handleSelectVideo = (video) => {
    setCurrentVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentVideo(null); // return to home to view search results
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex flex-col">
      <Navbar
        onSearch={handleSearch}
        onOpenUpload={() => setIsUploadOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1">
        {!currentVideo && (
          <Sidebar
            isOpen={sidebarOpen}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setCurrentVideo(null);
            }}
          />
        )}

        <main className="flex-1 overflow-x-hidden">
          {currentVideo ? (
            <Watch video={currentVideo} onSelectVideo={handleSelectVideo} />
          ) : (
            <Home onSelectVideo={handleSelectVideo} searchQuery={searchQuery} />
          )}
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(newVid) => {
          handleSelectVideo(newVid);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

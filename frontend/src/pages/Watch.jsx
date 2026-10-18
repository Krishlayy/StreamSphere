import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import VideoCard from '../components/VideoCard';
import { ThumbsUp, ThumbsDown, Share2, Bell, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Watch({ video, onSelectVideo }) {
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const [likes, setLikes] = useState(video.likes?.length || 420);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState(video.comments || [
    {
      _id: 'c1',
      username: 'CodeNinja_99',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      text: 'The HTTP 206 byte-range streaming explanation is crystal clear! Outstanding architecture.',
      createdAt: '2 hours ago',
    },
    {
      _id: 'c2',
      username: 'DevSarah',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      text: 'Super clean UI and the custom player controls feel native and smooth. Great job on the MERN stack integration.',
      createdAt: '5 hours ago',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!newComment.trim()) return;

    const commentObj = {
      _id: 'c_' + Date.now(),
      username: user.username,
      avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      text: newComment.trim(),
      createdAt: 'Just now',
    };

    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  // Video source: check if stream route or static sample
  const streamSrc = video.videoUrl?.startsWith('http')
    ? video.videoUrl
    : `/api/videos/stream/${video._id}`;

  return (
    <div className="max-w-[1700px] mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Primary Video Column */}
      <div className="xl:col-span-2 space-y-4">
        <VideoPlayer videoSrc={streamSrc} poster={video.thumbnailUrl} />

        {/* Video Title */}
        <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">
          {video.title}
        </h1>

        {/* Action Bar & Channel Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#252525]">
          <div className="flex items-center gap-3">
            <img
              src={video.uploader?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={video.uploader?.username || 'Channel'}
              className="w-10 h-10 rounded-full object-cover border border-[#333]"
            />
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <span>{video.uploader?.username || 'StreamSphere Creator'}</span>
                <CheckCircle2 className="w-4 h-4 text-brand-500 fill-brand-500" />
              </div>
              <p className="text-xs text-gray-400">128K subscribers</p>
            </div>
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`ml-4 px-4 py-2 rounded-full text-xs font-semibold transition ${
                isSubscribed
                  ? 'bg-[#282828] text-white hover:bg-[#333]'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#222] rounded-full overflow-hidden border border-[#303030]">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium hover:bg-[#2e2e2e] transition ${
                  hasLiked ? 'text-brand-500' : 'text-gray-200'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>
              <div className="w-[1px] h-5 bg-[#303030]" />
              <button className="px-3 py-2 text-gray-300 hover:bg-[#2e2e2e] transition">
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            <button className="flex items-center gap-2 bg-[#222] hover:bg-[#2e2e2e] border border-[#303030] px-4 py-2 rounded-full text-xs font-medium text-gray-200 transition">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Video Description Card */}
        <div className="bg-[#1c1c1c] border border-[#282828] rounded-2xl p-4 text-sm leading-relaxed text-gray-300">
          <div className="flex items-center gap-3 font-semibold text-white mb-2">
            <span>{video.views?.toLocaleString() || 14200} views</span>
            <span>Category: {video.category || 'Technology'}</span>
          </div>
          <p>{video.description || 'Welcome to StreamSphere! This video demonstrates HTTP 206 partial range video delivery.'}</p>
        </div>

        {/* Comments Section */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <MessageSquare className="w-5 h-5 text-brand-500" />
            <span>{comments.length} Comments</span>
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder={isAuthenticated ? "Add a public comment..." : "Sign in to join the conversation..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-[#151515] border border-[#2e2e2e] focus:border-brand-500 rounded-xl px-4 py-2 text-sm text-white outline-none"
              />
              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white p-2.5 rounded-xl transition"
                title="Send comment"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-4 pt-2">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-3">
                <img
                  src={c.avatar}
                  alt={c.username}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">@{c.username}</span>
                    <span className="text-[11px] text-gray-500">{c.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-300">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Videos Sidebar */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-white">Recommended Streams</h3>
        <div className="space-y-4">
          {[
            {
              _id: 'rec-1',
              title: 'Mastering Full-Stack MERN Architecture in 2026',
              uploader: { username: 'MERNMaster' },
              views: 92000,
              duration: '18:32',
              createdAt: '1 day ago',
              thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640',
            },
            {
              _id: 'rec-2',
              title: 'High-Concurrency Video Streaming & CDN Optimization',
              uploader: { username: 'DistributedSystems' },
              views: 45000,
              duration: '12:15',
              createdAt: '3 days ago',
              thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640',
            },
            {
              _id: 'rec-3',
              title: 'JWT Authentication & Refresh Token Security Patterns',
              uploader: { username: 'SecDev' },
              views: 61000,
              duration: '08:44',
              createdAt: '5 days ago',
              thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640',
            },
          ].map((rec) => (
            <VideoCard key={rec._id} video={rec} onSelect={onSelectVideo} />
          ))}
        </div>
      </div>
    </div>
  );
}

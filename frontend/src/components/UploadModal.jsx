import React, { useState } from 'react';
import { X, Upload, Film, Image, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [tags, setTags] = useState('coding, webdev, react');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !title) {
      setError('Please select a video file and enter a title.');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('video', videoFile);
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    try {
      const res = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload video');
      }

      const uploaded = await res.json();
      setIsUploading(false);
      if (onUploadSuccess) onUploadSuccess(uploaded);
      onClose();
    } catch (err) {
      setIsUploading(false);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#2e2e2e]"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-brand-500" />
          Upload New Video
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Video Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Building a Scalable Streaming Service with MERN"
              className="w-full bg-[#121212] border border-[#333] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers what your video is about..."
              className="w-full bg-[#121212] border border-[#333] focus:border-brand-500 rounded-xl px-3.5 py-2 text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#121212] border border-[#333] focus:border-brand-500 rounded-xl px-3 py-2 text-sm text-white outline-none"
              >
                <option value="Technology">Technology</option>
                <option value="Coding">Coding</option>
                <option value="Gaming">Gaming</option>
                <option value="Education">Education</option>
                <option value="Music">Music</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-[#121212] border border-[#333] focus:border-brand-500 rounded-xl px-3 py-2 text-sm text-white outline-none"
              />
            </div>
          </div>

          {/* Video file picker */}
          <div className="border border-dashed border-[#444] rounded-xl p-4 text-center hover:border-brand-500 transition cursor-pointer">
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
            <label htmlFor="video-upload" className="cursor-pointer block">
              <Film className="w-8 h-8 text-brand-500 mx-auto mb-1.5" />
              <span className="text-sm font-medium text-white block">
                {videoFile ? videoFile.name : 'Choose Video File (MP4, MKV, WebM)'}
              </span>
              <span className="text-xs text-gray-400">Max size up to 100MB</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-[#282828] rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish Video</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

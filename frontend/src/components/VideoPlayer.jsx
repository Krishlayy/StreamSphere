import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, PictureInPicture, Gauge } from 'lucide-react';

export default function VideoPlayer({ videoSrc, poster, onToggleTheater, isTheater }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  let controlTimer = null;

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
  }, [videoSrc]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    if (total) {
      setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("PiP not supported or failed:", err);
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative group w-full">
      {/* Ambient Cinema Backdrop Glow */}
      <div className="ambient-backdrop opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>

      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-violet-900/30">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
          playsInline
        />

        {/* Center Big Play Button Overlay on Pause */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-violet-600/90 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/50 hover:scale-110 transition-transform">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Bottom Custom Playback Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Seek Scrubber */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 hover:h-2 accent-violet-500 rounded-lg cursor-pointer transition-all mb-3"
          />

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-violet-400 transition">
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="hover:text-violet-400 transition">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/20 accent-violet-400 rounded cursor-pointer"
                />
              </div>

              <span className="font-mono text-[11px] text-gray-300">
                {formatTime(videoRef.current?.currentTime)} / {formatTime(videoRef.current?.duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Speed Dropdown */}
              <div className="flex items-center gap-1 font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded">
                <Gauge className="w-3.5 h-3.5 text-violet-400" />
                {[1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-1 rounded ${playbackRate === s ? 'text-violet-400 font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* PiP */}
              <button onClick={togglePiP} title="Picture in Picture" className="hover:text-violet-400 transition">
                <PictureInPicture className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button onClick={toggleFullScreen} title="Fullscreen" className="hover:text-violet-400 transition">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

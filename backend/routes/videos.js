const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Video = require('../models/Video');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Multer storage config for video and thumbnail uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      const dir = path.join(__dirname, '../uploads/videos');
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    } else {
      const dir = path.join(__dirname, '../uploads/thumbnails');
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB max for demonstration
});

// ==========================================
// 1. HTTP 206 Byte-Range Video Streaming Engine
// ==========================================
router.get('/stream/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video record not found.' });
    }

    const videoPath = path.resolve(video.videoUrl);
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: 'Video media file missing on disk.' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Parse Range header e.g. "bytes=32324-" or "bytes=0-1000"
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        res.status(416).set({
          'Content-Range': `bytes */${fileSize}`,
        });
        return res.end();
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(videoPath, { start, end });

      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, headers);
      fileStream.pipe(res);
    } else {
      // Fallback for full download without range
      const headers = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      };
      res.writeHead(200, headers);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. Upload Video
// ==========================================
router.post(
  '/upload',
  verifyToken,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category, tags, duration } = req.body;
      if (!title || !req.files || !req.files.video) {
        return res.status(400).json({ error: 'Title and video file are required.' });
      }

      const videoFile = req.files.video[0];
      const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

      const newVideo = new Video({
        title,
        description: description || '',
        category: category || 'Technology',
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
        duration: duration || '04:12',
        videoUrl: videoFile.path,
        thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : undefined,
        uploader: req.user.id,
      });

      const savedVideo = await newVideo.save();
      res.status(201).json(savedVideo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ==========================================
// 3. List All Videos (Search, Category & Trending)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const sortOption = sort === 'trending' ? { views: -1 } : { createdAt: -1 };

    const videos = await Video.find(filter)
      .populate('uploader', 'username avatar subscribers')
      .sort(sortOption)
      .limit(40);

    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. Get Video By ID (Increment View Counter)
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploader', 'username avatar subscribers');

    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. Like / Unlike Video
// ==========================================
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found.' });

    const userId = req.user.id;
    const hasLiked = video.likes.includes(userId);

    if (hasLiked) {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.likes.push(userId);
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    }

    await video.save();
    res.status(200).json({ likes: video.likes.length, dislikes: video.dislikes.length, hasLiked: !hasLiked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. Add Comment
// ==========================================
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Comment text cannot be empty.' });
    }

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found.' });

    const comment = {
      userId: req.user.id,
      username: req.user.username,
      avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      text: text.trim(),
    };

    video.comments.unshift(comment);
    await video.save();

    res.status(201).json(video.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

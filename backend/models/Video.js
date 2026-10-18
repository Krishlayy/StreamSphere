const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=640&q=80',
    },
    duration: {
      type: String,
      default: '03:45',
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'Technology',
      enum: ['Technology', 'Gaming', 'Music', 'Education', 'Entertainment', 'Coding', 'News'],
    },
    tags: {
      type: [String],
      default: [],
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    dislikes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', VideoSchema);

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [1000, 'Content cannot be more than 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Ensure virtual fields are serialized
postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
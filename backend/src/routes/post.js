const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validatePost, validateComment } = require('../middleware/validation');
const Post = require('../models/Post');
const Community = require('../models/Community');
const Notification = require('../models/Notification');

// Create new post
router.post('/', auth, validatePost, async (req, res) => {
  try {
    const { title, content, communityId, tags } = req.body;

    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if user is member of community
    if (!community.members.includes(req.user._id)) {
      return res.status(403).json({ error: 'Must be a member to post' });
    }

    const post = new Post({
      title,
      content,
      author: req.user._id,
      community: communityId,
      tags
    });

    await post.save();

    // Notify community members
    const notification = new Notification({
      recipient: community.members[0], // Notify first member
      type: 'new_post',
      sender: req.user._id,
      content: `New post in ${community.name}: ${title}`,
      data: { postId: post._id, communityId },
      priority: 'normal',
      channels: ['in_app']
    });

    await notification.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { community, author, tag, sort = 'createdAt' } = req.query;
    const query = {};

    if (community) query.community = community;
    if (author) query.author = author;
    if (tag) query.tags = tag;

    const posts = await Post.find(query)
      .populate('author', 'name')
      .populate('community', 'name')
      .sort({ [sort]: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')
      .populate('community', 'name')
      .populate('comments.author', 'name');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
});

// Update post
router.put('/:id', auth, validatePost, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update post' });
    }

    const { title, content, tags } = req.body;
    post.title = title;
    post.content = content;
    post.tags = tags;
    post.edited = true;
    post.editedAt = new Date();

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is author or community moderator
    const community = await Community.findById(post.community);
    const isModerator = community.moderators.includes(req.user._id);
    
    if (post.author.toString() !== req.user._id.toString() && !isModerator) {
      return res.status(403).json({ error: 'Not authorized to delete post' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

// Like/Unlike post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    
    if (likeIndex === -1) {
      // Like post
      post.likes.push(req.user._id);
      
      // Notify author
      if (post.author.toString() !== req.user._id.toString()) {
        const notification = new Notification({
          recipient: post.author,
          type: 'post_like',
          sender: req.user._id,
          content: `${req.user.name} liked your post: ${post.title}`,
          data: { postId: post._id },
          priority: 'normal',
          channels: ['in_app']
        });

        await notification.save();
      }
    } else {
      // Unlike post
      post.likes.splice(likeIndex, 1);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error updating like status' });
  }
});

// Add comment
router.post('/:id/comments', auth, validateComment, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { content } = req.body;
    const comment = {
      content,
      author: req.user._id
    };

    post.comments.push(comment);
    await post.save();

    // Notify post author
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        recipient: post.author,
        type: 'post_comment',
        sender: req.user._id,
        content: `${req.user.name} commented on your post: ${post.title}`,
        data: { postId: post._id, commentId: post.comments[post.comments.length - 1]._id },
        priority: 'normal',
        channels: ['in_app']
      });

      await notification.save();
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

// Update comment
router.put('/:postId/comments/:commentId', auth, validateComment, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is comment author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update comment' });
    }

    comment.content = req.body.content;
    comment.edited = true;
    comment.editedAt = new Date();

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error updating comment' });
  }
});

// Delete comment
router.delete('/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is comment author or post author
    if (comment.author.toString() !== req.user._id.toString() && 
        post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete comment' });
    }

    comment.remove();
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

module.exports = router; 
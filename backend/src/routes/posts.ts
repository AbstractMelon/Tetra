import express from "express";
import { auth } from "../middleware/auth";
import Post from "../models/Post";
import Community from "../models/Community";

const router = express.Router();

// Get all posts
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "username avatar")
      .populate("community", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Create post
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, communityId } = req.body;

    // Verify community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const post = new Post({
      title,
      content,
      author: req.user?.userId,
      community: communityId,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("community", "name");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});

// Get post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("community", "name")
      .populate("comments.author", "username avatar");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Update post
router.patch("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user?.userId,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    const { title, content } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("community", "name");

    res.json(updatedPost);
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user?.userId,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Vote on post
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { vote } = req.body; // 1 for upvote, -1 for downvote

    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({ message: "Invalid vote value" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find existing vote
    const existingVoteIndex = post.voters.findIndex(
      (v) => v.user.toString() === req.user?.userId
    );

    if (existingVoteIndex > -1) {
      // Remove old vote
      const oldVote = post.voters[existingVoteIndex].vote;
      post.votes -= oldVote;
      post.voters.splice(existingVoteIndex, 1);

      // Add new vote if different
      if (oldVote !== vote) {
        post.voters.push({ user: req.user?.userId, vote });
        post.votes += vote;
      }
    } else {
      // Add new vote
      post.voters.push({ user: req.user?.userId, vote });
      post.votes += vote;
    }

    await post.save();
    res.json({ votes: post.votes });
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ message: "Error processing vote" });
  }
});

// Add comment
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      author: req.user?.userId,
      content,
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("community", "name")
      .populate("comments.author", "username avatar");

    res.status(201).json(updatedPost);
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
});

export default router;

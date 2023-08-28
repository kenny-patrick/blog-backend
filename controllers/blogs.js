const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    name: 1,
    username: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    response.status(400).end();
  } else {
    if (!body.likes) {
      body.likes = 0;
    }
    if (!request.user) {
      return response.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(request.user);

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  if (blog.user.toString() === request.user) {
    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  } else {
    return response.status(401).json({ error: "token invalid" });
  }
});

blogsRouter.put("/:id", userExtractor, async (request, response) => {
  const body = request.body;

  const user = User.findById(request.user);

  const blog = {
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url,
    user: user.id,
  };

  const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(200).json(savedBlog);
});

module.exports = blogsRouter;

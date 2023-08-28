const lodash = require("lodash");
const logger = require("./logger");

const dummy = (blogs) => {
  logger.info(`Running dummy with blogs: ${blogs}`);
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((accumulator, currentBlog) => {
    return accumulator + currentBlog.likes;
  }, 0);
};

const simplifyFavoriteBlogs = (blogs) => {
  return blogs.map((blog) => {
    return {
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    };
  });
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const simplifiedBlogs = simplifyFavoriteBlogs(blogs);
  return simplifiedBlogs.reduce(
    (accumulator, currentBlog) => {
      if (currentBlog.likes > accumulator.likes) {
        return currentBlog;
      }
      return accumulator;
    },
    { likes: -Infinity },
  );
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const groupedByAuthor = lodash.groupBy(blogs, "author");
  const longestGroup = lodash.maxBy(
    Object.values(groupedByAuthor),
    (group) => group.length,
  );
  console.log(longestGroup);
  return {
    author: longestGroup[0].author,
    blogs: longestGroup.length,
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const groupedByAuthor = lodash.groupBy(blogs, "author");
  const likesByAuthor = lodash.mapValues(groupedByAuthor, (group) => {
    return lodash.sumBy(group, "likes");
  });
  const mostLikedAuthor = lodash.maxBy(
    lodash.toPairs(likesByAuthor),
    (pair) => pair[1],
  );

  return {
    author: mostLikedAuthor[0],
    likes: mostLikedAuthor[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

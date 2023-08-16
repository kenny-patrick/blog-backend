const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listWithMultipleBlogs } = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has one blog equals the likes of the single blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(1)
  })

  test('when list has multiple blogs equals the total likes from each blog', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('when list is empty equals an empty object', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('when list has one blog equals the single blog in an object with only title, author and likes attributes', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Single blog in list',
      author: 'Loner McLonely',
      likes: 1
    })
  })

  test('when list has multiple blogs equals the simplified blog object with the highest likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('most blogs', () => {
  test('when list is empty equals an empty objects', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test('when list has one blog equals an object with the author and a blogs property with a value of 1', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      author: 'Loner McLonely',
      blogs: 1
    })
  })

  test('when list has multiple blogs equals an object with author and blogs properties where author has the highest number of blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('when list is empty equals an empty objects', () => {
    const result = listHelper.mostLikes([])
    expect(result).toEqual({})
  })

  test('when list has one blog equals an object with the author and number of likes of that blog', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({
      author: 'Loner McLonely',
      likes: 1
    })
  })

  test('when list has multiple blogs equals an object with author and likes properties where author has the highest number of likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})
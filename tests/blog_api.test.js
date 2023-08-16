const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

mongoose.set('bufferTimeoutMS', 30000)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.listWithMultipleBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('if blogs are already saved', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.listWithMultipleBlogs.length)
  }, 100000)

  test('all blogs should have a unique id property (not _id)', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('creation of a new blog', () => {
  test('with valid data will be saved to the database', async () => {
    const newBlog = helper.listWithOneBlog[0]

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithMultipleBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Single blog in list')
  })

  test('missing likes property will default to 0 if missing from the POST request', async () => {
    const newBlog = {
      title: 'Massage therapy for bored housewives',
      author: 'John Redcorn',
      url: 'https://womenwithhorses.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const savedBlog = blogsAtEnd.filter(blog => blog.title === 'Massage therapy for bored housewives')
    expect(savedBlog[0].likes).toBe(0)
  })

  test('with no title will result in status code 400 and blog will not be added', async () => {
    const newBlog = {
      author: 'John Redcorn',
      likes: 43,
      url: 'https://womenwithhorses.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithMultipleBlogs.length)
  })

  test('with no url will result in status code 400 and blog will not be added', async () => {
    const newBlog = {
      author: 'John Redcorn',
      title: 'Massage therapy for bored housewives',
      likes: 43
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.listWithMultipleBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('will be successful if a valid ID is passed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.listWithMultipleBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating an existing blog', () => {
  test('will be successful with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.title = 'Updated title'

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain(blogToUpdate.title)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
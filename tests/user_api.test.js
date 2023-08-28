const bcrypt = require("bcrypt");
const User = require("../models/user");

// const mongoose = require('mongoose')
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
// const Blog = require('../models/blog')
const helper = require("./test_helper");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("users can be retrieved from db", async () => {
    const response = await api.get("/api/users");
    expect(response.body).toHaveLength(1);
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("creation fails if username or password does not have minimum length of 3", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserBadUsername = {
      username: "ab",
      name: "Too Short",
      password: "password",
    };

    const resultBadUsername = await api
      .post("/api/users")
      .send(newUserBadUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(resultBadUsername.body.error).toContain(
      "username and password must be at least 3 characters long",
    );

    const newUserBadPassword = {
      username: "abc",
      name: "Too Short",
      password: "ab",
    };

    const resultBadPassword = await api
      .post("/api/users")
      .send(newUserBadPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(resultBadPassword.body.error).toContain(
      "username and password must be at least 3 characters long",
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

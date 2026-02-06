const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

// Task 1 Topics
describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body).toHaveProperty("topics");
    expect(Array.isArray(body.topics)).toBe(true);
    body.topics.forEach((topic) => {
      expect(topic).toHaveProperty("slug", expect.any(String));
      expect(topic).toHaveProperty("description", expect.any(String));
    });
  });
});

describe("Invalid paths", () => {
  test("404: responds with path not found", async () => {
    const { body } = await request(app)
      .get("/api/not-a-real-route")
      .expect(404);
    expect(body).toEqual({ msg: "Path not found" });
  });
});

// Task 2 Articles
describe("GET /api/articles", () => {
  test("200: responds with an array of articles sorted by created_at desc, with comment_count and without body", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body).toHaveProperty("articles");
    expect(Array.isArray(body.articles)).toBe(true);
    expect(body.articles.length).toBeGreaterThan(0);
    body.articles.forEach((article) => {
      expect(article).toHaveProperty("author", expect.any(String));
      expect(article).toHaveProperty("title", expect.any(String));
      expect(article).toHaveProperty("article_id", expect.any(Number));
      expect(article).toHaveProperty("topic", expect.any(String));
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("votes", expect.any(Number));
      expect(article).toHaveProperty("article_img_url");
      expect(article).toHaveProperty("comment_count", expect.any(Number));
      expect(article).not.toHaveProperty("body");
    });
    const dates = body.articles.map((a) => new Date(a.created_at).getTime());
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });
});

// Task 3 Users
describe("GET /api/users", () => {
  test("200: responds with an array of users", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body).toHaveProperty("users");
    expect(Array.isArray(body.users)).toBe(true);
    body.users.forEach((user) => {
      expect(user).toHaveProperty("username", expect.any(String));
      expect(user).toHaveProperty("name", expect.any(String));
      expect(user).toHaveProperty("avatar_url", expect.any(String));
    });
  });
});

// Task 4 article ID
describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object for the given id", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    // console.log(body);
    expect(body).toHaveProperty("article");
    expect(body.article).toEqual(
      expect.objectContaining({
        author: expect.any(String),
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      }),
    );
  });
  test("400: responds with Bad request when article_id is not a number", async () => {
    const { body } = await request(app)
      .get("/api/articles/not-a-number")
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });
  test("404: responds with Not found when article_id does not exist", async () => {
    const { body } = await request(app).get("/api/articles/999999").expect(404);

    expect(body).toEqual({ msg: "Not found" });
  });
});

// Task 5 comments
describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id sorted by most recent first", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    expect(body).toHaveProperty("comments");
    expect(Array.isArray(body.comments)).toBe(true);

    body.comments.forEach((comment) => {
      expect(comment).toHaveProperty("comment_id", expect.any(Number));
      expect(comment).toHaveProperty("votes", expect.any(Number));
      expect(comment).toHaveProperty("created_at", expect.any(String));
      expect(comment).toHaveProperty("author", expect.any(String));
      expect(comment).toHaveProperty("body", expect.any(String));
      expect(comment).toHaveProperty("article_id", 1);
    });

    const dates = body.comments.map((c) => new Date(c.created_at).getTime());
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });

  test("200: responds with an empty array when the article exists but has no comments", async () => {
    const { body } = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(body).toEqual({ comments: [] });
  });

  test("400: responds with Bad request when article_id is not a number", async () => {
    const { body } = await request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("404: responds with Not found when article_id does not exist", async () => {
    const { body } = await request(app)
      .get("/api/articles/999999/comments")
      .expect(404);
    expect(body).toEqual({ msg: "Not found" });
  });
});

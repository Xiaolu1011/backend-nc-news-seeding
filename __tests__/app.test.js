const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test.skip("200: responds with an array of topic objects (slug, description)", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("topics");
        expect(Array.isArray(body.topics)).toBe(true);

        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

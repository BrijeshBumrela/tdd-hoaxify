const request = require("supertest");
const app = require("../index");
const User = require("../src/user/User");
const sequelize = require("../src/config/database");

beforeAll(() => {
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

describe("User registration", () => {
  it("returns 200 OK when sign up request is valid", (done) => {
    request(app)
      .post(`/api/1.0/users`)
      .send({
        username: "user1",
        email: "user@mail.com",
        password: "P4ssword",
      })
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it("returns success message when signup request is valid", (done) => {
    request(app)
      .post(`/api/1.0/users`)
      .send({
        username: "user1",
        email: "user@mail.com",
        password: "P4ssword",
      })
      .then((res) => {
        expect(res.body.message).toBe("user created");
        done();
      });
  });

  it("Saves user to database", (done) => {
    request(app)
      .post(`/api/1.0/users`)
      .send({
        username: "user1",
        email: "user@mail.com",
        password: "P4ssword",
      })
      .then((res) => {
        User.findAll().then((userlist) => {
          expect(userlist.length).toBe(1);
          done();
        });
      });
  });

  it("Saves username & email to database", (done) => {
    request(app)
      .post(`/api/1.0/users`)
      .send({
        username: "user1",
        email: "user@mail.com",
        password: "P4ssword",
      })
      .then((res) => {
        User.findAll().then((userlist) => {
          expect(userlist[0]["username"]).toBe("user1");
          expect(userlist[0]["email"]).toBe("user@mail.com");
          done();
        });
      });
  });
});

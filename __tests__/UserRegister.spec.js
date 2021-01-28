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
  const postValidUser = () => {
    return request(app).post(`/api/1.0/users`).send({
      username: "user1",
      email: "user@mail.com",
      password: "P4ssword",
    });
  };

  it("returns 200 OK when sign up request is valid", async (done) => {
    const res = await postValidUser();
    expect(res.status).toBe(200);
    done();
  });

  it("returns success message when signup request is valid", async (done) => {
    const res = await postValidUser();
    expect(res.body.message).toBe("user created");
    done();
  });

  it("Saves user to database", async (done) => {
    const res = await postValidUser();
    const userlist = await User.findAll();
    expect(userlist.length).toBe(1);
    done();
  });

  it("Saves username & email to database", async (done) => {
    const res = await postValidUser();
    const userlist = await User.findAll();
    expect(userlist[0]["username"]).toBe("user1");
    expect(userlist[0]["email"]).toBe("user@mail.com");
    done();
  });

  it("Saved password should not be equal (should be hashed)", async (done) => {
    const res = await postValidUser();
    const userlist = await User.findAll();
    expect(userlist[0]["password"]).not.toBe("P4ssword");
    done();
  });
});

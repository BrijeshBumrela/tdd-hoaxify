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

const validUser = {
  username: "user1",
  email: "user@mail.com",
  password: "P4ssword",
};

const invalidUser = {
  username: null,
  email: "user@mail.com",
  password: "P4ssword",
};

describe("User registration", () => {
  const postUser = (user = validUser) => {
    return request(app).post(`/api/1.0/users`).send(user);
  };

  it("returns 200 OK when sign up request is valid", async (done) => {
    const res = await postUser();
    expect(res.status).toBe(200);
    done();
  });

  it("returns success message when signup request is valid", async (done) => {
    const res = await postUser();
    expect(res.body.message).toBe("user created");
    done();
  });

  it("Saves user to database", async (done) => {
    const res = await postUser();
    const userlist = await User.findAll();
    expect(userlist.length).toBe(1);
    done();
  });

  it("Saves username & email to database", async (done) => {
    const res = await postUser();
    const userlist = await User.findAll();
    expect(userlist[0]["username"]).toBe("user1");
    expect(userlist[0]["email"]).toBe("user@mail.com");
    done();
  });

  it("Saved password should not be equal (should be hashed)", async (done) => {
    const res = await postUser();
    const userlist = await User.findAll();
    expect(userlist[0]["password"]).not.toBe("P4ssword");
    done();
  });

  it("Post user with null username should have status of 400", async (done) => {
    const res = await postUser(invalidUser);
    expect(res.status).toBe(400);
    done();
  });

  it("returns email, username cannot be be null email, username", async (done) => {
    const res = await postUser({
      username: null,
      email: null,
      password: "P4ssword",
    });
    expect(Object.keys(res.body.validationErrors).length).toBe(2);
    done();
  });

  it.each([
    ["username", "Username can not be null"],
    ["email", "email can not be null"],
    ["password", "password can not be null"],
  ])("when %s is null %s", async (field, expectedMsg) => {
    const user = {
      ...validUser,
    };

    user[field] = null;
    const res = await postUser(user);
    expect(res.body.validationErrors[field]).not.toBeUndefined();
  });
});

const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Blog } = require('../models/blog');
const { User } = require('../models/user');

const { blogs, populateBlogs, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateBlogs);

describe('POST /blogs', () => {
    it('should create a new blog', (done) => {
        var content = 'Test blog';
        request(app)
            .post('/blogs')
            .send({ content })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.content).toBe(content);

            })
            .end((err, res) => {
                if (err)
                    return done(err);
                Blog.find({ content }).then((blogs) => {
                    expect(blogs.length).toBe(1);
                    expect(blogs[0].content).toBe(content);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should not create blog with bad data', (done) => {
        request(app)
            .post('/blogs')
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err);
                Blog.find().then((blogs) => {
                    expect(blogs.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
    });
});

describe('GET /blogs', () => {
    it('should get all blogs', (done) => {
        request(app)
            .get('/blogs')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.blogs.length).toBe(1);
            }).end(done);
    });
});

describe('GET /blog/:id', () => {
    it('should return blog doc', (done) => {
        request(app)
            .get(`/blog/${blogs[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.blog.content).toBe(blogs[0].content);
            }).end(done);
    });
    it('should return 404 blog not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/blog/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return 404 for non-object id', (done) => {
        request(app)
            .get(`/blog/234`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should not return blog post created by a different user', (done) => {
        request(app)
            .get(`/blog/${blogs[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /blog/:id', () => {
    it('should remove a blog post', (done) => {
        var hexId = blogs[1]._id.toHexString();
        request(app)
            .delete(`/blog/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.blog._id).toBe(hexId);
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }
                Blog.findById(hexId).then((blog) => {
                    expect(blog).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not remove a blog of another user', (done) => {
        var hexId = blogs[1]._id.toHexString();
        request(app)
            .delete(`/blog/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Blog.findById(hexId).then((blog) => {
                    expect(blog).toBeTruthy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if blog not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/blog/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/blog/123`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /blog/:id', () => {
    it('should update the blog', (done) => {
        var content = "New blog";
        var hexId = blogs[0]._id.toHexString();
        request(app)
            .patch(`/blog/${hexId}`)
            .send({
                content
            })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.blog.content).toBe(content);
            })
            .end(done)
    });

    it('should not update the blog as different user', (done) => {
        var content = "New blog";
        var hexId = blogs[0]._id.toHexString();
        request(app)
            .patch(`/blog/${hexId}`)
            .send({
                content
            })
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should clear completedAt when blog is not completed', (done) => {
        var hexId = blogs[0]._id.toHexString();
        var content = 'This should be the new text!!';

        request(app)
            .patch(`/blog/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                content
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.blog.content).toBe(content);
            })
            .end(done);
    });
});

describe('GET users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done);
    });
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    });
});

describe('POST /users', () => {
    var email = "test@test.com";
    var password = "validpass";
    it('should create a user', (done) => {
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err)
                    return done(err);
                User.findOne({ email }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done());
            });

    });
    it('should return validation errors of request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'sid',
                password: 'sick'
            })
            .expect(400)
            .end(done);

    });
    it('should not create a user if email already exists', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'sid@sids.com',
                password: 'sick123'
            })
            .expect(400)
            .end(done);
    });
});

describe('/POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (!err)
                    return done(err);
                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().token[1]).toMatchObject({
                        auth: 'true',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            })

    });
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: "sample@sam.com",
                password: "pass1234"
            })
            .expect(401)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (!err)
                    return done(err);
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            })
    });
});

describe('DELETE /users/me/token', () => {
    it('should delete auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err)
                    return done(err);
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    })
});
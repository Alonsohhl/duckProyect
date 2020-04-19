// const assert = require('assert')

// import { destroyUser } from 'test_helpers'
const { destroyUser } = require('./test_helpers')

const request = require('supertest')
// const app = require('../src/index')
var server = require('../src/index')
var agent = request.agent(server)

let chai = require('chai')
// let should = chai.should()
var expect = chai.expect

describe('User Methods', function () {
  const FIXED_USER = {
    user: { loginName: 'fresh', loginPassword: 'fresh', user: 'alonso', id: 1 }
  }
  const FIXED_USER_WRONG_PASSWORD = {
    user: { loginName: 'fresh', loginPassword: 'wrong' }
  }
  const FIXED_USER_WRONG_USER = {
    user: { loginName: 'wrong', loginPassword: 'wrong' }
  }
  var token = null
  describe('User - Login', function () {
    before(function (done) {
      agent
        .post('/api/users/login')
        .send(FIXED_USER)
        .end(function (err, res) {
          token = res.body.user.token
          done()
        })
    })
    it('Test: Login with good User', function (done) {
      agent
        .post('/api/users/login')
        .send(FIXED_USER)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('id').to.be.equal(FIXED_USER.user.id)
          expect(res.body).to.have.property('user').to.be.equal(FIXED_USER.user.user)
          expect(res.body).to.have.property('token')

          return done()
        })
    })
    it('Test: Login with good User Wrong Password', function (done) {
      agent
        .post('/api/users/login')
        .send(FIXED_USER_WRONG_PASSWORD)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, {
          message: 'Wrong Password'
        })
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })
    it('Test: Login with wrong userName', function (done) {
      agent
        .post('/api/users/login')
        .send(FIXED_USER_WRONG_USER)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, {
          message: 'User not found'
        })
        .end(function (err, res) {
          if (err) return done(err)
          return done()
        })
    })
  })

  describe('User - Register', function () {
    let FIXED_USER_REGISTER = {
      user: {
        name: 'UserRegisterName',
        lastName: 'UserRegisterLastName',
        mail: 'UserRegister@mail.com',
        loginName: 'UserRegisterLogin',
        loginPassword: 'UserRegisterPassword'
      }
    }
    it('Test: Register User Successfully ', function (done) {
      agent
        .post('/api/users/register')
        .send(FIXED_USER_REGISTER)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)

          expect(res.body).to.have.property('status').to.be.equal('User Insert')
          expect(res.body).to.have.property('id')

          destroyUser(res.body.id).then(() => {
            return done()
          })
        })
    })
    it('Test: Register User Duplicate ', function (done) {
      agent
        .post('/api/users/register')
        .send(FIXED_USER)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err)

          expect(res.body).to.have.property('error') //.to.be.equal('User Insert')

          return done()
        })
    })
  })
})

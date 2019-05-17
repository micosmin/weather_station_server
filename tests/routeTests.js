// eslint-disable-next-line no-unused-vars
const should = require('should');
// const sinon = require('sinon');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app.js');

const agent = request.agent(app);

describe('Testing "/" Route', () => {
  it('response status should be 200', (done) => {
    agent.get('/')
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
  });

  after((done) => {
    app.server.close(done());
  });
});

describe('Testing the api route', () => {
  it('returns a confirmation message', (done) => {
    agent.post('/api/data')
      .send({ temperature: 20 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        // if (err) return done(err);
        res.status.should.equal(200);
        res.body.message.should.equal('Record saved');
        done();
      });
  });

  it("returns a helpful message if it couldn't save", (done) => {
    agent.post('/api/data')
      .send({
        temperature: 'a string',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        // if (err) return done(err);
        res.status.should.equal(200);
        res.body.message.should.equal('Record was not saved');
        done();
      });
  });

  it("response include the Mongo error if it couldn't save", (done) => {
    agent.post('/api/data')
      .send({
        temperature: 'a string',
        humidity: 'asdasd',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        // if (err) return done(err);
        res.body.mongoResponse.errors.temperature.message
          .should.equal('Cast to Number failed for value "a string" at path "temperature"');
        done();
      });
  });

  xit('saves the data in the database for a legit input', (done) => {
    agent.post('/api/data')
      .send({
        temperature: 32,
        humidity: 67,
        pressure: 100,
        date: 1560643200000 // = 2019/5/16
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        // if (err) return done(err);
        // res.body.mongoResponse.errors.temperature.message
        //   .should.equal('Cast to Number failed for value "a string" at path "temperature"');
        done();
      });
  });


  after((done) => {
    mongoose.connection.close();
    app.server.close(done());
  });
});

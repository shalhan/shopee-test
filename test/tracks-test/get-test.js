const { Pool, Client } = require('pg')

process.env.NODE_ENV = 'test'

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('/GET tracks', () => {
    it('it should GET all tracking data', (done) => {
        chai.request(server)
            .get('/tracks')
            .end((err,res) => {
                res.should.have.status(200)
                res.body.data.should.be.a('array');
                res.body.data[0].should.be.a('object');
                res.body.data[0].should.have.property('from_c');
                res.body.data[0].should.have.property('to_c');
                done()
            })
    })
})
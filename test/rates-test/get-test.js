process.env.NODE_ENV = 'test'

const { Pool, Client } = require('pg')

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

describe('/GET rates', () => {
    it('it should GET last average rates in last 7 days if data not null', (done) => {
        chai.request(server)
            .get('/rates')
            .query({date: '2017-09-24'})
            .end((err,res) => {
                res.should.have.status(200)
                res.body.data.should.be.a('array');
                expect(res.body.data).to.deep.include({from_c: 'USD', to_c: 'GBP', rate: 2, created_at: '2017-09-24', avg_rate: 1.5857142857142856})
                expect(res.body.data).to.deep.include({from_c: 'JPY', to_c: 'IDR', rate: 'Insufficient data', created_at: '2017-09-24', avg_rate: null})
                done()
            })
    })
    it('it should failed caused no date selected', (done) => {
        chai.request(server)
            .get('/rates')
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
    it('it should failed caused date not valid', (done) => {
        chai.request(server)
            .get('/rates')
            .query({date: 'DATENOTVALID'})
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
    it('it should get trend rate if data not null', (done) => {
        chai.request(server)
            .get('/rates/trend')
            .query({from: 'USD', to: 'GBP'})
            .end((err,res) => {
                res.should.have.status(200)
                res.body.data.should.have.property('avg_rate')
                done()
            })
    })
    it('it should failed cause no "to" query', (done) => {
        chai.request(server)
            .get('/rates/trend')
            .query({from: 'USD'})
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
    it('it should failed cause no "from" query', (done) => {
        chai.request(server)
            .get('/rates/trend')
            .query({to: 'GBP'})
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
    it('it should failed cause no both "to" and "from" query', (done) => {
        chai.request(server)
            .get('/rates/trend')
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
});
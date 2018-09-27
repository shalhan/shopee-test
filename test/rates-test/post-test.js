process.env.NODE_ENV = 'test'

const { Pool, Client } = require('pg')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../../server')
// let should = chai.should()
let expect = chai.expect
let assert = require('assert')

chai.use(chaiHttp);

describe('/POST rates', () => {
    it('should create rate data', (done) => {
        let rate = {
            from_c: "IDR",
            to_c: "SGP",
            rate: 2.4201234,
            created_at: "2017-09-01"
        }
        chai.request(server)
            .post('/rates')
            .send(rate)
            .end((err,res) => {
                res.should.have.status(200)
                done()
            })
    })
    it('should be failed cause missing fields', (done) => {
        let rate = {
            from_c: "IDR",
            to_c: "SGP",
            rate: 2.4201234,
        }
        chai.request(server)
            .post('/rates')
            .send(rate)
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })

    it('should be failed cause date not valid', (done) => {
        let rate = {
            from_c: "IDR",
            to_c: "SGP",
            rate: 2.4201234,
            created_at: "THIS IS NOT VALID"
        }
        chai.request(server)
            .post('/rates')
            .send(rate)
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
    it('should be failed cause currency length higher than 5', (done) => {
        let rate = {
            from_c: "IDR12345",
            to_c: "SGP12345",
            rate: 2.4201234,
            created_at: "2017-09-01"
        }
        chai.request(server)
            .post('/rates')
            .send(rate)
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
});
const database = require("../../tools/database.js")
const pool = database.connectDB()

// //Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
let assert = require('assert')

chai.use(chaiHttp);

describe('/POST tracks', () => {
    it('it should POST tracking currency', (done) => {
        let track = {
            from_c: "GBP",
            to_c: "USD"
        }
        const query = "delete from tracks where from_c = 'GBP' and to_c = 'USD'"
        pool.query(query)
        .then(res => {
            chai.request(server)
            .post('/tracks')
            .send(track)
            .end((err,res) => {
                res.should.have.status(200)
                res.body.data[0].should.be.a('object')
                res.body.data[0].should.have.property('from_c')
                done()
            })
        })
        .catch(e => {console.error(e.stack)})
    })
    it('it should failed cause currency already in tracking table', (done) => {
        let track = {
            from_c: "USD",
            to_c: "GBP"
        }
        chai.request(server)
            .post('/tracks')
            .send(track)
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
    it('it should failed cause currency not exist in rate table', (done) => {
        let track = {
            from_c: "FROM1",
            to_c: "FROM2"
        }
        chai.request(server)
            .post('/tracks')
            .send(track)
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
    it('it should failed cause field is missing', (done) => {
        let track = {
            from_c: "USD",
            to: "IDR"
        }
        chai.request(server)
            .post('/tracks')
            .send(track)
            .end((err,res) => {
                res.should.have.status(400)
                res.body.should.have.property('error')
                done()
            })
    })
})
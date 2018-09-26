process.env.NODE_ENV = 'test'

const database = require("../../tools/database.js")
const pool = database.connectDB()

// //Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
let assert = require('assert')

chai.use(chaiHttp);

describe('/DELETE tracks', () => {
    it('it should DELETE tracking currency', (done) => {
        let track = {
            from_c: "GBP",
            to_c: "USD"
        }
        const query = "insert into tracks (from_c,to_c, created_at, updated_at) values ('TEST1','TEST2', now(), now()) RETURNING *"
        pool.query(query)
        .then(res => {
            console.log(res.rows[0])
            let newTrack = res.rows[0]
            chai.request(server)
            .delete('/tracks/' + newTrack.id)
            .send(newTrack)
            .end((err,res) => {
                res.should.have.status(200)
                done()
            })
        })
        .catch(e => {console.error(e.stack)})
    })
})
const { Pool, Client } = require('pg')
const rates = require('../routes/routers.js')

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let expect = chai.expect;


chai.use(chaiHttp);

describe('Rates', () =>  {
    describe('/GET rates?date=', () => {
        it('it should GET last average rates in last 7 days', (done) => {
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
    })

    describe('/POST rates', () => {
        it('it should POST rate exchange', (done) => {
            let rate = {
                from_c: "IDR",
                to_c: "SGP",
                rate: 2.4201234,
                created_at: 2017-09-01
            }
            chai.request(server)
                .post('/rates')
                .end((err,res) => {
                    res.should.have.status(200)
                    res.body.data.should.be.a('array');
                    expect(res.body.data).to.deep.include({from_c: 'USD', to_c: 'GBP', rate: 2, created_at: '2017-09-24', avg_rate: 1.5857142857142856})
                    expect(res.body.data).to.deep.include({from_c: 'JPY', to_c: 'IDR', rate: 'Insufficient data', created_at: '2017-09-24', avg_rate: null})
                    done()
                })
        })
    })
})
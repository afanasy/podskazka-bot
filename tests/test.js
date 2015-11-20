var
  expect = require('expect.js'),
  bot = require('../'),
  app = require('./mock-server'),
  server
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
describe('podskazka-bot', function () {
  this.timeout(30 * 1000)

  describe('mock server', function () {
    var conf
    try {
      conf = require('../conf')
    } catch (e) {
      // if ../conf is not found skip mock server test
      return
    }
    before(function (done) {
      server = app.start(done)
    })
    after(function (done) {
      server.close(done)
    })
    it('will get random proverb', function (done) {
      var
        mockReq = {
          body: {
            message: {
              chat: { id: 'chat-id' },
              messsage_id: 'message-id'
            }
          }
        },
        mockRes = {end: function () { }}
      bot()(mockReq, mockRes)
      setTimeout(done, 10 * 1000)
    })
  })

  describe.skip('real server', function () {
    // @TODO
  })
})

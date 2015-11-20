var
  express = require('express'),
  expect = require('expect.js'),
  https = require('https'),
  fs = require('fs'),
  conf = require('../conf'),
  app = module.exports = express()

app.get('/' + conf.apiKey + '/setWebhook', function (req, res) {
  try {
    expect(req.query.url).to.eql(conf.webHookUrl)
  } catch (e) {
    console.log(e);
    return res.end(e.message)
  }
  res.json({ok: true})
})
app.get('/' + conf.apiKey + '/sendMessage', function (req, res) {
  try {
    expect(req.query.chat_id).to.eql('chat-id')
    expect(req.query.reply_to_message_id).to.eql('message-id')
    console.log(req.query.text)
  } catch (e) {
    console.log(e);
    return res.end(e.message)
  }
  res.end()
})
app.start = function (done) {
  return https.createServer({
      key: fs.readFileSync(__dirname + '/key.pem'),
      cert: fs.readFileSync(__dirname + '/cert.pem')
    }, app).listen(3000, done);
}
if (require.main === module) {
  app.start()
}

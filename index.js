var
  _ = require('underscore'),
  request = require('request'),
  config = require('solid-config')

var dict = {}
_.each(config.proverb, function (proverb) {
  _.find(config.delimiter, function (delimiter) {
    var split = proverb.split(delimiter)
    if (split.length != 2)
      return
    dict[delimiter] = dict[delimiter] || {}
    _.each(['left', 'right'], function (side, i) {
      dict[delimiter][side] = dict[delimiter][side] || []
      dict[delimiter][side].push(split[i])
    })
    return true
  })
})

module.exports = function (d) {
  _.defaults(config, d)
  request({url: config.url + config.token + '/setWebhook', qs: {url: config.setWebhook}}, function (err) {
    if (err)
      console.log(err)
    else
      console.log('setWebhook ok', config.setWebhook)
  })
  return function (req, res) {
    var delimiter = _.sample(config.delimiter)
    var text = _.sample(dict[delimiter].left) + delimiter + _.sample(dict[delimiter].right)
    console.log(req.body)
    request({url: config.url + config.token + '/sendMessage', qs: {chat_id: req.body.message.chat.id, reply_to_message_id: req.body.message.message_id, text: text}}, function (err) {
      if (err)
        console.log(err)
      else
        console.log('sendMessage ok', text)
    })
    res.end()
  }
}

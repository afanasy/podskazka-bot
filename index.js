var
  _ = require('underscore'),
  https = require('https'),
  util = require('util'),
  os = require('os'),
  fs = require('fs'),

// helpers
  l = console.log,
  e = console.error,
  lo = function (obj) {
    l(util.inspect(obj, {depth: null, colors: true}))
  },

// API methods
  METHOD_SET_WEBHOOK = 'setWebhook',
  METHOD_SEND_MESSAGE = 'sendMessage',

  home,
  homeDir,
  params,
  proverbs

try {
  home = __dirname.match(/^\/home\/[^\/]+/)[0]
} catch (e) {
  home = '/home/ubuntu'
}
// read params
homeDir = home + '/.proverb-bot/'
try {
  params = require(homeDir + 'conf.json')
} catch (e) {
  params = require('./conf.json')
}
l('read params:')
lo(params)

// read proverbs
proverbs = {
  '-': {left: [], right: []},
  ',': {left: [], right: []},
}
_.each(require('./package').proverb, function (proverb) {
  if (/-/.test(proverb)) {
    proverbs['-'].left.push(proverb.split('-')[0].trim())
    proverbs['-'].right.push(proverb.split('-')[1].trim())
  } else {
    proverbs[','].left.push(proverb.split(',')[0].trim())
    proverbs[','].right.push(proverb.split(',')[1].trim())
  }
})
function setWebhook () {
  https.get(util.format('%s%s/%s?url=%s', params.apiUrl, params.apiKey, METHOD_SET_WEBHOOK, params.webHookUrl), function(res) {
    l('response', res.statusCode)

    var data = ''
    res
      .on('data', function (chunk) {
        data += chunk
      })
      .on('end', function() {
        l(data)

        // trustNo1
        try {
          data = JSON.parse(data)
        } catch (err) {
          e('JSON parse error', err)
          return
        }

        if (data.ok === false) {
          e('something bad happened')
          lo(data)
          return
        }

        l('webhook set successful')
      })
  }).on('error', function(err) {
    e('error setting webhook', err)
  })
}



function processUpdate(update) {
  l('processUpdate')
  lo(update)

  https.get(util.format('%s%s/%s?chat_id=%s&reply_to_message_id=%s&text=%s', params.apiUrl, params.apiKey,
                        METHOD_SEND_MESSAGE, update.message.chat.id, update.message.messsage_id,
                        encodeURI(getRandomQuote())), function(res) {
    l('response', res.statusCode)
  })

}



function getRandomQuote () {
  var key = _.sample(_.keys(proverbs))
  var separator = key === ',' ? ', ' : ' - '
  return [
    _.sample(proverbs[key].left),
    _.sample(proverbs[key].right),
  ].join(separator)
}



module.exports = function () {
  setWebhook()
  return function (req, res, next) {
    l(req.url)
    processUpdate(req.body)
    res.end()
  }
}

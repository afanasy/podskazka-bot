var _ = require('underscore')
var package = require('./package')
var config = package[package.name]

module.exports = () => {
  var dict = {}
  _.each(config.proverb, proverb => {
    _.find(config.delimiter, delimiter => {
      var split = proverb.split(delimiter)
      if (split.length != 2)
        return
      dict[delimiter] = dict[delimiter] || {}
      _.each(['left', 'right'], (side, i) => {
        dict[delimiter][side] = dict[delimiter][side] || []
        dict[delimiter][side].push(split[i])
      })
      return true
    })
  })
  return (req, res) => {
    var delimiter = _.sample(config.delimiter)
    var text = _.sample(dict[delimiter].left) + delimiter + _.sample(dict[delimiter].right)
    console.log(req.body, text)
    res.json({method: 'sendMessage', chat_id: req.body.message.chat.id, text: text})
  }
}

var parallel = require('run-parallel')
var MultiStream = require('multistream')
var through = require('through2')

module.exports = function (query, searchers, cb) {
  var streams = []
  for (var i in searchers) {
    var searcher = searchers[i]
    var stream = searcher.stream(query).pipe(through.obj(function (data, enc, next) {
      var res = {}
      res.searcher = {
        name: searcher.name,
        url: searcher.url,
        version: searcher.version
      }
      res.data = data
      next(null, res)
    }))
    streams.push(stream)
  }
  return MultiStream(streams)
}

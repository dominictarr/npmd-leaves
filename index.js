#! /usr/bin/env node
var pt   = require('pull-traverse')
var pull = require('pull-stream')
var hash = require('shasum')

function compare(a, b) {
  return a < b ? -1 : a === b ? 0 : 1
}

function isEmpty(obj) {
  for(var k in obj)
    return false
  return true
}

function map(obj, m) {
  var a = []
  for(var k in obj)
    a.push(m(obj[k], k, obj))
  return a
}

function leafFirst(tree) {
   return pull(pt.leafFirst(tree, function (tree) {
    return pull.values(tree.dependencies || tree)
  }), pull.filter())
}

function collect(field, cb) {
  return pull.reduce(function (set, pkg) {
    set[pkg[field]] = pkg
    return set
  }, {}, function (err, ary) {
    cb(err, ary)
  })
}

function roots (tree) {
  var deps = {}, roots = {}
  for(var k in tree) {
    for(var j in tree[k].dependencies)
      deps[tree[k].dependencies[j]] = true
  }
  for(var k in tree) {
    var pkg = tree[k]
    if(!deps[k])
      roots[k] = {name: pkg.name, version: pkg.version, hash: pkg.hash}
  }
  return roots
}

//hash the deps through the tree.

module.exports = 
function (tree, cb) {
  var tree = JSON.parse(JSON.stringify(tree))
  var _tree
  pull(
    leafFirst(tree),
    pull.through(function (pkg) {
      var m = map(pkg.dependencies, function (pkg) {
        if(!pkg.shasum) throw new Error(pkg.name + '@' + pkg.version + ' is missing shasum')
        return pkg.shasumDeps || pkg.shasum
      }).sort()
      if(m.length) {
        m.unshift(pkg.shasum)
        m.join(',')
        var deps = pkg.dependencies
        if(m) pkg.hash = hash(m)
        delete pkg.dependencies
        pkg.dependencies = deps
      }
      pkg.hash = pkg.hash || pkg.shasum
    }),
    pull.map(function (pkg) {

      if(!pkg.dependencies)
        return null

      var _deps = {}, deps = pkg.dependencies
      var ret = {
        name: pkg.name, version: pkg.version,
        hash: pkg.hash,
        shasum: pkg.shasum
      }

      if(!isEmpty(deps)) {
        Object.keys(deps).sort().forEach(function (name) {
          _deps[name] = deps[name].hash
        })
        ret.dependencies = _deps
      }

      return ret
    }),
    pull.filter(),
    pull.unique('hash'),
    collect('hash', function (err, tree) {
      _tree = tree
      if(err)
        throw err
    })
  )

  return _tree
}

module.exports.roots = roots

if(!module.parent) {
  var data = ''
  process.stdin
    .on('data', function (d) { data += d })
    .on('end', function () {
      console.log(JSON.stringify(module.exports(JSON.parse(data)), null, 2))
    })
}

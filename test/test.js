
var leaves = require('../')
var depTree = require('./fixtures/npmd-resolved.json')
var depTree2 = require('./fixtures/npmd-multi.json')
var leafHashes = require('./fixtures/npmd-leaves.json')
var multiLeafHashes = require('./fixtures/npmd-multi-leaves.json')
var test = require('tape')

var roots1 = { '5a395f6623a214587b479ade75541c13b7d8047f':
   { name: 'npmd',
     version: '0.4.1',
     hash: '5a395f6623a214587b479ade75541c13b7d8047f' } }

var roots2 = 
{ '943e0ec03df00ebeb6273a5b94b916ba54b47581':
   { name: 'foo',
     version: '1.0.0',
     hash: '943e0ec03df00ebeb6273a5b94b916ba54b47581' },
  e7f7acc6616950574009b0ca53f99e776b96d78c:
   { name: 'pull-stream',
     version: '2.20.0',
     hash: 'e7f7acc6616950574009b0ca53f99e776b96d78c' },
  '4a0a51890942181cd93ba9f1aa98b85d971e03ca':
   { name: 'pull-window',
     version: '2.1.0',
     hash: '4a0a51890942181cd93ba9f1aa98b85d971e03ca' } }

test('leaves converts to leaf first, with hashes', function (t) {
  t.deepEqual(leaves(depTree), leafHashes)
  t.deepEqual(leaves.roots(leafHashes), roots1)
  t.end()
})

test('leaves converts to leaf first, with hashes', function (t) {

  t.deepEqual(leaves(depTree2), multiLeafHashes)
  t.deepEqual(leaves.roots(multiLeafHashes), roots2)

  console.log(leaves.roots(leaves(depTree2)))
  t.end()
})



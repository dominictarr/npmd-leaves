# npmd-leaves

take a dependency tree generated my npmd-resolve and convert it
suitable for npmd-link

[![travis](https://travis-ci.org/dominictarr/npmd-leaves.png?branch=master)
](https://travis-ci.org/dominictarr/npmd-leaves)

can also be used as a unix tool.

``` js
npm install -g npmd-resolve npmd-leaves
npmd-resolve request | npmd-leaves | npmd-link
```

## what

`npmd-leaves` transforms a npmd-resolve tree into leaf-first order
(topological sort). Every subtree is uniquely identified by the hash of it's
tarball + it's dependencies hashes.

it's used with npmd-link to do a module install based on symlinked dependencies.

## License

MIT

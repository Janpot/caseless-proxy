# caseless-proxy

Create ES6 proxy object with case-insensitive properties.

This library has similar semantics to the [caseless](https://www.npmjs.com/package/caseless) library but is implemented as a proxy object.
This way native javascript constructs can be used to get/set/delete properties in a case insensitive manner.

Objects created with this library behave exactly like normal javascript objects with the exception that property access happens in a case insensitive way.

## Usage

caseless:

``` js
var headers = {};
var c = caseless(headers);
c.set('a-Header', 'asdf');
c.get('a-header') === 'asdf';
```

caseless-proxy:

```js
var headers = {};
var c = caselessProxy(headers);
c['a-Header'] = 'asdf';
c['a-header'] === 'asdf';
```

caseless:

```js
c.has('a-header') === 'a-Header'
```

caseless-proxy:

```js
'a-header' in c
```

caseless:

```js
var headers = {};
var c = caseless(headers);
c.set('a-Header', 'fdas');
c.swap('a-HEADER');
c.has('a-header') === 'a-HEADER';
headers === {'a-HEADER': 'fdas'};
```

caseless-proxy:

```js
var headers = {};
var c = caselessProxy(headers);
c['a-Header'] = 'asdf';
function swap (caseless, property) {
  let tmp = caseless[property];
  delete caseless[property];
  caseless[property] = tmp;
}
swap(c, 'a-HEADER');
headers === {'a-HEADER': 'fdas'};
```

## API

```js
caselessProxy( [Object target] );
```

Creates a proxy to the `target` object with case insensitive property access.
Will create a new object when `target` is omitted.



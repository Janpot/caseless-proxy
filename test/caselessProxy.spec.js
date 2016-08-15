/* eslint-env mocha */

const caselessProxy = require('..');
const { assert } = require('chai');

describe.only('caseless-proxy', function () {
  it('can get a property case insensitive', function () {
    let obj = caselessProxy();
    obj.property = 'value';
    assert.strictEqual(obj.property, 'value');
    assert.strictEqual(obj.Property, 'value');
    assert.strictEqual(obj.PROPERTY, 'value');
    assert.strictEqual(obj.other, undefined);
  });

  it('can set a property case insensitive', function () {
    let obj = caselessProxy();
    obj.property = 1;
    obj.Property = 2;
    assert.strictEqual(obj.property, 2);
    obj.PROPERTY = 3;
    assert.strictEqual(obj.property, 3);
    assert.strictEqual(obj.Property, 3);
    assert.strictEqual(obj.other, undefined);
  });

  it('can delete a property case insensitive', function () {
    let obj = caselessProxy();
    obj.property = 1;
    delete obj.PROPERTY;
    assert.strictEqual(obj.property, undefined);
  });

  it('can use "in" operator', function () {
    let obj = caselessProxy();
    obj.property = 'value';
    assert('property' in obj);
    assert('Property' in obj);
    assert('PROPERTY' in obj);
    assert(!('other' in obj));
  });

  it('can be used in Object.keys()', function () {
    let obj = caselessProxy();
    obj.property1 = 1;
    obj.Property2 = 2;
    obj.PROPERTY3 = 3;
    assert.deepEqual(Object.getOwnPropertyNames(obj), ['property1', 'Property2', 'PROPERTY3']);
    assert.deepEqual(Object.keys(obj), ['property1', 'Property2', 'PROPERTY3']);
    let props = [];
    for (let prop in obj) {
      props.push(prop);
    }
    assert.deepEqual(props, ['property1', 'Property2', 'PROPERTY3']);
  });

  it('can use Object.defineProperty() on properties', function () {
    let obj = caselessProxy();
    Object.defineProperty(obj, 'property', {
      get () {
        return 'value';
      }
    });
    assert.strictEqual(obj.PropERty, 'value');
  });

  it('can use Object.defineProperty() on existing properties', function () {
    let obj = caselessProxy();
    obj.property = 'value';
    Object.defineProperty(obj, 'ProPErty', {
      get () {
        return 'new-value';
      }
    });
    assert.strictEqual(obj.PROPERTY, 'new-value');
  });

  it('can use Object.getOwnPropertyDescriptor() on properties', function () {
    let obj = caselessProxy();
    obj.PropERTY = 'value';
    let desc = Object.getOwnPropertyDescriptor(obj, 'prOPerty');
    assert.strictEqual(desc.value, 'value');
  });

  it('can set initial values', function () {
    let obj = caselessProxy({
      hello: 'world'
    });
    assert.strictEqual(obj.HELLO, 'world');
  });

  it('can get/set Symbol properties', function () {
    let s = Symbol();
    let obj = caselessProxy();
    obj[s] = 'value';
    assert.strictEqual(obj[s], 'value');
  });

  it('can use "in" operator on Symbol properties', function () {
    let s = Symbol();
    let obj = caselessProxy();
    obj[s] = 'value';
    assert.strictEqual(s in obj, true);
  });

  it('can use "delete" operator on Symbol properties', function () {
    let s = Symbol();
    let obj = caselessProxy();
    obj[s] = 'value';
    delete obj[s];
    assert.strictEqual(obj[s], undefined);
  });

  it('can use Object.defineProperty() on Symbol properties', function () {
    let s = Symbol();
    let obj = caselessProxy();
    Object.defineProperty(obj, s, {
      get () {
        return 'value';
      }
    });
    assert.strictEqual(obj[s], 'value');
  });

  it('can use Object.defineProperty() on existing Symbol properties', function () {
    let s = Symbol();
    let obj = caselessProxy();
    obj[s] = 'value';
    Object.defineProperty(obj, s, {
      get () {
        return 'new-value';
      }
    });
    assert.strictEqual(obj[s], 'new-value');
  });

  it('can use Object.getOwnPropertyDescriptor() on Symbol properties', function () {
    let s = Symbol();
    let obj = caselessProxy();
    obj[s] = 'value';
    let desc = Object.getOwnPropertyDescriptor(obj, s);
    assert.strictEqual(desc.value, 'value');
  });

  it('can use Object.getOwnPropertySymbols() on Symbol properties', function () {
    let s = Symbol();
    let obj = caselessProxy();
    obj[s] = 'value';
    assert.deepEqual(Object.getOwnPropertySymbols(obj), [s]);
  });

  it('can set initial Symbol values', function () {
    let s = Symbol();
    let obj = caselessProxy({
      [s]: 'world'
    });
    assert.strictEqual(obj[s], 'world');
  });

  it('mutates the original object', function () {
    let original = {
      PropertY: 'initial value'
    };
    let obj = caselessProxy(original);
    obj.pROPerTy = 'new value';
    assert.propertyVal(original, 'PropertY', 'new value');
  });
});

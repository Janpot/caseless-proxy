function create (targetObj) {
  targetObj = targetObj || {};
  let nameMap = {};

  for (let property in targetObj) {
    nameMap[property.toLowerCase()] = property;
  }

  function trackPropertyName (property) {
    if (typeof property !== 'symbol') {
      let canonical = property.toLowerCase();
      if (!(canonical in nameMap)) {
        nameMap[canonical] = property;
      }
    }
  }

  function untrackPropertyName (property) {
    if (typeof property !== 'symbol') {
      let canonical = property.toLowerCase();
      delete nameMap[canonical];
    }
  }

  function getActualProperty (property) {
    if (typeof property === 'symbol') {
      return property;
    } else {
      let canonical = property.toLowerCase();
      return (canonical in nameMap) ? nameMap[canonical] : property;
    }
  }

  return new Proxy(targetObj, {
    get (target, property, receiver) {
      return Reflect.get(target, getActualProperty(property), receiver);
    },
    set (target, property, value, receiver) {
      trackPropertyName(property);
      return Reflect.set(target, getActualProperty(property), value, receiver);
    },
    has (target, property) {
      return Reflect.has(target, getActualProperty(property));
    },
    getOwnPropertyDescriptor (target, property) {
      return Reflect.getOwnPropertyDescriptor(target, getActualProperty(property));
    },
    defineProperty (target, property, descriptor) {
      trackPropertyName(property);
      return Reflect.defineProperty(target, getActualProperty(property), descriptor);
    },
    deleteProperty (target, property) {
      let actualProperty = getActualProperty(property);
      untrackPropertyName(property);
      return Reflect.deleteProperty(target, actualProperty);
    }
  });
}

module.exports = create;

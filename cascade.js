(function() {
  
  var values = [],
      METHOD = {};
  
  var setProps = function(obj, props) {
    Object.keys(props).forEach(function(prop){
      obj[prop] = props[prop];
    });
  };
  
  window.cascade = cascade = function(obj, method) {
    var c;
    
    if (this !== METHOD) {
      values = []; 
    }
    
    c = function() {
      if (!method) { return; }
      values.push(obj[method].apply(obj, arguments));
      return c;
    };
    
    c.method = cascade.bind(METHOD, obj);
    c.set = function(props) {
      setProps(obj, props);
      return c;
    };
    
    c.dive = function(method) {
      var obj = c.last();
      if (method && typeof method !== 'string') {
        setProps(obj, method);
        method = null;
      }
      return cascade.bind(METHOD, obj)(method);
    };
    
    c.leap = function(obj, method) {
      if (method && typeof method !== 'string') {
        setProps(obj, method);
        method = null;
      }
      return cascade.bind(METHOD, obj)(method);
    };
    
    c.all = {
      values: function() {
        return values; 
      },
      first: function() {
        return values[0]; 
      },
      last: function() {
        return values[values.length - 1];
      }
    };
    
    c.values = function() {
      return values.filter(function(val) {
        return val !== undefined;
      });
    };
    
    c.first = function() {
      return c.values()[0]; 
    };
    
    c.last = function() {
      var vals = c.values();
      return vals[vals.length - 1]; 
    }
    
    if (!method) {
      var partialC = cascade.bind(null, obj);
      Object.keys(c).forEach(function(prop){
        partialC[prop] = c[prop];
      });
      return partialC;
    }
    
    return c;
  };
  
  cascade.ify = function(obj) {
    obj.cascade = cascade.bind(null, obj);
    return obj.cascade;
  };
  
})();
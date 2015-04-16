(function() {
  
  window.cascade = cascade = function(obj, method) {
    var c;
    
    if (!method) {
      return cascade.bind(null, obj);
    }
    
    c = function() {
      obj[method].apply(obj, arguments);
      return c;
    };
    
    c.method = cascade.bind(null, obj);
    c.set = function(props) {
      Object.keys(props).forEach(function(prop){
        obj[prop] = props[prop];
      });
      return c;
    };
    
    return c;
  };
  
  cascade.ify = function(obj) {
    obj.cascade = cascade.bind(null, obj);
    return obj.cascade;
  };
  
})();
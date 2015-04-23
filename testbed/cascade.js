(function() {
  
  var setProps = function(obj, props) {
    Object.keys(props).forEach(function(prop){
      obj[prop] = props[prop];
    });
  };
  
  var mainAliases = [ 'm', 'method', 'cascade', 'run', 'set', '$', '_' ],
      returnValueAliases = [ 'r', 'ret', 'dive' ],
      // .r(setable, method), .r('method')
      // .r() (index - 1)
      // .top() = .r(values.length-1)
      leapAliases = [ 'l', 'up', 'leap', 'prev' ];
  
  var Cascader = function(obj, method) {
    var ret, leap;
    
    this.values = [];
    this.objects = [obj];
    this.obj = obj;
    this.method = method;
    this.cascade = cascade.bind(this, obj);
    this.boundRun = this.run.bind(this);
    
    mainAliases.forEach(function(val) {
      this.boundRun[val] = this.cascade;
    }.bind(this));
    
    this.boundRun.first = this.first.bind(this);
    this.boundRun.last = this.last.bind(this);
    this.boundRun.vals = this.vals.bind(this);
    
    ret = this.ret.bind(this);
    returnValueAliases.forEach(function(val) {
      this.boundRun[val] = ret;
    }.bind(this));
    
    leap = this.leap.bind(this);
    leapAliases.forEach(function(val) {
      this.boundRun[val] = leap;
    }.bind(this));
    
    this.boundRun.next = this.next.bind(this);
    
    this.boundRun.all = {
      first: this.allFirst.bind(this),
      last: this.allLast.bind(this),
      vals: this.allVals.bind(this)
    };
    
  };
  
  Cascader.prototype = {
    
    constructor: Cascader,
    
    set: function(props, method) {
      setProps(this.obj, props);
      console.log('set', arguments);
      if (method) { this.method = method; console.log('method')}
      return this.boundRun;
    },
    
    ret: function(method, otherMethod) {
      var obj = this.last();
      this.objects.push(this.last());
      if (method && typeof method !== 'string') {
        setProps(obj, method);
        method = null;
      }
      this.obj = obj;
      return cascade.bind(this, obj)(method || otherMethod);
    },
    
    leap: function(method, otherMethod) {
      this.objects.pop();
      var obj = this.objects[this.objects.length - 1];
      if (method && typeof method !== 'string') {
        setProps(obj, method);
        method = null;
      }
      this.obj = obj;
      return cascade.bind(this, obj)(method || otherMethod);
    },
    
    next: function(obj, method, otherMethod) {
      if (method && typeof method !== 'string') {
        setProps(obj, method);
        method = null;
      }
      this.obj = obj;
      return cascade.bind(this, obj)(method || otherMethod);
    },
    
    run: function(){
      this.values.push(
        this.obj[this.method].apply(this.obj, arguments)
      );
      return this.boundRun;
    },
    
    vals: function() {
      return this.values.filter(function(val) {
        return val !== undefined;
      });
    },
    
    first: function() {
      return this.vals()[0]; 
    },
    
    last: function() {
      var vals = this.vals();
      return vals[vals.length - 1]; 
    },
    
    allVals: function() {
      return this.values;
    },
    
    allFirst: function() {
      return this.values[0];
    },
    
    allLast: function() {
      return this.values; 
    }
    
  };
  
  window.cascade = function(obj, method, otherMethod) {
    var cascader;
    
    if (this instanceof Cascader) {
      cascader = this;
      
      if (!method) {
        console.log(obj);
        return cascade.bind(cascader, obj) ;
      }
      
      if (!(typeof method === 'string')) {
        cascader.set(method, otherMethod);
      } else {
        cascader.method = method;
      }
      
    } else {
      cascader = new Cascader(obj, method);
    }
    
    return cascader.boundRun;
  };
  
  cascade.ify = function(obj) {
    obj.cascade = cascade.bind(null, obj);
    return obj.cascade;
  };
  
})();
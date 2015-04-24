(function() {
  
  var setProps = function(obj, props) {
    Object.keys(props).forEach(function(prop){
      obj[prop] = props[prop];
    });
  };
  
  var mainAliases = [ 'm', 'method', 'cascade', 'run', 'set', '$', 'f'],
      returnValueAliases = [ 'r', 'ret', 'dive' ],
      leapAliases = [ 'l', 'up', 'leap', 'prev' ],
      nextAliases = [ 'n', 'next', '_' ],
      current;
  
  var aliases = function(target, names, func) {
    names.forEach(function(name) {
     target[name] = func;
    });
    return aliases.bind(null, target);
  };
  
  var Cascader = function(obj, method) {
    this.values = [];
    this.objects = [obj];
    this.state = {};
    this.obj = obj;
    this.method = method;
    this.cascade = cascade.bind(this, obj);
    this.boundRun = this.run.bind(this);
    this.boundRun.s = this.setState.bind(this);
    this.boundRun.state = this.state;
    
    aliases(this.boundRun, mainAliases, this.cascade)
           (returnValueAliases, this.ret.bind(this))
           (leapAliases, this.leap.bind(this))
           (nextAliases, this.next.bind(this));
    
    this.boundRun.first = this.first.bind(this);
    this.boundRun.last = this.last.bind(this);
    this.boundRun.vals = this.vals.bind(this);
    
    this.boundRun.i = this.i.bind(this);
    
    this.boundRun.all = {
      first: this.allFirst.bind(this),
      last: this.allLast.bind(this),
      vals: this.allVals.bind(this)
    };
    
  };
  
  Cascader.prototype = {
    
    constructor: Cascader,
    
    setState: function(keyOrObj, value) {
      if (typeof keyOrObj === 'string') {
        this.boundRun.s[keyOrObj] = value;
      } else {
        setProps(this.boundRun.s, keyOrObj);  
      }
      return this.boundRun;
    },
    
    set: function(props, method) {
      setProps(this.obj, props); 
      if (method) { this.method = method; }
      return this.boundRun;
    },
    
    i: function(start, end, stepOrFunc, func) {
      var hasStep = !isNaN(parseFloat(stepOrFunc)), 
          step, loopFunc, i;
      if (!hasStep) {
        step = (start < end) ? 1 : -1;
        loopFunc = stepOrFunc;
      } else {
        step = stepOrFunc;
        loopFunc = func;
      }
      
      if (step > 0) {
        i = start;
        while(i <= end) {
          loopFunc(this.boundRun, i);
          i += step; 
        }
      } else {
        i = end;
        while(i >= start) {
          loopFunc(this.boundRun, i);
          i += step; 
        }
      }
      
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
    
    if (arguments.length === 0 && current) { 
      return current.boundRun;
    }
    
    if (this instanceof Cascader) {
      cascader = this;
      
      if (method == null) {
        return cascade.bind(cascader, obj);
      }
      
      if (typeof method === 'number') {
        cascader.i.apply(cascader, Array.prototype.slice.call(arguments, 1));
      } else if (!(typeof method === 'string')) {
        cascader.set(method, otherMethod);
      } else {
        cascader.method = method;
      }
      
    } else {
      cascader = new Cascader(obj, method);
    }
    
    current = cascader;
    
    return cascader.boundRun;
  };
  
  cascade.ify = function(obj) {
    obj.cascade = cascade.bind(null, obj);
    return obj.cascade;
  };
  
})();
// Generated by CoffeeScript 1.4.0
(function() {
  var Animation, BrowserSupport, Graph, Tween, TweenGravity, TweenSpring, UISlider,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Tween = (function() {

    Tween.properties = {};

    function Tween(options) {
      this.options = options != null ? options : {};
      this.next = __bind(this.next, this);

      this.init = __bind(this.init, this);

    }

    Tween.prototype.init = function() {
      return this.t = 0;
    };

    Tween.prototype.next = function(step) {
      if (this.t > 1) {
        this.t = 1;
      }
      this.currentT = this.t;
      return this.t += step;
    };

    return Tween;

  })();

  TweenGravity = (function(_super) {

    __extends(TweenGravity, _super);

    function TweenGravity() {
      this.next = __bind(this.next, this);

      this.init = __bind(this.init, this);
      return TweenGravity.__super__.constructor.apply(this, arguments);
    }

    TweenGravity.tweenName = "Gravity";

    TweenGravity.properties = {
      bounce: {
        min: 0,
        max: 100,
        "default": 20
      }
    };

    TweenGravity.prototype.init = function() {
      TweenGravity.__super__.init.apply(this, arguments);
      this.speed = 0;
      return this.v = 0;
    };

    TweenGravity.prototype.next = function(step) {
      var gravity, t;
      TweenGravity.__super__.next.call(this, step);
      t = this.currentT;
      gravity = 20;
      this.speed += gravity * step * step;
      this.v += this.speed;
      if (this.v > 1 && this.speed >= 0) {
        this.speed = -this.speed * (this.options.bounce / 100);
      }
      return [t, this.v, this.speed * 200];
    };

    return TweenGravity;

  })(Tween);

  TweenSpring = (function(_super) {

    __extends(TweenSpring, _super);

    function TweenSpring() {
      this.next = __bind(this.next, this);
      return TweenSpring.__super__.constructor.apply(this, arguments);
    }

    TweenSpring.tweenName = "Spring";

    TweenSpring.properties = {
      frequency: {
        min: 0,
        max: 100,
        "default": 15
      },
      friction: {
        min: 1,
        max: 1000,
        "default": 100
      },
      anticipationStrength: {
        min: 0,
        max: 1000,
        "default": 115
      },
      anticipationSize: {
        min: 0,
        max: 99,
        "default": 10
      }
    };

    TweenSpring.prototype.next = function(step) {
      var A, At, a, angle, b, decal, frequency, friction, frictionT, s, t, v, y0, yS,
        _this = this;
      TweenSpring.__super__.next.call(this, step);
      t = this.currentT;
      frequency = Math.max(1, this.options.frequency);
      friction = Math.pow(20, this.options.friction / 100);
      s = this.options.anticipationSize / 100;
      decal = Math.max(0, s);
      frictionT = (t / (1 - s)) - (s / (1 - s));
      if (t < s) {
        A = function(t) {
          var M, a, b, x0, x1;
          M = 0.8;
          x0 = s / (1 - s);
          x1 = 0;
          b = (x0 - (M * x1)) / (x0 - x1);
          a = (M - b) / x0;
          return (a * t * _this.options.anticipationStrength / 100) + b;
        };
        yS = (s / (1 - s)) - (s / (1 - s));
        y0 = (0 / (1 - s)) - (s / (1 - s));
        b = Math.acos(1 / A(yS));
        a = (Math.acos(1 / A(y0)) - b) / (frequency * (-s));
      } else {
        A = function(t) {
          return Math.pow(friction / 10, -t) * (1 - t);
        };
        b = 0;
        a = 1;
      }
      At = A(frictionT);
      angle = frequency * (t - s) * a + b;
      v = 1 - (At * Math.cos(angle));
      return [t, v, At, frictionT, angle];
    };

    return TweenSpring;

  })(Tween);

  BrowserSupport = (function() {

    function BrowserSupport() {}

    BrowserSupport.transform = function() {
      return this.withPrefix("transform");
    };

    BrowserSupport.keyframes = function() {
      if (document.body.style.webkitAnimation !== void 0) {
        return "-webkit-keyframes";
      }
      if (document.body.style.mozAnimation !== void 0) {
        return "-moz-keyframes";
      }
      return "keyframes";
    };

    BrowserSupport.withPrefix = function(property) {
      var prefix;
      prefix = this.prefixFor(property);
      if (prefix !== '') {
        return "-" + (prefix.toLowerCase()) + "-" + property;
      }
      return property;
    };

    BrowserSupport.prefixFor = function(property) {
      var k, prefix, prop, propArray, propertyName, _i, _j, _len, _len1, _ref;
      propArray = property.split('-');
      propertyName = "";
      for (_i = 0, _len = propArray.length; _i < _len; _i++) {
        prop = propArray[_i];
        propertyName += prop.substring(0, 1).toUpperCase() + prop.substring(1);
      }
      _ref = ["Webkit", "Moz"];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        prefix = _ref[_j];
        k = prefix + propertyName;
        if (document.body.style[k] !== void 0) {
          return prefix;
        }
      }
      return '';
    };

    return BrowserSupport;

  })();

  Animation = (function() {

    Animation.index = 0;

    function Animation(el, frames, options) {
      var _base, _base1;
      this.el = el;
      this.frames = frames != null ? frames : {};
      this.options = options != null ? options : {};
      this._keyframes = __bind(this._keyframes, this);

      this.start = __bind(this.start, this);

      (_base = this.options).tween || (_base.tween = TweenLinear);
      (_base1 = this.options).duration || (_base1.duration = 1000);
    }

    Animation.prototype.start = function() {
      var animation, k, keyframes, name, prefix, property, propertyName, style, v, _results;
      name = "anim_" + Animation.index;
      Animation.index += 1;
      keyframes = this._keyframes(name);
      style = document.createElement('style');
      style.innerHTML = keyframes;
      document.head.appendChild(style);
      animation = {
        name: name,
        duration: this.options.duration + 'ms',
        timingFunction: 'linear',
        fillMode: 'forwards'
      };
      _results = [];
      for (k in animation) {
        v = animation[k];
        property = "animation-" + k;
        prefix = BrowserSupport.prefixFor(property);
        propertyName = prefix + "Animation" + k.substring(0, 1).toUpperCase() + k.substring(1);
        _results.push(this.el.style[propertyName] = v);
      }
      return _results;
    };

    Animation.prototype._keyframes = function(name) {
      var args, css, dValue, frame0, frame1, isTransform, k, newValue, oldValue, properties, step, t, transform, unit, v, value;
      this.options.tween.init();
      step = 0.001;
      frame0 = this.frames[0];
      frame1 = this.frames[100];
      css = "@" + (BrowserSupport.keyframes()) + " " + name + " {\n";
      while (args = this.options.tween.next(step)) {
        t = args[0], v = args[1];
        transform = '';
        properties = {};
        for (k in frame1) {
          value = frame1[k];
          value = parseFloat(value);
          oldValue = frame0[k] || 0;
          dValue = value - oldValue;
          newValue = oldValue + (dValue * v);
          unit = '';
          isTransform = false;
          if (k === 'translateX' || k === 'translateY' || k === 'translateZ') {
            unit = 'px';
            isTransform = true;
          } else if (k === 'rotateX' || k === 'rotateY' || k === 'rotateZ') {
            unit = 'deg';
            isTransform = true;
          } else if (k === 'scaleX' || k === 'scaleY' || k === 'scale') {
            isTransform = true;
          }
          if (isTransform) {
            transform += "" + k + "(" + newValue + unit + ") ";
          } else {
            properties[k] = newValue;
          }
        }
        css += "" + (t * 100) + "% {\n";
        if (transform) {
          css += "" + (BrowserSupport.transform()) + ": " + transform + ";\n";
        }
        for (k in properties) {
          v = properties[k];
          css += "" + k + ": " + v + ";\n";
        }
        css += " }\n";
        if (t >= 1) {
          break;
        }
      }
      css += "}\n";
      return css;
    };

    return Animation;

  })();

  Graph = (function() {

    function Graph(canvas) {
      this._drawCurve = __bind(this._drawCurve, this);

      this.draw = __bind(this.draw, this);
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.r = window.devicePixelRatio || 1;
      if (this.r) {
        canvas.width = canvas.width * this.r;
        canvas.height = canvas.height * this.r;
        canvas.style[BrowserSupport.prefixFor('transform-origin') + 'TransformOrigin'] = "0 0";
        canvas.style[BrowserSupport.prefixFor('transform') + 'Transform'] = 'scale(' + (1 / this.r) + ')';
      }
    }

    Graph.prototype.draw = function() {
      var args, color, colorI, colors, defaultColor, graphes, h, i, points, r, step, w, _i, _j, _len, _name, _ref, _results;
      r = window.devicePixelRatio;
      w = this.canvas.width;
      h = this.canvas.height;
      step = 0.001;
      this.ctx.clearRect(0, 0, w, h);
      this.ctx.strokeStyle = 'gray';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0.67 * h);
      this.ctx.lineTo(w, 0.67 * h);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0.34 * h);
      this.ctx.lineTo(w, 0.34 * h);
      this.ctx.stroke();
      this.tween.init();
      graphes = [];
      while (args = this.tween.next(step)) {
        for (i = _i = 1, _ref = args.length; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
          graphes[_name = i - 1] || (graphes[_name] = []);
          points = graphes[i - 1];
          points.push([args[0], args[i]]);
        }
        if (args[0] >= 1) {
          break;
        }
      }
      colors = ['red', 'rgba(0, 0, 255, .3)', 'rgba(0, 255, 0, .3)', 'rgba(0, 255, 255, .3)', 'rgba(255, 255, 0, .3)'];
      defaultColor = 'rgba(0, 0, 0, .3)';
      colorI = 0;
      _results = [];
      for (_j = 0, _len = graphes.length; _j < _len; _j++) {
        points = graphes[_j];
        color = defaultColor;
        if (colorI < colors.length) {
          color = colors[colorI];
        }
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this._drawCurve(points);
        if (colorI === 0) {
          this.ctx.lineWidth = 2 * r;
        } else {
          this.ctx.lineWidth = 1 * r;
        }
        this.ctx.stroke();
        _results.push(colorI += 1);
      }
      return _results;
    };

    Graph.prototype._drawCurve = function(points) {
      var h, point, r, t, v, w, _i, _len, _results;
      r = window.devicePixelRatio;
      w = this.canvas.width;
      h = this.canvas.height;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        t = point[0], v = point[1];
        if (t === 0) {
          _results.push(this.ctx.moveTo(t * w, h - ((0.33 + (v * 0.33)) * h)));
        } else {
          _results.push(this.ctx.lineTo(t * w, h - ((0.33 + (v * 0.33)) * h)));
        }
      }
      return _results;
    };

    return Graph;

  })();

  UISlider = (function() {

    function UISlider(options) {
      var _base, _base1;
      this.options = options != null ? options : {};
      this._windowMouseUp = __bind(this._windowMouseUp, this);

      this._windowMouseMove = __bind(this._windowMouseMove, this);

      this._controlMouseDown = __bind(this._controlMouseDown, this);

      this._updateLeftFromValue = __bind(this._updateLeftFromValue, this);

      this.value = __bind(this.value, this);

      (_base = this.options).min || (_base.min = 0);
      (_base1 = this.options).max || (_base1.max = 1000);
      if (this.options.value === void 0) {
        this.options.value = 10;
      }
      this.width = 200 - 10;
      this.el = document.createElement('div');
      this.label = document.createElement('label');
      this.label.innerHTML = this.options.property;
      this.valueEl = document.createElement('div');
      this.valueEl.classList.add('value');
      this.valueEl.classList.add(options.property);
      this.slider = document.createElement('div');
      this.slider.classList.add('slider');
      this.slider.classList.add(options.property);
      this.bar = document.createElement('div');
      this.bar.classList.add('bar');
      this.control = document.createElement('div');
      this.control.classList.add('control');
      this.slider.appendChild(this.bar);
      this.slider.appendChild(this.control);
      this.el.appendChild(this.label);
      this.el.appendChild(this.valueEl);
      this.el.appendChild(this.slider);
      this.valueEl.innerHTML = this.options.value;
      this._updateLeftFromValue();
      this.control.addEventListener('mousedown', this._controlMouseDown);
    }

    UISlider.prototype.value = function() {
      return this.options.value;
    };

    UISlider.prototype._updateLeftFromValue = function() {
      return this.control.style.left = (this.options.value - this.options.min) / (this.options.max - this.options.min) * this.width + "px";
    };

    UISlider.prototype._controlMouseDown = function(e) {
      this.dragging = true;
      this.startPoint = [e.pageX, e.pageY];
      this.startLeft = parseInt(this.control.style.left || 0);
      window.addEventListener('mousemove', this._windowMouseMove);
      return window.addEventListener('mouseup', this._windowMouseUp);
    };

    UISlider.prototype._windowMouseMove = function(e) {
      var dX, newLeft;
      if (!this.dragging) {
        return;
      }
      dX = e.pageX - this.startPoint[0];
      newLeft = this.startLeft + dX;
      if (newLeft > this.width) {
        newLeft = this.width;
      } else if (newLeft < 0) {
        newLeft = 0;
      }
      this.options.value = Math.round(newLeft / this.width * (this.options.max - this.options.min) + this.options.min);
      this.valueEl.innerHTML = this.options.value;
      if (typeof this.onUpdate === "function") {
        this.onUpdate();
      }
      return this.control.style.left = newLeft + "px";
    };

    UISlider.prototype._windowMouseUp = function(e) {
      this.dragging = false;
      window.removeEventListener('mousemove', this._windowMouseMove);
      return window.removeEventListener('mouseup', this._windowMouseUp);
    };

    return UISlider;

  })();

  document.addEventListener("DOMContentLoaded", function() {
    var aTweenClass, animate, animateToRight, animationTimeout, createTweenOptions, graph, option, select, slider, sliders, tween, tweenClass, tweenClasses, update, valuesFromURL, _i, _j, _len, _len1,
      _this = this;
    tweenClasses = [TweenGravity, TweenSpring];
    select = document.querySelector('select.tweens');
    tweenClass = tweenClasses[0];
    for (_i = 0, _len = tweenClasses.length; _i < _len; _i++) {
      aTweenClass = tweenClasses[_i];
      option = document.createElement('option');
      option.innerHTML = aTweenClass.tweenName;
      option.value = aTweenClass.name;
      select.appendChild(option);
    }
    select.addEventListener('change', function() {
      var name;
      name = select.options[select.selectedIndex].value;
      tweenClass = eval("" + name);
      createTweenOptions();
      return update();
    });
    graph = new Graph(document.querySelector('canvas'));
    sliders = [];
    valuesFromURL = function() {
      var arg, k, query, url, v, values, _j, _len1, _ref, _ref1;
      url = (document.location.toString() || '').split('#');
      values = {};
      if (url.length > 1) {
        query = url[1];
        _ref = query.split(',');
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          arg = _ref[_j];
          _ref1 = arg.split('='), k = _ref1[0], v = _ref1[1];
          values[k] = v;
        }
      }
      return values;
    };
    createTweenOptions = function() {
      var config, property, slider, tweenOptionsEl, values, _ref, _results;
      tweenOptionsEl = document.querySelector('.tweenOptions');
      tweenOptionsEl.innerHTML = '';
      values = valuesFromURL();
      sliders = [];
      _ref = tweenClass.properties;
      _results = [];
      for (property in _ref) {
        config = _ref[property];
        slider = new UISlider({
          min: config.min,
          max: config.max,
          value: values[property] || config["default"],
          property: property
        });
        tweenOptionsEl.appendChild(slider.el);
        _results.push(sliders.push(slider));
      }
      return _results;
    };
    this.durationSlider = new UISlider({
      min: 100,
      max: 4000,
      value: valuesFromURL().duration || 1000,
      property: 'duration'
    });
    document.querySelector('.animationOptions').appendChild(this.durationSlider.el);
    animationTimeout = null;
    tween = function() {
      var options, slider, _j, _len1;
      options = {};
      for (_j = 0, _len1 = sliders.length; _j < _len1; _j++) {
        slider = sliders[_j];
        options[slider.options.property] = slider.value();
      }
      return new tweenClass(options);
    };
    animateToRight = true;
    animate = function() {
      var anim;
      anim = new Animation(document.querySelector('div.circle'), {
        0: {
          translateX: animateToRight ? 0 : 350
        },
        100: {
          translateX: animateToRight ? 350 : 0
        }
      }, {
        tween: tween(),
        duration: _this.durationSlider.value()
      });
      animateToRight = !animateToRight;
      return anim.start();
    };
    update = function() {
      var args, argsString, currentURL, k, slider, v, _j, _len1;
      args = {};
      for (_j = 0, _len1 = sliders.length; _j < _len1; _j++) {
        slider = sliders[_j];
        args[slider.options.property] = slider.value();
      }
      argsString = '';
      for (k in args) {
        v = args[k];
        if (argsString !== '') {
          argsString += ",";
        }
        argsString += "" + k + "=" + v;
      }
      currentURL = (document.location.toString() || '').split('#')[0];
      document.location = currentURL + "#" + argsString;
      graph.tween = tween();
      graph.draw();
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
      return animationTimeout = setTimeout(animate, 200);
    };
    this.durationSlider.onUpdate = update;
    createTweenOptions();
    for (_j = 0, _len1 = sliders.length; _j < _len1; _j++) {
      slider = sliders[_j];
      slider.onUpdate = update;
    }
    update();
    return document.querySelector('div.circle').addEventListener('click', animate);
  }, false);

}).call(this);

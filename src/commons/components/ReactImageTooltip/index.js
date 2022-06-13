/* eslint-disable */

// https://github.com/Jezfx/react-image-tooltip
// をそのままコピーし、一部改変したもの。
'use strict';

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

var randomString = function randomString(len) {
  var charSet =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : 'abcdefghijklmnopqrstuvwxyz';

  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
};

var createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass,
    );
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    );
  }

  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
};

var ReactImageTooltip = (function (_Component) {
  inherits(ReactImageTooltip, _Component);

  function ReactImageTooltip() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, ReactImageTooltip);

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return (
      (_ret =
        ((_temp =
          ((_this = possibleConstructorReturn(
            this,
            (_ref =
              ReactImageTooltip.__proto__ ||
              Object.getPrototypeOf(ReactImageTooltip)).call.apply(
              _ref,
              [this].concat(args),
            ),
          )),
          _this)),
        (_this.state = {
          display: false,
          clientX: 0,
          clientY: 0,
        }),
        (_this.uniqueClassName = randomString(4)),
        (_this.toogleImage = function () {
          _this.setState(function (prevState) {
            return {
              display: !prevState.display,
            };
          });
        }),
        (_this.handleMouseOver = function (event) {
          var clientX = event.clientX,
            clientY = event.clientY;

          _this.setState({
            clientX: clientX,
            clientY: clientY,
            display: true,
          });
        }),
        _temp)),
      possibleConstructorReturn(_this, _ret)
    );
  }

  createClass(ReactImageTooltip, [
    {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props = this.props,
          children = _props.children,
          image = _props.image,
          width = _props.width,
          height = _props.height;
        var _state = this.state,
          display = _state.display,
          clientY = _state.clientY,
          clientX = _state.clientX;

        return React__default.createElement(
          React__default.Fragment,
          null,
          React__default.createElement('style', {
            dangerouslySetInnerHTML: {
              __html:
                '\n            .' +
                this.uniqueClassName +
                ':after {\n              visibility: ' +
                (display ? 'visible' : 'hidden') +
                ';\n              opacity: ' +
                (display ? '1' : '0') +
                ';\n              top: ' +
                clientY +
                'px;\n              left: ' +
                clientX +
                'px;\n            }\n          ',
            },
          }),
          React__default.createElement('style', {
            dangerouslySetInnerHTML: {
              __html:
                '\n            .' +
                this.uniqueClassName +
                ':after {\n              background-image: url(' +
                image +
                ');\n              width: ' +
                (width ? width + 'px' : '300px') +
                ';\n              height: ' +
                (height ? height + 'px' : '100%') +
                ';\n              pointer-events: none;\n              position: fixed;\n              background-size: contain;\n              background-repeat: no-repeat;\n              z-index: 10000;\n              content: "";\n            }\n          }\n          ',
            },
          }),
          React__default.createElement(
            'span',
            {
              onMouseEnter: function onMouseEnter() {
                return _this2.toogleImage();
              },
              onMouseLeave: function onMouseLeave() {
                return _this2.toogleImage();
              },
              onMouseMoveCapture: this.handleMouseOver,
              onTouchStart: function onTouchStart() {
                return _this2.setState({ display: false });
              },
              className: this.uniqueClassName,
            },
            children,
          ),
        );
      },
    },
  ]);
  return ReactImageTooltip;
})(React.Component);

ReactImageTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  image: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

module.exports = ReactImageTooltip;
//# sourceMappingURL=index.js.map

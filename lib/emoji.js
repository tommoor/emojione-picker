'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _emojione = require('emojione');

var _emojione2 = _interopRequireDefault(_emojione);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Emoji = _react2.default.createClass({
  displayName: 'Emoji',

  propTypes: {
    onKeyUp: _react2.default.PropTypes.func,
    onClick: _react2.default.PropTypes.func,
    useNative: _react2.default.PropTypes.bool,
    ariaLabel: _react2.default.PropTypes.string,
    name: _react2.default.PropTypes.string,
    shortname: _react2.default.PropTypes.string,
    title: _react2.default.PropTypes.string,
    role: _react2.default.PropTypes.string
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasn't changed
    return nextProps.shortname !== this.props.shortname;
  },

  createMarkup: function createMarkup() {
    return { __html: this.props.useNative ? _emojione2.default.shortnameToUnicode(this.props.shortname) : _emojione2.default.shortnameToImage(this.props.shortname)
    };
  },

  render: function render() {
    return _react2.default.createElement('div', {
      onKeyUp: this.props.onKeyUp,
      onClick: this.props.onClick,
      tabIndex: '0',
      className: 'emoji',
      'aria-label': this.props.ariaLabel,
      title: this.props.name,
      role: this.props.role,
      dangerouslySetInnerHTML: this.createMarkup()
    });
  }
});

module.exports = Emoji;
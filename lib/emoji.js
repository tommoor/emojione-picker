"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require("react");
var emojione = require("emojione");

var Emoji = React.createClass({
  displayName: "Emoji",

  propTypes: {
    onClick: React.PropTypes.func
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasnt changed
    return nextProps.shortname != this.props.shortname;
  },

  createMarkup: function createMarkup() {
    return { __html: emojione.shortnameToImage(this.props.shortname) };
  },

  render: function render() {
    var _props = this.props;
    var name = _props.name;
    var role = _props.role;
    var ariaLabel = _props.ariaLabel;

    var rest = _objectWithoutProperties(_props, ["name", "role", "ariaLabel"]);

    var extraProps = {};
    for (var key in rest) {
      if (rest[key]) {
        var prop = "data-" + key.replace('_', '-');
        extraProps[prop] = rest[key];
      }
    }
    return React.createElement("div", _extends({}, extraProps, { onClick: this.props.onClick, tabIndex: "0", className: "emoji",
      title: name,
      role: role,
      "aria-label": ariaLabel,
      dangerouslySetInnerHTML: this.createMarkup() }));
  }
});

module.exports = Emoji;
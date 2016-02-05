var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var emojione = require("emojione");

var Emoji = React.createClass({
  displayName: "Emoji",

  propTypes: {
    onClick: React.PropTypes.func
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasnt changed
    return nextProps.shortname != this.props.shortname;
  },

  createMarkup: function () {
    return { __html: emojione.shortnameToImage(this.props.shortname) };
  },

  render: function () {
    return React.createElement("div", _extends({}, this.props, { onClick: this.props.onClick, tabIndex: "0", className: "emoji",
      title: this.props.name,
      dangerouslySetInnerHTML: this.createMarkup() }));
  }
});

module.exports = Emoji;
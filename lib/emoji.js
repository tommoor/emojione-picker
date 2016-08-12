"use strict";

var React = require("react");
var emojione = require("emojione");

var Emoji = React.createClass({
  displayName: "Emoji",

  propTypes: {
    onKeyUp: React.PropTypes.func,
    onClick: React.PropTypes.func,
    ariaLabel: React.PropTypes.string,
    name: React.PropTypes.string,
    shortname: React.PropTypes.string,
    title: React.PropTypes.string,
    role: React.PropTypes.string
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasn't changed
    return nextProps.shortname != this.props.shortname;
  },

  createMarkup: function createMarkup() {
    return { __html: emojione.shortnameToImage(this.props.shortname) };
  },

  render: function render() {
    return React.createElement("div", {
      onKeyUp: this.props.onKeyUp,
      onClick: this.props.onClick,
      tabIndex: "0",
      className: "emoji",
      "aria-label": this.props.ariaLabel,
      title: this.props.name,
      role: this.props.role,
      dangerouslySetInnerHTML: this.createMarkup()
    });
  }
});

module.exports = Emoji;
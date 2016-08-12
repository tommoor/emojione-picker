"use strict";

var React = require("react");

var Modifier = React.createClass({
  displayName: "Modifier",

  propTypes: {
    onKeyUp: React.PropTypes.func,
    onClick: React.PropTypes.func,
    active: React.PropTypes.bool,
    hex: React.PropTypes.string
  },

  render: function render() {
    return React.createElement("a", {
      onKeyUp: this.props.onKeyUp,
      onClick: this.props.onClick,
      className: this.props.active ? "modifier active" : "modifier",
      style: { background: this.props.hex }
    });
  }
});

module.exports = Modifier;
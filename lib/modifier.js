"use strict";

var React = require("react");

var Modifier = React.createClass({
  displayName: "Modifier",

  propTypes: {
    onClick: React.PropTypes.func
  },

  render: function render() {
    return React.createElement("a", { onClick: this.props.onClick, className: this.props.active ? "modifier active" : "modifier", style: { background: this.props.hex } });
  }
});

module.exports = Modifier;
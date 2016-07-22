var React = require("react");

var Modifier = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },

  render: function() {
    return <a onClick={this.props.onClick} className={this.props.active ? "modifier active" : "modifier"} style={{background: this.props.hex}}></a>;
  }
});

module.exports = Modifier;

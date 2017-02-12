import React from 'react';

const Modifier = React.createClass({
  propTypes: {
    onKeyUp: React.PropTypes.func,
    onClick: React.PropTypes.func,
    active: React.PropTypes.bool,
    hex: React.PropTypes.string
  },

  render: function() {
    return (
      <a
        onKeyUp={this.props.onKeyUp}
        onClick={this.props.onClick}
        className={this.props.active ? "modifier active" : "modifier"}
        style={{background: this.props.hex}}
      />
    );
  }
});


module.exports = Modifier;

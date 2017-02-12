import React, { Component } from "react";

export default class Modifier extends Component {
  static propTypes = {
    onClick: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool,
    type: React.PropTypes.string.isRequired,
    hex: React.PropTypes.string.isRequired
  };

  _handleClick = ev => {
    this.props.onClick(ev, this.props.type);
  };

  render() {
    return (
      <a
        onClick={this._handleClick}
        className={this.props.active ? "modifier active" : "modifier"}
        style={{ background: this.props.hex }}
        aria-label={`Fitzpatrick type ${this.props.type}`}
      />
    );
  }
}

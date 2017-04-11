import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Modifier extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
    type: PropTypes.string.isRequired,
    hex: PropTypes.string.isRequired
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

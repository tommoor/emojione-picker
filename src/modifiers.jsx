import React, { Component } from "react";
import PropTypes from "prop-types";
import map from "lodash/map";
import Modifier from "./modifier";

export default class Modifiers extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    modifiers: PropTypes.object,
    active: PropTypes.string
  };

  static defaultProps = {
    active: 0,
    modifiers: {
      0: "#FFDE5C",
      1: "#FFE1BB",
      2: "#FFD0A9",
      3: "#D7A579",
      4: "#B57D52",
      5: "#8B6858"
    }
  };

  _handleModifierClick = (ev, index) => {
    this.props.onChange(index);
  };

  render() {
    return (
      <ol className="modifiers">
        {map(this.props.modifiers, (hex, type) => (
          <li key={type}>
            <Modifier
              hex={hex}
              type={type}
              active={this.props.active === type}
              onClick={this._handleModifierClick}
            />
          </li>
        ))}
      </ol>
    );
  }
}

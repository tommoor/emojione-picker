import React, { Component } from "react";
import emojione from "emojione";

export default class Emoji extends Component {
  static propTypes = {
    ariaLabel: React.PropTypes.string,
    name: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired,
    shortname: React.PropTypes.string,
    title: React.PropTypes.string,
    role: React.PropTypes.string
  };

  shouldComponentUpdate(nextProps) {
    // avoid rerendering the Emoji component if the shortname hasn't changed
    return nextProps.shortname !== this.props.shortname;
  }

  createMarkup() {
    return { __html: emojione.shortnameToImage(this.props.shortname) };
  }

  _onKeyUp = ev => {
    ev.preventDefault();
    if (ev.key === "Enter" || ev.key === " ") {
      this.props.onSelect();
    }
  };

  _onClick = () => {
    this.props.onSelect();
  };

  render() {
    return (
      <div
        onKeyUp={this._onKeyUp}
        onClick={this._onClick}
        tabIndex="0"
        className="emoji"
        aria-label={this.props.ariaLabel}
        title={this.props.name}
        role={this.props.role}
        dangerouslySetInnerHTML={this.createMarkup()}
      />
    );
  }
}

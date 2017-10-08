import React, { Component } from "react";
import PropTypes from "prop-types";
import pick from "lodash/pick";
import emojione from "emojione";

export default class Emoji extends Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    name: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    shortname: PropTypes.string,
    title: PropTypes.string,
    role: PropTypes.string
  };

  shouldComponentUpdate(nextProps) {
    // avoid rerendering the Emoji component if the shortname hasn't changed
    return nextProps.shortname !== this.props.shortname;
  }

  createMarkup() {
    return { __html: emojione.shortnameToImage(this.props.shortname) };
  }

  _handleKeyUp = ev => {
    ev.preventDefault();
    if (ev.key === "Enter" || ev.key === " ") {
      this._handleClick(ev);
    }
  };

  _handleClick = ev => {
    this.props.onSelect(
      ev,
      pick(
        this.props,
        "shortname",
        "aliases",
        "aliases_ascii",
        "category",
        "name",
        "shortcode",
        "unicode",
        "unicode_alternates",
        "keywords"
      )
    );
  };

  render() {
    return (
      <div
        onKeyUp={this._handleKeyUp}
        onClick={this._handleClick}
        tabIndex={0}
        className="emoji"
        aria-label={this.props.ariaLabel}
        title={this.props.name}
        role={this.props.role}
        dangerouslySetInnerHTML={this.createMarkup()}
      />
    );
  }
}

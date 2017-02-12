import React from 'react';
import emojione from 'emojione';

const Emoji = React.createClass({
  propTypes: {
    ariaLabel: React.PropTypes.string,
    name: React.PropTypes.string,
    onSelect: React.PropTypes.func.isRequired,
    shortname: React.PropTypes.string,
    title: React.PropTypes.string,
    role: React.PropTypes.string
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasn't changed
    return nextProps.shortname !== this.props.shortname;
  },

  createMarkup: function() {
    return {__html: emojione.shortnameToImage(this.props.shortname)};
  },

  render: function() {
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
  },

  _onKeyUp: function(e) {
    e.preventDefault();
    if (e.key === 'Enter' || e.key === ' ') {
      this.props.onSelect();
    }
  },

  _onClick: function() {
    this.props.onSelect();
  },
});

module.exports = Emoji;

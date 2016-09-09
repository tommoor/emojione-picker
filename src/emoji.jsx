import React from 'react';
import emojione from 'emojione';

const Emoji = React.createClass({
  propTypes: {
    onKeyUp: React.PropTypes.func,
    onClick: React.PropTypes.func,
    useNative: React.PropTypes.bool,
    ariaLabel: React.PropTypes.string,
    name: React.PropTypes.string,
    shortname: React.PropTypes.string,
    title: React.PropTypes.string,
    role: React.PropTypes.string
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasn't changed
    return nextProps.shortname !== this.props.shortname;
  },

  createMarkup: function() {
    return {__html:
      this.props.useNative
        ? emojione.shortnameToUnicode(this.props.shortname)
        : emojione.shortnameToImage(this.props.shortname)
    };
  },

  render: function() {
    return (
      <div
        onKeyUp={this.props.onKeyUp}
        onClick={this.props.onClick}
        tabIndex="0"
        className="emoji"
        aria-label={this.props.ariaLabel}
        title={this.props.name}
        role={this.props.role}
        dangerouslySetInnerHTML={this.createMarkup()}
      />
    );
  }
});

module.exports = Emoji;

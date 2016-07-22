var React = require("react");
var emojione = require("emojione");

var Emoji = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasnt changed
    return nextProps.shortname != this.props.shortname;
  },

  createMarkup: function() {
    return {__html: emojione.shortnameToImage(this.props.shortname)};
  },

  render: function() {
    const { name, role, ariaLabel, ...rest } = this.props;
    var extraProps = {};
    for (var key in rest) {
        if (rest[key]) {
            var prop = "data-" + key.replace('_', '-');
            extraProps[prop] = rest[key];
        }
    }
    return <div {...extraProps} onClick={this.props.onClick} tabIndex="0" className="emoji"
                title={name}
                role={role}
                aria-label={ariaLabel}
                dangerouslySetInnerHTML={this.createMarkup()}>
    </div>
  }
});

module.exports = Emoji;

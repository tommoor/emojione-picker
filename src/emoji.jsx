var React = require("react");
var emojione = require("emojione");

var Emoji = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    useNative: React.PropTypes.bool,
  },
  
  shouldComponentUpdate: function(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasnt changed
    return nextProps.shortname != this.props.shortname;
  },
  
  createMarkup: function() {
    return {__html:
      this.props.useNative
        ? emojione.shortnameToUnicode(this.props.shortname)
        : emojione.shortnameToImage(this.props.shortname)
    };
  },
  
  render: function() {
    return <div {...this.props} onClick={this.props.onClick} tabIndex="0" className="emoji" 
                title={this.props.name} 
                dangerouslySetInnerHTML={this.createMarkup()}>
    </div>
  }
});

module.exports = Emoji;

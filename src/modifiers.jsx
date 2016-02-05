var React = require("react");
var Modifier = require("./modifier");
var _ = require("underscore");

var Modifiers = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      active: 0,
      modifiers: {
        0: '#FFDE5C',
        1: '#FFE1BB',
        2: '#FFD0A9',
        3: '#D7A579',
        4: '#B57D52',
        5: '#8B6858'
      }
    }
  },
  
  render: function() {
    var list = [];
    var onChange = this.props.onChange;
    
    _.each(this.props.modifiers, function(hex, index){
      list.push(<li key={index}><Modifier hex={hex} active={this.props.active == index} onClick={function(){
        onChange(index);
      }} /></li>);
    }.bind(this));
    
    return <ol className="modifiers">{list}</ol>;
  }
});

module.exports = Modifiers;
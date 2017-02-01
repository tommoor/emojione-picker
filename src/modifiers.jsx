import React from 'react';
import Modifier from './modifier';
import each from 'lodash/each';

const Modifiers = React.createClass({
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
    const list = [];
    const onChange = this.props.onChange;

    each(this.props.modifiers, (hex, index) => {
      list.push(<li key={index}><Modifier hex={hex} active={this.props.active === index} onClick={function(){
        onChange(index);
      }} /></li>);
    });

    return <ol className="modifiers">{list}</ol>;
  }
});

module.exports = Modifiers;

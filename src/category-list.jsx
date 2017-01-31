import React, {PropTypes, Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Emoji from './emoji';

const style = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

const listItemStyle = {
  borderRadius: 4,
  boxSizing: 'border-box',
  display: 'inline-block',
  width: 32,
  height: 32,
  padding: 4,
};

export default class CategoryList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <ul className="emoji-category-list" style={style}>
        {this.props.emojis.map(emoji => this._renderEmoji(emoji))}
      </ul>
    )
  }

  _renderEmoji(emoji) {
    const {onChange} = this.props;

    return (
      <li key={emoji.unicode} style={listItemStyle}>
        <Emoji
          {...emoji}
          ariaLabel={emoji.name}
          role="option"
          onClick={function(e) {
            onChange(emoji);
          }}
          onKeyUp={function(e) {
            e.preventDefault();
            if (e.which === 13 || e.which === 32) {
              onChange(emoji);
            }
          }}
        />
      </li>
    );
  }
}

CategoryList.propTypes = {
  emojis: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    unicode: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};

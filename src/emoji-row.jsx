import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import Emoji from './emoji';

export default class EmojiRow extends Component {
  static propTypes = {
    emojis: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {emojis, onChange, style} = this.props;

    return (
      <div className="emoji-row" style={style}>
        {emojis.map(emoji => {
          return (
            <Emoji
              {...emoji}
              ariaLabel={emoji.name}
              role="option"
              key={emoji.unicode}
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
          );
        })}
      </div>
    );
  }
}

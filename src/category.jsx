import React, {PropTypes, Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CategoryList from './category-list';

const baseStyle = {
  boxSizing: 'border-box',
  overflowY: 'hidden',
  paddingLeft: 10,
  marginBottom: 6,
};

const toolbarStyle = {
  display: 'table',
  margin: '4 0 10',
  width: '100%',
};

const headingStyle = {
  boxSizing: 'border-box',
  color: '#444',
  display: 'table-cell',
  fontSize: 18,
  fontFamily: 'sans-serif',
  fontWeight: 'normal',
};

const headingDecorationStyle = {
  display: 'table-cell',
  textAlign: 'right',
  verticalAlign: 'middle',
};

class Category extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {category, emojis, headingDecoration, onChange} = this.props;
    const style =  {
      ...baseStyle,
      ...this.props.style,
    };

    return (
      <div className="emoji-category" ref={this._setRef} style={style}>
        <div style={toolbarStyle}>
          <h2
            ref={category.title}
            className="emoji-category-header"
            style={headingStyle}
          >
            {category.title}
          </h2>
          <div style={headingDecorationStyle}>
            {headingDecoration}
          </div>
        </div>
        <CategoryList
          emojis={emojis}
          onChange={onChange}
        />
      </div>
    );
  }

  _setRef = (ref) => {
    this.ref = ref;
  }

  getOffsetTop() {
    return this.ref.offsetTop;
  }
}

Category.propTypes = {
  category: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  emojis: PropTypes.arrayOf(PropTypes.object).isRequired,
  headingDecoration: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
};

module.exports = Category;

import React, {PropTypes, Component} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import CategoryList from './category-list';

class Category extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {category, emojis, headingDecoration, onChange, style} = this.props;

    return (
      <div className="emoji-category" ref={this._setRef} style={style}>
        <div className="emoji-category-toolbar">
          <h2 className="emoji-category-header">
            {category.title}
          </h2>
          <div className="emoji-category-heading-decoration">
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

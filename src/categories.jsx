import React, {PropTypes, Component} from 'react';
import {AutoSizer, List} from 'react-virtualized';
import {findIndex, throttle} from 'lodash';
import Category from './category';
import Modifiers from './modifiers';

const CATEGORY_MARGIN_BOTTOM = 6;
const EMOJI_PER_ROW = 8;
const HEADER_HEIGHT = 35;
const ROW_HEIGHT = 32;

class Categories extends Component {
  constructor(props, context) {
    super(props, context);

    this.lastActiveCategory = null;
    this.categories = {};
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.categories !== prevProps.categories ||
      this.props.modifier !== prevProps.modifier
    ) {
      this.list.recomputeRowHeights();
    }
  }

  render() {
    const rowCount = this.props.categories.length;

    return (
      <AutoSizer>
        {({height, width}) => (
          <List
            estimatedRowSize={800}
            height={height}
            onScroll={this._onScroll}
            overscanRowCount={1}
            ref={this._setListRef}
            rowCount={rowCount}
            rowHeight={this._rowHeight}
            rowRenderer={this._rowRenderer}
            scrollToAlignment="start"
            tabIndex={null}
            width={width}
          />
        )}
      </AutoSizer>
    );
  }

  _onScroll = throttle(({scrollTop}) => {
    const activeCategory = this._getActiveCategory(scrollTop);
    if (activeCategory !== this.lastActiveCategory) {
      this.lastActiveCategory = activeCategory;
      this.props.onActiveCategoryChange(activeCategory);
    }
  }, 100)

  _setListRef = list => {
    this.list = list;
  }

  getActiveCategory() {
    return this._getActiveCategory();
  }

  _getActiveCategory(scrollTop = 0) {
    const {categories} = this.props;
    const activeCategoryProps = categories
      .slice()
      .reverse()
      .find(({id}) => {
        const ref = this.categories[id];
        return ref && scrollTop >= ref.getOffsetTop();
      });

    if (activeCategoryProps) {
      return activeCategoryProps.id;
    }

    if (categories.length > 0) {
      return categories[0].id;
    }
  }

  _rowHeight = ({index}) => {
    const categoryEmojiCount = this.props.categories[index].emojis.length;
    const rowCount = Math.ceil(categoryEmojiCount / EMOJI_PER_ROW);

    return HEADER_HEIGHT + (rowCount * ROW_HEIGHT) + CATEGORY_MARGIN_BOTTOM;
  }

  _rowRenderer = ({key, index, style}) => {
    const {category, emojis, id} = this.props.categories[index];

    const attributes = {
      key,
      category,
      emojis,
      onChange: this.props.onChange,
      ref: this._setCategoryRef(id),
      style,
    };

    if (index === 0) {
      const {modifier, onModifierChange} = this.props;

      attributes.headingDecoration = (
        <Modifiers
          active={modifier}
          onChange={onModifierChange}
        />
      );
    }

    return (
      <Category {...attributes} />
    );
  }

  _setCategoryRef(id) {
    return category => {
      this.categories[id] = category;
    }
  }

  jumpToCategory(id) {
    const index = findIndex(this.props.categories, category => category.id === id);
    this.list.scrollToRow(index);
  }
}

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.object.isRequired,
    emojis: PropTypes.arrayOf(PropTypes.object).isRequired,
    id: PropTypes.string.isRequired,
  })).isRequired,
  modifier: PropTypes.string.isRequired,
  onActiveCategoryChange: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onModifierChange: PropTypes.func.isRequired,
};

module.exports = Categories;

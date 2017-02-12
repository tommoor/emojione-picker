import React, {PropTypes, Component} from 'react';
import {AutoSizer, List} from 'react-virtualized';
import findIndex from 'lodash/findIndex';
import throttle from 'lodash/throttle';
import CategoryHeader from './category-header';
import EmojiRow from './emoji-row';
import Modifiers from './modifiers';

// These height values must be kept in sync with the heights
// (margin + padding + content height) defined in CSS.
const CATEGORY_HEADER_ROW_HEIGHT = 46;
const EMOJI_ROW_HEIGHT = 32;

export default class Categories extends Component {
  static propTypes = {
    rows: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        category: PropTypes.object.isRequired,
        id: PropTypes.string.isRequired,
      }),
      PropTypes.arrayOf(PropTypes.object).isRequired,
    ])).isRequired,
    modifier: PropTypes.string.isRequired,
    onActiveCategoryChange: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onModifierChange: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.lastActiveCategory = null;
    this.categories = {};
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.rows !== prevProps.rows ||
      this.props.modifier !== prevProps.modifier
    ) {
      this.list.recomputeRowHeights();
    }
  }

  render() {
    const rowCount = this.props.rows.length;

    return (
      <AutoSizer>
        {({height, width}) => (
          <List
            height={height}
            onScroll={this._onScroll}
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
    const {rows} = this.props;

    if (scrollTop === 0) {
      if (rows.length === 0) return undefined;
      return rows[0].id;
    }

    let firstFullyVisibleRowIndex = 0;
    let accumulatedScrollTop = 0;

    while (accumulatedScrollTop < scrollTop) {
      accumulatedScrollTop += this._rowHeight({index: firstFullyVisibleRowIndex});

      if (accumulatedScrollTop <= scrollTop) {
        firstFullyVisibleRowIndex +=1;
      }
    }

    const currentRow = this.props.rows[firstFullyVisibleRowIndex];

    if (Array.isArray(currentRow)) {
      return currentRow[0].category;
    }

    return currentRow.id;
  }

  _rowHeight = ({index}) => {
    const row = this.props.rows[index];
    return Array.isArray(row) ? EMOJI_ROW_HEIGHT : CATEGORY_HEADER_ROW_HEIGHT;
  }

  _rowRenderer = ({key, index, style}) => {
    const row = this.props.rows[index];
    const {onChange} = this.props;

    if (Array.isArray(row)) {
      return (
        <EmojiRow
          key={key}
          onChange={onChange}
          style={style}
          emojis={row}
        />
      );
    }

    const {category, id} = row;
    const attributes = {
      key,
      category,
      onChange,
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
      <CategoryHeader {...attributes} />
    );
  }

  _setCategoryRef(id) {
    return category => {
      this.categories[id] = category;
    }
  }

  jumpToCategory(id) {
    const index = findIndex(this.props.rows, category => category.id === id);
    this.list.scrollToRow(index);
  }
}

import React, {PropTypes, Component} from 'react';
import {AutoSizer, CellMeasurer, List} from 'react-virtualized';
import {findIndex, throttle} from 'lodash';
import Category from './category';
import Modifiers from './modifiers';

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
      this.cellMeasurer.resetMeasurements(),
      this.list.recomputeRowHeights();
    }
  }

  render() {
    const rowCount = this.props.categories.length;

    return (
      <AutoSizer>
        {({height, width}) => (
          <CellMeasurer
            cellRenderer={this._cellRenderer}
            columnCount={1}
            ref={this._setCellMeasurerRef}
            rowCount={rowCount}
            width={width}
          >
            {({getRowHeight}) => (
              <List
                estimatedRowSize={800}
                height={height}
                onScroll={this._onScroll}
                overscanRowCount={1}
                ref={this._setListRef}
                rowCount={rowCount}
                rowHeight={getRowHeight}
                rowRenderer={this._rowRenderer}
                scrollToAlignment="start"
                tabIndex={null}
                width={width}
              />
            )}
          </CellMeasurer>
        )}
      </AutoSizer>
    );
  }

  _cellRenderer = ({rowIndex, ...rest}) => {
    return this._rowRenderer({index: rowIndex, ...rest});
  }

  _setCellMeasurerRef = cellMeasurer => {
    this.cellMeasurer = cellMeasurer;
  }

  _setListRef = list => {
    this.list = list;
  }

  _onScroll = throttle(({scrollTop}) => {
    const activeCategory = this._getActiveCategory(scrollTop);
    if (activeCategory !== this.lastActiveCategory) {
      this.lastActiveCategory = activeCategory;
      this.props.onActiveCategoryChange(activeCategory);
    }
  }, 100)

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

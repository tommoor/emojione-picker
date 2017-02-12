import React from 'react';
import Emoji from './emoji';
import strategy from 'emojione/emoji.json';
import emojione from 'emojione';
import store from 'store';
import each from 'lodash/each';
import map from 'lodash/map';
import omit from 'lodash/omit';
import Categories from './categories';
import createRowsSelector from './utils/createRowsSelector';
import createEmojisFromStrategy from './utils/createEmojisFromStrategy';
import {defaultCategories} from './constants';

const Picker = React.createClass({
    propTypes: {
      emojione: React.PropTypes.shape({
        imageType: React.PropTypes.string,
        sprites: React.PropTypes.bool,
        imagePathSVGSprites: React.PropTypes.string
      }),
      search: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string,
      ]),
      className: React.PropTypes.string,
      onChange: React.PropTypes.func.isRequired,
      categories: React.PropTypes.object.isRequired,
    },

    getDefaultProps: function() {
      return {
        search: '',
        categories: defaultCategories,
      }
    },

    getInitialState: function() {
      return {
        modifier: store.get('emoji-modifier') || '0',
        category: false,
        term: this.props.search !== true ? this.props.search : "",
      };
    },

    componentWillMount: function() {
      this.rowsSelector = createRowsSelector();

      each(this.props.emojione, (value, key) => {
        emojione[key] = value;
      });
      this.setState({emojis: createEmojisFromStrategy(strategy)});
    },

    componentDidMount: function() {
      this.setState({category: this.categories.getActiveCategory()});
    },

    componentWillReceiveProps: function(nextProps) {
      if (this.props.search != nextProps.search) {
        this.setState({term: this.props.search});
      }
    },

    _renderHeaderCategories: function() {
      return map(this.props.categories, (details, key) => (
        <li key={key} className={this.state.category === key ? "active" : ""}>
          <Emoji
            id={key}
            role="menuitem"
            aria-label={`${key} category`}
            shortname={`:${details.emoji}:`}
            onSelect={() => {
              this.categories.jumpToCategory(key);
            }}
          />
        </li>
      ));
    },

    _renderCategories: function() {
      const rows = this.rowsSelector(
        this.props.categories,
        this.state.emojis,
        this.state.modifier,
        this.props.search,
        this.state.term,
      );

      return (
        <div className="emoji-categories-wrapper">
          <Categories
            ref={this._setCategoriesRef}
            rows={rows}
            modifier={this.state.modifier}
            onActiveCategoryChange={this._onActiveCategoryChange}
            onChange={this.props.onChange}
            onModifierChange={this._onModifierChange}
          />
        </div>
      );
    },

    _setCategoriesRef(categories) {
      this.categories = categories;
    },

    _onActiveCategoryChange(category) {
      if (category !== this.state.category) {
        this.setState({category});
      }
    },

    _onModifierChange(modifier) {
      this.setState({modifier});
      store.set('emoji-modifier', modifier);
    },

    setFocus: function(e) {
      if (e.target.id === "flags") {
        this.refs[this.state.category].children[0].focus();
      }
    },

    render: function() {
      const props = omit(this.props, Object.keys(Picker.propTypes));
      let classes = 'emoji-dialog';
      if (this.props.search === true) classes += ' with-search';
      if (this.props.className) classes += ` ${this.props.className}`;

      return <div className={classes} role="dialog" {...props}>
        <header className="emoji-dialog-header" role="menu">
          <ul onBlur={this.setFocus}>{this._renderHeaderCategories()}</ul>
        </header>
        {this._renderSearchInput()}
        {this._renderCategories()}
      </div>
    },

    _renderSearchInput() {
      if (this.props.search === true) {
        return <div className="emoji-search-wrapper">
          <input
            className="emoji-search"
            type="search"
            placeholder="Search..."
            ref="search"
            onChange={this._updateSearchTerm}
            autoFocus
          />
        </div>;
      }
    },

    _updateSearchTerm() {
      this.setState({term: this.refs.search.value});
    },
});

module.exports = Picker;

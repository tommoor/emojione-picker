import React, { Component } from "react";
import emojione from "emojione";
import store from "store";
import each from "lodash/each";
import map from "lodash/map";
import omit from "lodash/omit";
import strategy from "emojione/emoji.json";
import Emoji from "./emoji";
import Categories from "./categories";
import createRowsSelector from "./utils/createRowsSelector";
import createEmojisFromStrategy from "./utils/createEmojisFromStrategy";
import { defaultCategories } from "./constants";

export default class Picker extends Component {
  static propTypes = {
    emojione: React.PropTypes.shape({
      imageType: React.PropTypes.string,
      sprites: React.PropTypes.bool,
      imagePathSVGSprites: React.PropTypes.string
    }),
    search: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.string
    ]),
    className: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    categories: React.PropTypes.object
  };

  static defaultProps = {
    search: "",
    categories: defaultCategories
  };

  state = {
    modifier: store.get("emoji-modifier") || "0",
    frequentlyUsed: store.get('emoji-frequently-used') || [],
    category: false,
    term: this.props.search !== true ? this.props.search : ""
  };

  componentWillMount() {
    this.rowsSelector = createRowsSelector();

    each(this.props.emojione, (value, key) => {
      emojione[key] = value;
    });
    this.setState({ emojis: {
        ...createEmojisFromStrategy(strategy),
        ...this.getFromFrequentlyUsed(strategy, this.state.frequentlyUsed) 
      }
    });
  }

  componentDidMount() {
    this.setState({ category: this.categories.getActiveCategory() }); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.search !== nextProps.search) {
      this.setState({ term: this.props.search });
    }
  }

  getFromFrequentlyUsed (strategy, frequentlyUsed) {
    const emojis = {}
    emojis['frequentlyUsed'] = {}

    frequentlyUsed.sort((a, b) => b.used - a.used).slice(0, 21).forEach(frequentlyUsed => {
      emojis['frequentlyUsed'][frequentlyUsed.strategyName] = [strategy[frequentlyUsed.strategyName]]
    })
    return emojis
  }

  addToFrequentlyUsed (shortname) {
    const strategyName = shortname.replace(/:/g, '')
    const currentFrequentlyUsed = store.get('emoji-frequently-used') || []
    const newFrequentlyUsed = [
      ...currentFrequentlyUsed.filter(f => f.strategyName !== strategyName),
      { 
        strategyName: strategyName, 
        used: (currentFrequentlyUsed.find(f => f.strategyName === strategyName) || {used: 0}).used + 1 % 6
      }
    ]
    store.set('emoji-frequently-used', newFrequentlyUsed)
    this.setState({
      frequentlyUsed: newFrequentlyUsed,
      emojis: {
        ...this.state.emojis,
        ...this.getFromFrequentlyUsed(strategy, newFrequentlyUsed)
      }
    })
  }

  onChange = (data) => {
    this.addToFrequentlyUsed(data.shortname)
    this.props.onChange(data)
  }

  setFocus = ev => {
    if (ev.target.id === "flags") {
      this.categories[this.state.category].children[0].focus();
    }
  };

  _renderHeaderCategories = () => {
    return map(this.props.categories, (details, key) => (
      <li
        key={key}
        className={this.state.category === key ? "active" : undefined}
      >
        <Emoji
          id={key}
          role="menuitem"
          ariaLabel={`${key} category`}
          shortname={`:${details.emoji}:`}
          onSelect={() => {
            this.categories.jumpToCategory(key);
          }}
        />
      </li>
    ));
  };

  _renderCategories = () => {
    const rows = this.rowsSelector(
      this.props.categories,
      this.state.emojis,
      this.state.modifier,
      this.props.search,
      this.state.term
    );

    return (
      <div className="emoji-categories-wrapper">
        <Categories
          ref={this._setCategoriesRef}
          rows={rows}
          modifier={this.state.modifier}
          onActiveCategoryChange={this._onActiveCategoryChange}
          onChange={this.onChange}
          onModifierChange={this._onModifierChange}
        />
      </div>
    );
  };

  _setCategoriesRef = categories => {
    this.categories = categories;
  };

  _setSearchRef = ref => {
    this.search = ref;
  };

  _onActiveCategoryChange = category => {
    if (category !== this.state.category) {
      this.setState({ category });
    }
  };

  _onModifierChange = modifier => {
    this.setState({ modifier });
    store.set("emoji-modifier", modifier);
  };

  _renderSearchInput = () => {
    if (this.props.search === true) {
      return (
        <div className="emoji-search-wrapper">
          <input
            className="emoji-search"
            type="search"
            placeholder="Search..."
            ref={this._setSearchRef}
            onChange={this._updateSearchTerm}
            autoFocus
          />
        </div>
      );
    }

    return null;
  };

  _updateSearchTerm = () => {
    this.setState({ term: this.search.value });
  };

  render() {
    const props = omit(this.props, Object.keys(Picker.propTypes));
    let classes = "emoji-dialog";
    if (this.props.search === true) classes += " with-search";
    if (this.props.className) classes += ` ${this.props.className}`;

    return (
      <div className={classes} role="dialog" {...props}>
        <header className="emoji-dialog-header" role="menu">
          <ul onBlur={this.setFocus}>{this._renderHeaderCategories()}</ul>
        </header>
        {this._renderSearchInput()}
        {this._renderCategories()}
      </div>
    );
  }
}

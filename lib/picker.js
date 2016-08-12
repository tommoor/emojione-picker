var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var Emoji = require("./emoji");
var Modifiers = require("./modifiers");
var strategy = require("./strategy");
var emojione = require("emojione");
var store = require("store");
var _ = require("underscore");

var Picker = React.createClass({
  displayName: "Picker",

  propTypes: {
    search: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      search: '',
      categories: {
        people: {
          title: 'People',
          emoji: 'smile'
        },
        nature: {
          title: 'Nature',
          emoji: 'hamster'
        },
        foods: {
          title: 'Food & Drink',
          emoji: 'pizza'
        },
        activity: {
          title: 'Activity',
          emoji: 'soccer'
        },
        travel: {
          title: 'Travel & Places',
          emoji: 'earth_americas'
        },
        objects: {
          title: 'Objects',
          emoji: 'bulb'
        },
        symbols: {
          title: 'Symbols',
          emoji: 'clock9'
        },
        flags: {
          title: 'Flags',
          emoji: 'flag_gb'
        }
      }
    };
  },

  getInitialState: function () {
    return {
      modifier: store.get('emoji-modifier') || 0,
      rendered: 0,
      category: false,
      term: this.props.search !== true ? this.props.search : ""
    };
  },

  componentWillMount: function () {
    this.setState({ emojis: this.emojisFromStrategy(strategy) });
  },

  componentDidMount: function () {
    this.refs.grandlist.addEventListener('scroll', this.updateActiveCategory);
    this.updateActiveCategory();
  },

  componentWillUnmount: function () {
    this.refs.grandlist.removeEventListener('scroll', this.updateActiveCategory);
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.search != nextProps.search) {
      this.setState({ term: this.props.search });
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.state.rendered < Object.keys(this.props.categories).length) {
      setTimeout(function () {
        if (this.isMounted()) {
          this.setState({ rendered: this.state.rendered + 1 });
        }
      }.bind(this), 0);
    }
  },

  updateSearchTerm: function () {
    this.setState({ term: this.refs.search.value });
  },

  updateActiveModifier: function (modifier) {
    this.setState({ modifier: modifier });
    store.set('emoji-modifier', modifier);
  },

  emojisFromStrategy: function (strategy) {
    var emojis = {};

    // categorise and nest emoji
    // TODO: this could be done as a preprocess.
    for (var key in strategy) {
      var value = strategy[key];

      // skip unknown categories
      if (value.category !== 'modifier') {
        if (!emojis[value.category]) emojis[value.category] = {};
        var match = key.match(/(.*?)_tone(.*?)$/);

        // this does rely on the modifer emojis coming later in strategy
        if (match) {
          emojis[value.category][match[1]][match[2]] = value;
        } else {
          emojis[value.category][key] = [value];
        }
      }
    }

    return emojis;
  },

  updateActiveCategory: _.throttle(function () {
    var scrollTop = this.refs.grandlist.scrollTop;
    var padding = 10;
    var selected;
    if (this.state.category) {
      selected = this.state.category;
    } else {
      selected = 'people';
    }

    _.each(this.props.categories, function (details, category) {
      if (this.refs[category] && scrollTop >= this.refs[category].offsetTop - padding) {
        selected = category;
      }
    }.bind(this));

    if (this.state.category != selected) {
      this.setState({ category: selected });
    }
  }, 100),

  jumpToCategory: function (name) {
    var offsetTop = this.refs[name].offsetTop;
    var padding = 5;
    this.refs.grandlist.scrollTop = offsetTop - padding;
  },

  getCategories: function () {
    var headers = [];
    var jumpToCategory = this.jumpToCategory;

    _.each(this.props.categories, function (details, key) {
      headers.push(React.createElement(
        "li",
        { key: key, className: this.state.category == key ? "active" : "" },
        React.createElement(Emoji, { id: key, role: "menuitem", "aria-label": key + " category", shortname: ":" + details.emoji + ":", onClick: function () {
            jumpToCategory(key);
          }, onKeyUp: function (e) {
            e.preventDefault();
            if (e.which === 13 || e.which === 32) jumpToCategory(key);
          } })
      ));
    }.bind(this));
    return headers;
  },

  getEmojis: function () {
    var sections = [];
    var onChange = this.props.onChange;
    var search = this.props.search;
    var term = this.state.term;
    var modifier = this.state.modifier;
    var i = 0;

    // render emoji in category sized chunks to help prevent UI lockup
    _.each(this.props.categories, function (category, key) {
      var list = this.state.emojis[key];
      if (list && Object.keys(list).length && i < this.state.rendered) {
        list = _.map(list, function (data) {
          var modified = modifier && data[modifier] ? data[modifier] : data[0];

          if (!search || !term || modified.keywords.some(function (keyword) {
            return new RegExp("^" + term).test(keyword);
          })) {

            return React.createElement(
              "li",
              { key: modified.unicode },
              React.createElement(Emoji, _extends({}, modified, { "aria-label": modified.name, role: "option", onClick: function () {
                  onChange(modified);
                }, onKeyUp: function (e) {
                  e.preventDefault();
                  if (e.which === 13 || e.which === 32) onChange(modified);
                } }))
            );
          }
        });

        if (_.compact(list).length) {
          sections.push(React.createElement(
            "div",
            { className: "emoji-category", key: key, ref: key },
            React.createElement(
              "h2",
              { refs: category.title, tabIndex: "0", className: "emoji-category-header" },
              category.title
            ),
            React.createElement(
              "ul",
              { className: "emoji-category-list" },
              list
            )
          ));
        }

        i++;
      }
    }.bind(this));

    return sections;
  },

  getModifiers: function () {
    // we hide the color tone modifiers when searching to reduce clutter
    if (!this.state.term) {
      return React.createElement(Modifiers, { active: this.state.modifier, onChange: this.updateActiveModifier });
    }
  },

  getSearchInput: function () {
    if (this.props.search === true) {
      return React.createElement(
        "div",
        { className: "emoji-search-wrapper" },
        React.createElement("input", { className: "emoji-search", type: "search", placeholder: "Search...", ref: "search", onChange: this.updateSearchTerm })
      );
    }
  },
  setFocus: function (e) {
    if (e.target.id === "flags") {
      this.refs[this.state.category].children[0].focus();
    }
  },

  render: function () {
    var classes = 'emoji-dialog';
    if (this.props.search === true) classes += ' with-search';

    return React.createElement(
      "div",
      { className: classes, role: "dialog" },
      React.createElement(
        "header",
        { className: "emoji-dialog-header", role: "menu" },
        React.createElement(
          "ul",
          { onBlur: this.setFocus },
          this.getCategories()
        )
      ),
      React.createElement(
        "div",
        { className: "emoji-grandlist", ref: "grandlist", role: "listbox" },
        this.getModifiers(),
        this.getSearchInput(),
        this.getEmojis()
      )
    );
  }
});

module.exports = Picker;
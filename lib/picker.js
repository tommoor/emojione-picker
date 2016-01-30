var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require("react");
var strategy = require("./strategy");
var emojione = require("emojione");
var _ = require("underscore");

var Picker = React.createClass({
  displayName: "Picker",

  propTypes: {
    onChange: React.PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      search: "",
      categories: {
        people: 'smile',
        nature: 'hamster',
        foods: 'pizza',
        activity: 'football',
        travel: 'earth_americas',
        objects: 'bulb',
        symbols: 'clock9',
        flags: 'flag_gb'
      }
    };
  },

  getInitialState: function () {
    return {
      category: false,
      rendered: 0,
      term: this.props.search !== true ? this.props.search : ""
    };
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

  updateActiveCategory: _.throttle(function () {
    var scrollTop = this.refs.grandlist.scrollTop;
    var refs = this.refs;
    var padding = 10;
    var selected;

    _.each(this.props.categories, function (shortname, category) {
      if (refs[category] && scrollTop >= refs[category].offsetTop - padding) {
        selected = category;
      }
    });

    if (this.state.category != selected) {
      this.setState({ category: selected });
    }
  }, 100),

  jumpToCategory: function (name) {
    var offsetTop = this.refs[name].offsetTop;
    var padding = 5;
    this.refs.grandlist.scrollTop = offsetTop - padding;
  },

  render: function () {
    var headers = [];
    var emojis = {};
    var sections = [];
    var onChange = this.props.onChange;
    var jumpToCategory = this.jumpToCategory;
    var search = this.props.search;
    var term = this.state.term;
    var searchInput;

    // category headers
    _.each(this.props.categories, function (shortname, key) {
      shortname = ":" + shortname + ":";
      emojis[key] = [];

      headers.push(React.createElement(
        "li",
        { key: key, className: this.state.category == key ? "active" : "" },
        React.createElement(Emoji, { role: "menuitem", "aria-label": key + " category", shortname: shortname, onClick: function () {
            jumpToCategory(key);
          } })
      ));
    }.bind(this));

    // filter and categorise emoji
    for (var key in strategy) {
      var value = strategy[key];

      // skip unknown categories
      if (emojis[value.category]) {
        if (!search || !term || value.keywords.some(function (keyword) {
          return new RegExp("^" + term).test(keyword);
        })) {
          emojis[value.category].push(value);
        }
      }
    }

    // render emoji in category sized chunks to help prevent UI lockup
    var i = 0;
    _.each(emojis, function (list, key) {
      if (list.length && i < this.state.rendered) {
        list = _.map(list, function (data) {
          return React.createElement(
            "li",
            { key: data.unicode },
            React.createElement(Emoji, _extends({}, data, { "aria-label": data.name, role: "option", onClick: function () {
                onChange(data);
              } }))
          );
        });

        sections.push(React.createElement(
          "div",
          { className: "emoji-category", key: key, ref: key },
          React.createElement(
            "h2",
            { className: "emoji-category-header" },
            key
          ),
          React.createElement(
            "ul",
            { className: "emoji-category-list" },
            list
          )
        ));
      }
      i++;
    }.bind(this));

    // optionally render a search field
    if (this.props.search === true) {
      searchInput = React.createElement(
        "div",
        { className: "emoji-search-wrapper" },
        React.createElement("input", { className: "emoji-search", type: "search", placeholder: "Search...", ref: "search", onChange: this.updateSearchTerm })
      );
    }

    return React.createElement(
      "div",
      { className: "emoji-dialog", role: "dialog" },
      React.createElement(
        "header",
        { className: "emoji-dialog-header", role: "menu" },
        React.createElement(
          "ul",
          null,
          headers
        )
      ),
      React.createElement(
        "div",
        { className: "emoji-grandlist", ref: "grandlist", role: "listbox" },
        searchInput,
        sections
      )
    );
  }
});

var Emoji = React.createClass({
  displayName: "Emoji",

  propTypes: {
    onClick: React.PropTypes.func
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasnt changed
    return nextProps.shortname != this.props.shortname;
  },

  createMarkup: function () {
    return { __html: emojione.shortnameToImage(this.props.shortname) };
  },

  render: function () {
    return React.createElement("div", _extends({}, this.props, { onClick: this.props.onClick, tabIndex: "0", className: "emoji",
      title: this.props.name,
      dangerouslySetInnerHTML: this.createMarkup() }));
  }
});

module.exports = Picker;
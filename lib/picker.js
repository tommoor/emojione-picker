'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _emoji = require('./emoji');

var _emoji2 = _interopRequireDefault(_emoji);

var _modifiers = require('./modifiers');

var _modifiers2 = _interopRequireDefault(_modifiers);

var _emoji3 = require('emojione/emoji.json');

var _emoji4 = _interopRequireDefault(_emoji3);

var _emojione = require('emojione');

var _emojione2 = _interopRequireDefault(_emojione);

var _store = require('store');

var _store2 = _interopRequireDefault(_store);

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _compact = require('lodash/compact');

var _compact2 = _interopRequireDefault(_compact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Picker = _react2.default.createClass({
  displayName: 'Picker',

  propTypes: {
    emojione: _react2.default.PropTypes.shape({
      imageType: _react2.default.PropTypes.string,
      sprites: _react2.default.PropTypes.bool,
      imagePathSVGSprites: _react2.default.PropTypes.string
    }),
    search: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.string]),
    onChange: _react2.default.PropTypes.func.isRequired,
    useNative: _react2.default.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
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
        food: {
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

  getInitialState: function getInitialState() {
    return {
      modifier: _store2.default.get('emoji-modifier') || 0,
      rendered: 0,
      category: false,
      term: this.props.search !== true ? this.props.search : ""
    };
  },

  componentWillMount: function componentWillMount() {
    (0, _each2.default)(this.props.emojione, function (value, key) {
      _emojione2.default[key] = value;
    });
    this.setState({ emojis: this.emojisFromStrategy(_emoji4.default) });
  },

  componentDidMount: function componentDidMount() {
    this.refs.grandlist.addEventListener('scroll', this.updateActiveCategory);
    this.updateActiveCategory();
  },

  componentWillUnmount: function componentWillUnmount() {
    this.refs.grandlist.removeEventListener('scroll', this.updateActiveCategory);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.search != nextProps.search) {
      this.setState({ term: this.props.search });
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var _this = this;

    if (this.state.rendered < Object.keys(this.props.categories).length) {
      setTimeout(function () {
        if (_this.isMounted()) {
          _this.setState({ rendered: _this.state.rendered + 1 });
        }
      }, 0);
    }
  },

  updateSearchTerm: function updateSearchTerm() {
    this.setState({ term: this.refs.search.value });
  },

  updateActiveModifier: function updateActiveModifier(modifier) {
    this.setState({ modifier: modifier });
    _store2.default.set('emoji-modifier', modifier);
  },

  emojisFromStrategy: function emojisFromStrategy(strategy) {
    var emojis = {};

    // categorise and nest emoji
    // sort ensures that modifiers appear unmodified keys
    var keys = Object.keys(strategy);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        var value = strategy[key];

        // skip unknown categories
        if (value.category !== 'modifier') {
          if (!emojis[value.category]) emojis[value.category] = {};
          var match = key.match(/(.*?)_tone(.*?)$/);

          if (match) {
            // this check is to stop the plugin from failing in the case that the
            // emoji strategy miscategorizes tones - which was the case here:
            // https://github.com/Ranks/emojione/pull/330
            var unmodifiedEmojiExists = !!emojis[value.category][match[1]];
            if (unmodifiedEmojiExists) {
              emojis[value.category][match[1]][match[2]] = value;
            }
          } else {
            emojis[value.category][key] = [value];
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return emojis;
  },

  updateActiveCategory: (0, _throttle2.default)(function () {
    var _this2 = this;

    var scrollTop = this.refs.grandlist.scrollTop;
    var padding = 10;
    var selected = 'people';

    if (this.state.category) {
      selected = this.state.category;
    }

    (0, _each2.default)(this.props.categories, function (details, category) {
      if (_this2.refs[category] && scrollTop >= _this2.refs[category].offsetTop - padding) {
        selected = category;
      }
    });

    if (this.state.category != selected) {
      this.setState({ category: selected });
    }
  }, 100),

  jumpToCategory: function jumpToCategory(name) {
    var offsetTop = this.refs[name].offsetTop;
    var padding = 5;
    this.refs.grandlist.scrollTop = offsetTop - padding;
  },

  renderCategories: function renderCategories() {
    var _this3 = this;

    var headers = [];
    var jumpToCategory = this.jumpToCategory;

    (0, _each2.default)(this.props.categories, function (details, key) {
      headers.push(_react2.default.createElement(
        'li',
        { key: key, className: _this3.state.category === key ? "active" : "" },
        _react2.default.createElement(_emoji2.default, {
          id: key,
          role: 'menuitem',
          'aria-label': key + ' category',
          shortname: ':' + details.emoji + ':',
          useNative: _this3.props.useNative,
          onClick: function onClick(e) {
            jumpToCategory(key);
          },
          onKeyUp: function onKeyUp(e) {
            e.preventDefault();
            if (e.which === 13 || e.which === 32) {
              jumpToCategory(key);
            }
          }
        })
      ));
    });

    return headers;
  },

  renderEmojis: function renderEmojis() {
    var _this4 = this;

    var sections = [];
    var _props = this.props,
        onChange = _props.onChange,
        search = _props.search;
    var _state = this.state,
        term = _state.term,
        modifier = _state.modifier;

    var i = 0;

    // render emoji in category sized chunks to help prevent UI lockup
    (0, _each2.default)(this.props.categories, function (category, key) {
      var list = _this4.state.emojis[key];
      if (list && Object.keys(list).length && i < _this4.state.rendered) {
        list = (0, _map2.default)(list, function (data) {
          var modified = modifier && data[modifier] ? data[modifier] : data[0];

          if (!search || !term || modified.keywords.some(function (keyword) {
            return new RegExp('^' + term).test(keyword);
          })) {

            return _react2.default.createElement(
              'li',
              { key: modified.unicode },
              _react2.default.createElement(_emoji2.default, _extends({}, modified, {
                ariaLabel: modified.name,
                role: 'option',
                useNative: this.props.useNative,
                onClick: function onClick(e) {
                  onChange(modified);
                },
                onKeyUp: function onKeyUp(e) {
                  e.preventDefault();
                  if (e.which === 13 || e.which === 32) {
                    onChange(modified);
                  }
                }
              }))
            );
          }
        }.bind(_this4));

        if ((0, _compact2.default)(list).length) {
          sections.push(_react2.default.createElement(
            'div',
            { className: 'emoji-category', key: key, ref: key },
            _react2.default.createElement(
              'h2',
              { ref: category.title, tabIndex: '0', className: 'emoji-category-header' },
              category.title
            ),
            _react2.default.createElement(
              'ul',
              { className: 'emoji-category-list' },
              list
            )
          ));
        }

        i++;
      }
    });

    return sections;
  },

  renderModifiers: function renderModifiers() {
    // we hide the color tone modifiers when searching to reduce clutter
    if (!this.state.term) {
      return _react2.default.createElement(_modifiers2.default, { active: this.state.modifier, onChange: this.updateActiveModifier });
    }
  },

  renderSearchInput: function renderSearchInput() {
    if (this.props.search === true) {
      return _react2.default.createElement(
        'div',
        { className: 'emoji-search-wrapper' },
        _react2.default.createElement('input', {
          className: 'emoji-search',
          type: 'search',
          placeholder: 'Search...',
          ref: 'search',
          onChange: this.updateSearchTerm,
          autoFocus: true
        })
      );
    }
  },

  setFocus: function setFocus(e) {
    if (e.target.id === "flags") {
      this.refs[this.state.category].children[0].focus();
    }
  },

  render: function render() {
    var classes = 'emoji-dialog';
    if (this.props.search === true) classes += ' with-search';

    return _react2.default.createElement(
      'div',
      { className: classes, role: 'dialog' },
      _react2.default.createElement(
        'header',
        { className: 'emoji-dialog-header', role: 'menu' },
        _react2.default.createElement(
          'ul',
          { onBlur: this.setFocus },
          this.renderCategories()
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'emoji-grandlist', ref: 'grandlist', role: 'listbox' },
        this.renderModifiers(),
        this.renderSearchInput(),
        this.renderEmojis()
      )
    );
  }
});

module.exports = Picker;
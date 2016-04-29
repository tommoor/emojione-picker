var React = require("react");
var Emoji = require("./emoji");
var Modifiers = require("./modifiers");
var strategy = require("./strategy");
var emojione = require("emojione");
var store = require("store");
var _ = require("underscore");

var Picker = React.createClass({
    propTypes: {
      search: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.boolean
      ]),
      onChange: React.PropTypes.func.isRequired,
    },

    getDefaultProps: function() {
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
      }
    },

    getInitialState: function() {
      return {
        modifier: store.get('emoji-modifier') || 0,
        rendered: 0,
        category: false,
        term: this.props.search !== true ? this.props.search : ""
      };
    },

    componentWillMount: function() {
      this.setState({emojis: this.emojisFromStrategy(strategy)});
    },

    componentDidMount: function() {
      this.refs.grandlist.addEventListener('scroll', this.updateActiveCategory);
      this.updateActiveCategory();
    },

    componentWillUnmount: function() {
      this.refs.grandlist.removeEventListener('scroll', this.updateActiveCategory);
    },

    componentWillReceiveProps: function(nextProps) {
      if (this.props.search != nextProps.search) {
        this.setState({term: this.props.search});
      }
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (this.state.rendered < Object.keys(this.props.categories).length) {
        setTimeout(function(){
          if (this.isMounted()) {
            this.setState({rendered: this.state.rendered+1});
          }
        }.bind(this), 0);
      }
    },

    updateSearchTerm: function() {
      this.setState({term: this.refs.search.value});
    },

    updateActiveModifier: function(modifier) {
      this.setState({modifier: modifier});
      store.set('emoji-modifier', modifier);
    },

    emojisFromStrategy: function(strategy) {
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

    updateActiveCategory:  _.throttle(function() {
      var scrollTop = this.refs.grandlist.scrollTop;
      var padding = 10;
      var selected = 'people';

      _.each(this.props.categories, function(details, category) {
        if (this.refs[category] && scrollTop >= this.refs[category].offsetTop-padding) {
          selected = category;
        }
      }.bind(this));

      if (this.state.category != selected) {
        this.setState({category: selected});
      }
    }, 100),

    jumpToCategory: function(name) {
      var offsetTop = this.refs[name].offsetTop;
      var padding = 5;
      this.refs.grandlist.scrollTop = offsetTop-padding;
    },

    getCategories: function() {
      var headers = [];
      var jumpToCategory = this.jumpToCategory;

      _.each(this.props.categories, function(details, key){
        headers.push(<li key={key} className={this.state.category == key ? "active" : ""}>
          <Emoji role="menuitem" aria-label={key + " category"} shortname={":"+details.emoji+":"} onClick={function(){
            jumpToCategory(key);
          }}/>
        </li>);
      }.bind(this));
      return headers;
    },

    getEmojis: function() {
      var sections = [];
      var onChange = this.props.onChange;
      var search = this.props.search;
      var term = this.state.term;
      var modifier = this.state.modifier;
      var i = 0;

      // render emoji in category sized chunks to help prevent UI lockup
      _.each(this.props.categories, function(category, key) {
        var list = this.state.emojis[key];
        if (list && Object.keys(list).length && i < this.state.rendered) {
          list = _.map(list, function(data){
            var modified = modifier && data[modifier] ? data[modifier] : data[0];

            if (!search || !term || modified.keywords.some(function(keyword) { return new RegExp("^"+term).test(keyword); })) {

              return <li key={modified.unicode}><Emoji {...modified} aria-label={modified.name} role="option" onClick={function(){
                onChange(modified);
              }}/></li>;
            }
          });

          if (_.compact(list).length) {
            sections.push(<div className="emoji-category" key={key} ref={key}>
              <h2 className="emoji-category-header">{category.title}</h2>
              <ul className="emoji-category-list">{list}</ul>
            </div>);
          }

          i++;
        }
      }.bind(this));

      return sections;
    },

    getModifiers: function() {
      // we hide the color tone modifiers when searching to reduce clutter
      if (!this.state.term) {
        return <Modifiers active={this.state.modifier} onChange={this.updateActiveModifier} />
      }
    },

    getSearchInput: function() {
      if (this.props.search === true) {
        return <div className="emoji-search-wrapper">
          <input className="emoji-search" type="search" placeholder="Search..." ref="search" onChange={this.updateSearchTerm} />
        </div>;
      }
    },

    render: function() {
      var classes = 'emoji-dialog';
      if (this.props.search === true) classes += ' with-search';

      return <div className={classes} role="dialog">
        <header className="emoji-dialog-header" role="menu">
          <ul>{this.getCategories()}</ul>
        </header>
        <div className="emoji-grandlist" ref="grandlist" role="listbox">
          {this.getModifiers()}
          {this.getSearchInput()}
          {this.getEmojis()}
        </div>
      </div>
    }
});

module.exports = Picker;

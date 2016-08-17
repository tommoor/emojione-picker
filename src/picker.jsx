import React from 'react';
import Emoji from './emoji';
import Modifiers from './modifiers';
import strategy from 'emojione/emoji.json';
import emojione from 'emojione';
import store from 'store';
import {throttle, each, map, compact} from 'lodash';

const Picker = React.createClass({
    propTypes: {
      search: React.PropTypes.oneOfType([
        React.PropTypes.bool,
        React.PropTypes.string,
      ]),
      onChange: React.PropTypes.func.isRequired
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
        setTimeout(() => {
          if (this.isMounted()) {
            this.setState({rendered: this.state.rendered + 1});
          }
        }, 0);
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
      const emojis = {};

      // categorise and nest emoji
      // TODO: this could be done as a preprocess.
      const keys = Object.keys(strategy).sort()
      for (const key of keys) {
        const value = strategy[key];

        // skip unknown categories
        if (value.category !== 'modifier') {
          if (!emojis[value.category]) emojis[value.category] = {};
          const match = key.match(/(.*?)_tone(.*?)$/);

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

    updateActiveCategory: throttle(function() {
      const scrollTop = this.refs.grandlist.scrollTop;
      const padding = 10;
      let selected = 'people';

      if (this.state.category){
        selected = this.state.category;
      }

      each(this.props.categories, (details, category) => {
        if (this.refs[category] && scrollTop >= this.refs[category].offsetTop-padding) {
          selected = category;
        }
      });

      if (this.state.category != selected) {
        this.setState({category: selected});
      }
    }, 100),

    jumpToCategory: function(name) {
      const offsetTop = this.refs[name].offsetTop;
      const padding = 5;
      this.refs.grandlist.scrollTop = offsetTop-padding;
    },

    getCategories: function() {
      const headers = [];
      const jumpToCategory = this.jumpToCategory;

      each(this.props.categories, (details, key) => {
        headers.push(<li key={key} className={this.state.category === key ? "active" : ""}>
          <Emoji
            id={key}
            role="menuitem"
            aria-label={`${key} category`}
            shortname={`:${details.emoji}:`}
            onClick={function(e){
              jumpToCategory(key);
            }}
            onKeyUp={function(e) {
              e.preventDefault();
              if (e.which === 13 || e.which === 32) {
                jumpToCategory(key);
              }
            }}
          />
        </li>);
      });

      return headers;
    },

    getEmojis: function() {
      const sections = [];
      const {onChange, search} = this.props;
      const {term, modifier} = this.state;
      let i = 0;

      // render emoji in category sized chunks to help prevent UI lockup
      each(this.props.categories, (category, key) => {
        let list = this.state.emojis[key];
        if (list && Object.keys(list).length && i < this.state.rendered) {
          list = map(list, function(data){
            const modified = modifier && data[modifier] ? data[modifier] : data[0];

            if (!search || !term || modified.keywords.some(function(keyword) { return new RegExp(`^${term}`).test(keyword); })) {

              return (
                <li key={modified.unicode}>
                  <Emoji
                    {...modified}
                    ariaLabel={modified.name}
                    role="option"
                    onClick={function(e) {
                      onChange(modified);
                    }}
                    onKeyUp={function(e) {
                      e.preventDefault();
                      if (e.which === 13 || e.which === 32) {
                        onChange(modified);
                      }
                    }}
                  />
                </li>
              );
            }
          });

          if (compact(list).length) {
            sections.push(<div className="emoji-category" key={key} ref={key}>
              <h2 ref={category.title} tabIndex="0" className="emoji-category-header">{category.title}</h2>
              <ul className="emoji-category-list">{list}</ul>
            </div>);
          }

          i++;
        }
      });

      return sections;
    },

    getModifiers: function() {
      // we hide the color tone modifiers when searching to reduce clutter
      if (!this.state.term) {
        return <Modifiers active={this.state.modifier} onChange={this.updateActiveModifier} />;
      }
    },

    getSearchInput: function() {
      if (this.props.search === true) {
        return <div className="emoji-search-wrapper">
          <input className="emoji-search" type="search" placeholder="Search..." ref="search" onChange={this.updateSearchTerm} />
        </div>;
      }
    },
    setFocus: function(e) {
      if (e.target.id === "flags") {
        this.refs[this.state.category].children[0].focus();
      }
    },

    render: function() {
      let classes = 'emoji-dialog';
      if (this.props.search === true) classes += ' with-search';

      return <div className={classes} role="dialog">
        <header className="emoji-dialog-header" role="menu">
          <ul onBlur={this.setFocus}>{this.getCategories()}</ul>
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

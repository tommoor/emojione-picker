var React = require("react");
var strategy = require("./strategy");
var emojione = require("emojione");
var _ = require("underscore");

var Picker = React.createClass({
    propTypes: {
      onChange: React.PropTypes.func.isRequired
    },
    
    getDefaultProps: function() {
      return {
        search: "",
        categories: {
          people: {
            title:'People',
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
            emoji: 'football'
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
        category: false,
        rendered: 0,
        term: this.props.search !== true ? this.props.search : ""
      };
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
    
    getCategoryTitle: function(key) {
      var details = this.props.categories[key];
      return details ? details.title : "";
    },
    
    updateSearchTerm: function() {
      this.setState({term: this.refs.search.value});
    },
    
    updateActiveCategory:  _.throttle(function() {
      var scrollTop = this.refs.grandlist.scrollTop;
      var refs = this.refs;
      var padding = 10;
      var selected;
      
      _.each(this.props.categories, function(details, category) {
        if (refs[category] && scrollTop >= refs[category].offsetTop-padding) {
          selected = category;
        }
      });
      
      if (this.state.category != selected) {
        this.setState({category: selected});
      }
    }, 100),
    
    jumpToCategory: function(name) {
      var offsetTop = this.refs[name].offsetTop;
      var padding = 5;
      this.refs.grandlist.scrollTop = offsetTop-padding;
    },
    
    render: function() {
      var headers = [];
      var emojis = {};
      var sections = [];
      var onChange = this.props.onChange;
      var jumpToCategory = this.jumpToCategory;
      var search = this.props.search;
      var term = this.state.term;
      var searchInput;
      
      // category headers
      _.each(this.props.categories, function(details, key){
        var shortname = ":"+details.emoji+":";
        emojis[key] = [];
      
        headers.push(<li key={key} className={this.state.category == key ? "active" : ""}>
          <Emoji role="menuitem" aria-label={key + " category"} shortname={shortname} onClick={function(){
            jumpToCategory(key);
          }}/>
        </li>);
      }.bind(this));
      
      // filter and categorise emoji
      for (var key in strategy) {
        var value = strategy[key];

        // skip unknown categories
        if (emojis[value.category]) {
          if (!search || !term || value.keywords.some(function(keyword) { return new RegExp("^"+term).test(keyword); })){
            emojis[value.category].push(value);
          }
        }
      }
      
      // render emoji in category sized chunks to help prevent UI lockup
      var i = 0;
      _.each(emojis, function(list, key){
        if (list.length && i < this.state.rendered) {
          list = _.map(list, function(data){
            return <li key={data.unicode}><Emoji {...data} aria-label={data.name} role="option" onClick={function(){
              onChange(data);
            }}/></li>;
          });
          
          sections.push(<div className="emoji-category" key={key} ref={key}>
            <h2 className="emoji-category-header">{this.getCategoryTitle(key)}</h2>
            <ul className="emoji-category-list">{list}</ul>
          </div>);
        }
        i++;
      }.bind(this));
      
      // optionally render a search field
      if (this.props.search === true) {
        searchInput = <div className="emoji-search-wrapper">
          <input className="emoji-search" type="search" placeholder="Search..." ref="search" onChange={this.updateSearchTerm} />
        </div>;
      }
      
      return <div className="emoji-dialog" role="dialog">
        <header className="emoji-dialog-header" role="menu">
          <ul>{headers}</ul>
        </header>
        <div className="emoji-grandlist" ref="grandlist" role="listbox">
          {searchInput}
          {sections}
        </div>
      </div>
    }
});

var Emoji = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },
  
  shouldComponentUpdate: function(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasnt changed
    return nextProps.shortname != this.props.shortname;
  },
  
  createMarkup: function() {
    return {__html: emojione.shortnameToImage(this.props.shortname)};
  },
  
  render: function() {
    return <div {...this.props} onClick={this.props.onClick} tabIndex="0" className="emoji" 
                title={this.props.name} 
                dangerouslySetInnerHTML={this.createMarkup()}>
    </div>
  }
});

module.exports = Picker;
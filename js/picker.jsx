var React = require("react");
var strategy = require("./strategy");
var emojione = require("emojione");
var _ = require("underscore");

var Picker = React.createClass({
    propTypes: {
      search: React.PropTypes.string,
      onChange: React.PropTypes.func.isRequired
    },
    
    getDefaultProps: function() {
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
      }
    },
    
    getInitialState: function() {
      return { 
        category: false
      };
    },
    
    componentDidMount: function() {
      this.refs.grandlist.addEventListener('scroll', this.updateActiveCategory);
      this.updateActiveCategory();
    },
    
    componentWillUnmount: function() {
      this.refs.grandlist.removeEventListener('scroll', this.updateActiveCategory);
    },
    
    updateActiveCategory:  _.throttle(function() {
      var scrollTop = this.refs.grandlist.scrollTop;
      var refs = this.refs;
      var padding = 10;
      var selected;
      
      _.each(this.props.categories, function(shortname, category) {
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
      
      _.each(this.props.categories, function(shortname, category) {
        emojis[category] = [];
        
        headers.push(<li key={category} className={this.state.category == category ? "active" : ""}>
          <Emoji role="menuitem" aria-label={category + " category"} shortname={":"+shortname+":"} onClick={function(){
            jumpToCategory(category);
          }}/>
        </li>)
      }.bind(this));
      
      _.each(strategy, function(value, key) {
        // TODO: skipping modifiers for this first version
        if (emojis[value.category]) {
          if (!search || value.keywords.some(function(keyword) { return new RegExp("^"+search).test(keyword); })){
            emojis[value.category].push(value);
          }
        }
      }.bind(this));
      
      _.each(emojis, function(list, category) {
        // don't render empty categories
        if (list.length) {
          list = _.map(list, function(data){
            return <li key={data.unicode}><Emoji {...data} aria-label={data.name} role="option" onClick={function(){
              onChange(data);
            }}/></li>;
          });
        
          sections.push(<div className="emoji-category" key={category} ref={category}>
            <h2 className="emoji-category-header">{category}</h2>
            <ul className="emoji-category-list">{list}</ul>
          </div>);
        }
      });
      
      return <div className="emoji-dialog" role="dialog">
        <header className="emoji-dialog-header" role="menu">
          <ul>{headers}</ul>
        </header>
        <div className="emoji-grandlist" ref="grandlist" role="listbox">
          {sections}
        </div>
      </div>
    }
});

var Emoji = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
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
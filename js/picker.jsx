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
        category: false,
        hovering: false
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
        if (scrollTop >= refs[category].offsetTop-padding) {
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
      
      _.each(this.props.categories, function(shortname, category) {
        emojis[category] = [];
      });
      
      _.each(strategy, function(value, key) {
        // TODO: skipping modifiers for this first version
        if (emojis[value.category]) {
          emojis[value.category].push(value);
        }
      });
      
      _.each(this.props.categories, function(shortname, category) {
        headers.push(<li key={category} className={this.state.category == category ? "active" : ""}>
          <Emoji shortname={":"+shortname+":"} onClick={function(){
            jumpToCategory(category);
          }}/>
        </li>)
      }.bind(this));

      _.each(emojis, function(list, category) {
        list = _.map(list, function(data){
          return <li key={data.unicode}><Emoji {...data} onClick={function(){
            onChange(data);
          }}/></li>;
        });
        
        sections.push(<div className="emoji-category" key={category} ref={category}>
          <h2 className="emoji-category-header">{category}</h2>
          <ul className="emoji-category-list">{list}</ul>
        </div>);
      });
      
      return <div className="emoji-dialog">
        <header className="emoji-dialog-header">
          <ul>{headers}</ul>
        </header>
        <div className="emoji-grandlist" ref="grandlist">
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
    return <div onClick={this.props.onClick} className="emoji" 
                title={this.props.name} 
                dangerouslySetInnerHTML={this.createMarkup()}>
    </div>
  }
});

module.exports = Picker;
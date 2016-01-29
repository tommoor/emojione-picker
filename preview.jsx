var React = require('react');
var ReactDOM = require('react-dom');
var Picker = require('./js/picker.jsx');

var logChoice = function(emoji) {
  console.log(emoji);
}

ReactDOM.render(<Picker onChange={logChoice}/>, document.getElementById('example'));
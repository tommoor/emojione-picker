var React = require('react');
var ReactDOM = require('react-dom');
var EmojiPicker = require('./src/picker.jsx');

var logChoice = function(emoji) {
  console.log(emoji);
}

ReactDOM.render(<EmojiPicker onChange={logChoice}/>, document.getElementById('example1'));

ReactDOM.render(<EmojiPicker search={true} onChange={logChoice}/>, document.getElementById('example2'));
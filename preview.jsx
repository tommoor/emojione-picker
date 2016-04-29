var React = require('react');
var ReactDOM = require('react-dom');
var EmojiPicker = require('./src/picker');

var logChoice = function(emoji) {
  console.log(emoji);
}

ReactDOM.render(<EmojiPicker onChange={logChoice}/>, document.getElementById('example1'));

ReactDOM.render(<EmojiPicker search={true} onChange={logChoice}/>, document.getElementById('example2'));

ReactDOM.render(<EmojiPicker onChange={logChoice} useNative={true}/>, document.getElementById('example3'));

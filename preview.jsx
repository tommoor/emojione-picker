import React from 'react';
import ReactDOM from 'react-dom';
import ReactPerf from 'react-addons-perf';
import EmojiPicker from './src/picker';

// Expose React Perf on the window for the Chrome React Perf extension
window.Perf = ReactPerf;

const logChoice = function(emoji) {
  console.log(emoji);
}

ReactDOM.render(<EmojiPicker onChange={logChoice} />, document.getElementById('example1'));

ReactDOM.render(<EmojiPicker search={true} onChange={logChoice}/>, document.getElementById('example2'));

ReactDOM.render(<EmojiPicker onChange={logChoice} useNative={true}/>, document.getElementById('example3'));


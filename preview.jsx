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

ReactDOM.render(<EmojiPicker search={true} onChange={logChoice} />, document.getElementById('example2'));

ReactDOM.render(
  <EmojiPicker
    emojione={{
      imageType: 'svg',
      sprites: true,
      imagePathSVGSprites: '../node_modules/emojione/assets/sprites/emojione.sprites.svg',
    }}
    onChange={logChoice}
  />,
  document.getElementById('example3')
);

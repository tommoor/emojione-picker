import React from 'react';
import ReactDOM from 'react-dom';
import EmojiPicker from './src/picker';

var excludeEmojis = [":slight_smile:", ":upside_down:", ":money_mouth:", ":nerd:", ":hugging:", ":rolling_eyes:", ":thinking:", ":slight_frown:", ":zipper_mouth:", ":thermometer_face:", ":head_bandage:", ":robot:", ":middle_finger:", ":metal:", ":eye:", ":speaking_head:", ":spy:", ":dark_sunglasses:"]

const logChoice = function(emoji) {
  console.log(emoji);
}

ReactDOM.render(<EmojiPicker onChange={logChoice} />, document.getElementById('example1'));

ReactDOM.render(<EmojiPicker search={true} onChange={logChoice} />, document.getElementById('example2'));

ReactDOM.render(<EmojiPicker onChange={logChoice} excludeEmojis={excludeEmojis} />, document.getElementById('example3'));

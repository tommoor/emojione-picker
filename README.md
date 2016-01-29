# Emoji Picker

A friendly Emoji picker for Emojione written as a React component. It looks a little something like this, but is easily customized:

![Emoji Picker](https://raw.githubusercontent.com/tommoor/emojione-picker/master/examples/screenshot.png)

## Installation

`npm install emojione-picker`

## Usage

```javascript
var EmojiPicker = require('emojione-picker/js/picker.jsx');

<EmojiPicker onChange={function(data){
  console.log("Emoji chosen", data);
}} />
```

## Development

`npm run preview`

## License

[MIT License](http://opensource.org/licenses/MIT)
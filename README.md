# Emoji Picker

A friendly Emoji picker for Emojione written as a React component. It looks a little something like this, but is easily customized:

![Emoji Picker](https://raw.githubusercontent.com/tommoor/emojione-picker/master/examples/screenshot.png)

## Installation

`npm install emojione-picker`

## Usage

It's probably easiest to reference the picker JSX file directly and have your current transformation pipeline take care of JSX>JS conversion, something like so:

```javascript
var EmojiPicker = require('emojione-picker/js/picker.jsx');

<EmojiPicker onChange={function(data){
  console.log("Emoji chosen", data);
}} />
```

The module also includes CSS at `css/picker.css` which you can copy and edit or ideally reference directly from within the node_modules directory.

### Customization

You can easily customize the category icons by passing in alternatives to the component constructor. The icon strings come from the shortname value in strategy.js

```javascript
var categories = {
  people: 'smile',
  nature: 'mouse',
  foods: 'burger',
  activity: 'soccer',
  travel: 'earth_asia',
  objects: 'bulb',
  symbols: 'clock9',
  flags: 'flag_cn'
}

<EmojiPicker categories={categories} />
```

## Development

`npm run preview`

## License

[MIT License](http://opensource.org/licenses/MIT)
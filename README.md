# Emoji Picker

A friendly Emoji picker for Emojione written as a React component. It looks a little something like this, but is easily customized:

<img src="https://raw.githubusercontent.com/tommoor/emojione-picker/master/examples/screenshot.png" alt="Emoji Picker" style="max-width:100%;" width="288px">

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

### Filtering

You can manually pass in a search term as a component prop to filter which emoji's are displayed by default, for example:

```javascript
<EmojiPicker search="smile" />
```

Or allow the user to search by passing a boolean true, this will enable a search input within the picker:

```javascript
<EmojiPicker search={true} />
```

<img src="https://raw.githubusercontent.com/tommoor/emojione-picker/master/examples/screenshot-search.png" alt="Emoji Picker with Search" style="max-width:100%;" width="288px">

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

```
npm install
npm run preview
```

Open `examples/index.html` in a browser to see a preview of the picker.

## License

[MIT License](http://opensource.org/licenses/MIT)

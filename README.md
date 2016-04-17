# Emoji Picker

A friendly Emoji picker for Emojione written as a React component. It looks a little something like this, but is easily customized:

<img src="https://raw.githubusercontent.com/tommoor/emojione-picker/master/examples/screenshot.png" alt="Emoji Picker" style="max-width:100%;" width="288px">

## Installation

`npm install emojione-picker`


## Usage

The npm module includes a pre-transpiled version of the picker so you don't need to run it through your JSX pipeline. Simply require the module like any other.

```javascript
var EmojiPicker = require('emojione-picker');

<EmojiPicker onChange={function(data){
  console.log("Emoji chosen", data);
}} />
```

The module also includes CSS at `css/picker.css` which you can copy and edit or ideally reference directly from within the node_modules directory. Let me know if you're using this in production - i'd love to see it in action!

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

You can easily customize the category icons by passing in alternatives to the component constructor. The emoji strings come from the shortname value in strategy.js

```javascript
var categories = {
  people: {
    title:'People',
    emoji: 'smile'
  },
  nature: {
    title: 'Nature',
    emoji: 'mouse'
  },
  foods: {
    title: 'Food & Drink',
    emoji: 'burger'
  }
}

<EmojiPicker categories={categories} />
```

## Development

```
npm install
npm run preview
```

Open `examples/index.html` in a browser to see a preview of the picker. To create a release:

```
npm run build
```

## License

[MIT License](http://opensource.org/licenses/MIT)

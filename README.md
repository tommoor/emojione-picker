[![npm version](https://badge.fury.io/js/emojione-picker.svg)](https://badge.fury.io/js/emojione-picker)
[![CircleCI](https://circleci.com/gh/tommoor/emojione-picker.svg?style=svg)](https://circleci.com/gh/tommoor/emojione-picker)

# Emoji Picker

A friendly Emoji picker for Emojione written as a React component. It looks a
little something like this, but is easily customized:

<img src="https://raw.githubusercontent.com/tommoor/emojione-picker/master/examples/screenshot.png" alt="Emoji Picker" style="max-width:100%;" width="288px">


## Installation

`npm i emojione-picker --save`

This component has a peer dependency of `react-addons-shallow-compare` in
addition to react itself. You should also install this if it is not included in
your project:

`npm i react-addons-shallow-compare --save`


### Webpack

The emoji strategy is read from a `json` file, as such you'll need to make sure
that the [json-loader](https://www.npmjs.com/package/json-loader) is included in
your loaders configuration, something like:

```javascript
loaders: [
    {
        test: /\.json$/,
        loader: "json-loader"
    }
]
```


## Usage

The npm module includes a pre-transpiled version of the picker so you don't need
to run it through your JSX pipeline. Simply require the module like any other.

```javascript
var EmojiPicker = require('emojione-picker');

<EmojiPicker onChange={function(data){
  console.log("Emoji chosen", data);
}} />
```

The module also includes CSS at `css/picker.css` which you can copy and edit or
ideally reference directly from within the node_modules directory. Let me know
if you're using this in production - i'd love to see it in action!

### Filtering

You can manually pass in a search term as a component prop to filter which
emoji's are displayed by default, for example:

```javascript
<EmojiPicker search="smile" />
```

Or allow the user to search by passing a boolean true, this will enable a search
input within the picker:

```javascript
<EmojiPicker search={true} />
```

<img src="https://raw.githubusercontent.com/tommoor/emojione-picker/master/examples/screenshot-search.png" alt="Emoji Picker with Search" style="max-width:100%;" width="288px">

### Customize Categories

You can easily customize the category icons by passing in alternatives to the
component constructor. The emoji strings come from the shortname value in strategy.js

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
  food: {
    title: 'Food & Drink',
    emoji: 'burger'
  }
}

<EmojiPicker categories={categories} />
```

### Spritesheets

You can make the picker use a spritesheet, however this requires a little extra
work. Emojione settings can be passed into the Picker component as below.
[Follow these instructions](https://github.com/Ranks/emojione#extras) to load the correct
spritesheets into your page.

```javascript
var settings = {
  imageType: 'png',
  sprites: true
};
<EmojiPicker categories={categories} emojione={settings} />
```


## Development

```
npm install
npm run watch
```

Open `examples/index.html` in a browser to see a preview of the picker.


## License

[MIT License](http://opensource.org/licenses/MIT)

Emojione is used under the [Creative Commons License (CC-BY 4.0)](http://emojione.com/licensing/) - If you use this component you should also include attribute to Emojione someone within your website or application to satisfy the terms of the license.

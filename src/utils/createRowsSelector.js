import {chunk, map, values} from 'lodash';

function rowsSelector(categories, emojisByCategory, modifier, search, term) {
  const findEmojiVariant = emojis => modifier && emojis[modifier] ? emojis[modifier] : emojis[0];
  const searchTermRegExp = new RegExp(`^${term}`);
  const keywordMatchesSearchTerm = keyword => searchTermRegExp.test(keyword);
  const emojiMatchesSearchTerm = emoji => !search || !term || emoji.keywords.some(keywordMatchesSearchTerm);

  return map(categories, (category, id) => {
    const list = emojisByCategory[id] || {};
    const emojis = values(list)
      .map(findEmojiVariant)
      .filter(emojiMatchesSearchTerm);

    return {
      category,
      emojis,
      id,
    };
  })
    .filter(({emojis}) => emojis.length > 0)
    .map(({category, emojis, id}) => {
      return [
        {
          category,
          id,
        },
        ...chunk(emojis, 8),
      ];
    })
    .reduce((rows, categoryAndEmojiRows) => {
      return [
        ...rows,
        ...categoryAndEmojiRows,
      ];
    }, []);
}

export default function createRowsSelector() {
  let lastCategories;
  let lastEmojisByCategory;
  let lastModifier;
  let lastSearch;
  let lastTerm;
  let lastResult;

  return function memoizedRowsSelector(
    categories,
    emojisByCategory,
    modifier,
    search,
    term,
  ) {
    if (
      categories !== lastCategories ||
      emojisByCategory !== lastEmojisByCategory ||
      modifier !== lastModifier ||
      search !== lastSearch ||
      term !== lastTerm
    ) {
      lastResult = rowsSelector(categories, emojisByCategory, modifier, search, term);
      lastCategories = categories;
      lastEmojisByCategory = emojisByCategory;
      lastModifier = modifier;
      lastSearch = search;
      lastTerm = term;
    }

    return lastResult;
  }
}

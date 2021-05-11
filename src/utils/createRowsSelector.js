import escape from "escape-string-regexp";
import chunk from "lodash/chunk";
import map from "lodash/map";
import values from "lodash/values";

function rowsSelector(categories, emojisByCategory, modifier, search, term) {
  const findEmojiVariant = emojis =>
    modifier && emojis[modifier] ? emojis[modifier] : emojis[0];
  const searchTermRegExp = new RegExp(`^(?:.* +)*${escape(term)}`, "i");
  const keywordMatchesSearchTerm = keyword => searchTermRegExp.test(keyword);
  const emojiMatchesSearchTerm = emoji =>
    emoji.keywords.concat(emoji.name).some(keywordMatchesSearchTerm);

  return map(categories, (category, id) => {
    const list = emojisByCategory[id] || {};
    let emojis = values(list).map(findEmojiVariant);

    if (search && term) {
      emojis = emojis.filter(emojiMatchesSearchTerm);
    }

    return {
      category,
      emojis,
      id
    };
  })
    .filter(({ emojis }) => emojis.length > 0)
    .map(({ category, emojis, id }) => [
      {
        category,
        id
      },
      ...chunk(emojis, 9)
    ])
    .reduce(
      (rows, categoryAndEmojiRows) => [...rows, ...categoryAndEmojiRows],
      []
    );
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
    term
  ) {
    if (
      categories !== lastCategories ||
        emojisByCategory !== lastEmojisByCategory ||
        modifier !== lastModifier ||
        search !== lastSearch ||
        term !== lastTerm
    ) {
      lastResult = rowsSelector(
        categories,
        emojisByCategory,
        modifier,
        search,
        term
      );
      lastCategories = categories;
      lastEmojisByCategory = emojisByCategory;
      lastModifier = modifier;
      lastSearch = search;
      lastTerm = term;
    }

    return lastResult;
  };
}

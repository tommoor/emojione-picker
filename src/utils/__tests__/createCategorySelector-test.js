import strategy from 'emojione/emoji.json';
import {defaultCategories} from '../../constants';
import createEmojisFromStrategy from '../createEmojisFromStrategy';
import createCategorySelector from '../createCategorySelector';

describe('createCategorySelector', () => {
  const emojisByCategory = createEmojisFromStrategy(strategy);
  const categorySelector = createCategorySelector();

  it('should provide results when search is disabled', () => {
    const modifier = '0';
    const actual = categorySelector(
      defaultCategories,
      emojisByCategory,
      modifier,
      '',
      '',
    );

    expect(actual).toMatchSnapshot();
  });

  it('should provide results based on a search term', () => {
    const modifier = '0';
    const actual = categorySelector(
      defaultCategories,
      emojisByCategory,
      modifier,
      true,
      'flag',
    );

    expect(actual).toMatchSnapshot();
  });

  it('should provide results with a non-default modifier', () => {
    const modifier = '1';
    const actual = categorySelector(
      defaultCategories,
      emojisByCategory,
      modifier,
      '',
      '',
    );

    expect(actual).toMatchSnapshot();
  });
});

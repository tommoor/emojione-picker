import strategy from 'emojione/emoji.json';
import createEmojisFromStrategy from '../createEmojisFromStrategy';

describe('createEmojisFromStrategy', () => {
  it('should create emojis from strategy', () => {
    const actual = createEmojisFromStrategy(strategy);

    expect(actual).toMatchSnapshot();
  });
});

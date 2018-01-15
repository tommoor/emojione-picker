export default function createEmojisFromStrategy(strategy) {
  const emojis = {};

  // categorise and nest emoji
  // sort ensures that modifiers appear unmodified keys
  const keys = Object.keys(strategy);
  for (const key of keys) {
    const value = strategy[key];

    // skip unknown categories
    if (value.category !== "modifier") {
      if (!emojis[value.category]) emojis[value.category] = {};
      const match = key.match(/(.*?)_tone(.*?)$/);

      if (match) {
        // ensure the shortname is included as a keyword
        if (!value.keywords.includes(match[1])) {
          value.keywords.push(match[1]);
        }

        // this check is to stop the plugin from failing in the case that the
        // emoji strategy miscategorizes tones - which was the case here:
        // https://github.com/Ranks/emojione/pull/330
        const unmodifiedEmojiExists = !!emojis[value.category][match[1]];
        if (unmodifiedEmojiExists) {
          emojis[value.category][match[1]][match[2]] = value;
        }
      } else {
        // ensure the shortname is included as a keyword
        if (!value.keywords.includes(key)) {
          value.keywords.push(key);
        }

        emojis[value.category][key] = [value];
      }
    }
  }

  return emojis;
}

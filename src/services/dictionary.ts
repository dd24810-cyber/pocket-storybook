import { VocabularyItem } from '../types';

export const COMMON_DICTIONARY: Record<string, Omit<VocabularyItem, 'word'>> = {
  door: {
    phonetic: '/dɔːr/',
    partOfSpeech: 'noun',
    meaning: 'A movable barrier used to open and close an entrance to a building or room.',
    example: 'She pushed open the heavy wooden door.'
  },
  street: {
    phonetic: '/striːt/',
    partOfSpeech: 'noun',
    meaning: 'A public road in a city or town, typically with houses and buildings on either side.',
    example: 'Children played along the sunny street.'
  },
  walks: {
    phonetic: '/wɔːks/',
    partOfSpeech: 'verb',
    meaning: 'Moves at a regular pace by lifting and setting down each foot in turn.',
    example: 'Mia walks to the park every morning.'
  },
  flower: {
    phonetic: '/ˈflaʊ.ɚ/',
    partOfSpeech: 'noun',
    meaning: 'The seed-bearing part of a plant, consisting of reproductive organs typically surrounded by brightly colored petals.',
    example: 'A bright yellow flower bloomed in the soil.'
  },
  friend: {
    phonetic: '/frend/',
    partOfSpeech: 'noun',
    meaning: 'A person whom one knows and with whom one has a bond of mutual affection.',
    example: 'He greeted his old friend with a warm hug.'
  },
  small: {
    phonetic: '/smɔːl/',
    partOfSpeech: 'adjective',
    meaning: 'Of a size that is less than normal or usual; little.',
    example: 'A small bird rested on the branch.'
  },
  market: {
    phonetic: '/ˈmɑːr.kɪt/',
    partOfSpeech: 'noun',
    meaning: 'A regular gathering of people for the purchase and sale of provisions, livestock, and other goods.',
    example: 'Farmers bring fresh vegetables to the market.'
  },
  bread: {
    phonetic: '/bred/',
    partOfSpeech: 'noun',
    meaning: 'Food made of flour, water, and yeast or another leavening agent, mixed and baked.',
    example: 'The aroma of fresh bread filled the kitchen.'
  },
  bakery: {
    phonetic: '/ˈbeɪ.kɚ.i/',
    partOfSpeech: 'noun',
    meaning: 'A place where bread, cakes, and other baked goods are made or sold.',
    example: 'He visited the bakery before breakfast.'
  },
  rain: {
    phonetic: '/reɪn/',
    partOfSpeech: 'noun',
    meaning: 'Moisture condensed from the atmosphere that falls visibly in separate drops.',
    example: 'The gentle rain cooled the summer afternoon.'
  },
  garden: {
    phonetic: '/ˈɡɑːr.dən/',
    partOfSpeech: 'noun',
    meaning: 'A piece of ground adjoining a house, used for growing flowers, fruit, or vegetables.',
    example: 'Roses bloomed along the garden path.'
  },
  grandfather: {
    phonetic: '/ˈɡræn.fɑː.ðɚ/',
    partOfSpeech: 'noun',
    meaning: 'The father of one’s father or mother.',
    example: 'Her grandfather loved telling old tales.'
  },
  bicycle: {
    phonetic: '/ˈbaɪ.sə.kəl/',
    partOfSpeech: 'noun',
    meaning: 'A vehicle composed of two wheels held in a frame one behind the other, propelled by pedals.',
    example: 'He learned to ride his bicycle without training wheels.'
  },
  river: {
    phonetic: '/ˈrɪv.ɚ/',
    partOfSpeech: 'noun',
    meaning: 'A large natural stream of water flowing in a channel to the sea, a lake, or another river.',
    example: 'They sat beside the flowing river.'
  },
  lighthouse: {
    phonetic: '/ˈlaɪt.haʊs/',
    partOfSpeech: 'noun',
    meaning: 'A tower or other structure containing a beacon light to warn or guide ships at sea.',
    example: 'The white lighthouse stood tall against the storm.'
  },
  clock: {
    phonetic: '/klɑːk/',
    partOfSpeech: 'noun',
    meaning: 'A mechanical or electrical device for measuring and showing time.',
    example: 'The pendulum clock struck twelve.'
  },
  recipe: {
    phonetic: '/ˈres.ə.pi/',
    partOfSpeech: 'noun',
    meaning: 'A set of instructions for preparing a particular dish, drink, or herbal mixture.',
    example: 'She followed the secret family recipe carefully.'
  }
};

export function lookupWord(rawWord: string, storyVocabulary: VocabularyItem[] = []): VocabularyItem {
  // Clean word of punctuation and casing
  const clean = rawWord.toLowerCase().replace(/[^a-z'-]/g, '').trim();

  // 1. Look in story vocabulary
  const storyMatch = storyVocabulary.find(
    (item) => item.word.toLowerCase() === clean
  );
  if (storyMatch) {
    return storyMatch;
  }

  // 2. Look in common dictionary
  if (COMMON_DICTIONARY[clean]) {
    const entry = COMMON_DICTIONARY[clean];
    return {
      word: clean,
      phonetic: entry.phonetic,
      partOfSpeech: entry.partOfSpeech,
      meaning: entry.meaning,
      example: entry.example
    };
  }

  // 3. Fallback entry
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    word: clean,
    phonetic: `/${clean}/`,
    partOfSpeech: 'word',
    meaning: `Used in the story: “${capitalized}”. Tap to listen to pronunciation and save to your personal vocabulary notebook.`,
    example: `Explore “${clean}” in the context of the story passage.`
  };
}

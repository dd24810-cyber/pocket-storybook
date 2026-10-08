import { Story } from '../types';
import blueDoorImage from '../assets/images/story_blue_door_1790847674656.jpg';
import rainyMarketImage from '../assets/images/story_rainy_market_1790847688141.jpg';
import bicycleGardenImage from '../assets/images/story_bicycle_garden_1790847700999.jpg';
import heroImage from '../assets/images/hero_pocket_storybook_1790847713354.jpg';

export const INITIAL_STORIES: Story[] = [
  {
    id: '2c437665-f014-4ac3-bfe6-64b601912001',
    title: 'The Little Blue Door',
    level: 'beginner',
    minutes: 4,
    icon: 'home',
    scene: 'A quiet street · A new friend',
    coverImage: blueDoorImage,
    summary: 'Mia stumbles upon an inviting doorway nestled between old townhouses, where a chance encounter with a friendly puppy and a welcoming elder blossoms into an unexpected neighborhood bond.',
    keyThemes: ['Everyday Kindness', 'Neighborhood Discovery', 'New Friendships', 'Animal Companionship'],
    learningFocus: 'Present simple tense · Positional prepositions (between, beside) · Descriptive adjectives for places',
    narrative: [
      'Mia walks down a quiet street. She sees a little blue door between two tall houses. There is a yellow flower beside it.',
      'A small dog sits by the door. “Hello,” Mia says softly. The dog looks at her and wags its tail.',
      'An old woman opens the door. “This is Pip,” she says with a kind smile. “He likes meeting new friends.” Mia smiles. She has found a new friend today.'
    ],
    vocabulary: [
      {
        word: 'quiet',
        phonetic: '/ˈkwaɪ.ət/',
        partOfSpeech: 'adjective',
        meaning: 'Making very little noise; calm and peaceful',
        example: 'The street is quiet in the morning.'
      },
      {
        word: 'beside',
        phonetic: '/bɪˈsaɪd/',
        partOfSpeech: 'preposition',
        meaning: 'At the side of; next to something',
        example: 'The flower is beside the door.'
      },
      {
        word: 'wags',
        phonetic: '/wæɡz/',
        partOfSpeech: 'verb',
        meaning: 'Moves quickly from side to side or up and down',
        example: 'The happy dog wags its tail.'
      },
      {
        word: 'between',
        phonetic: '/bɪˈtwiːn/',
        partOfSpeech: 'preposition',
        meaning: 'In the middle of two things or places',
        example: 'The door was between two tall houses.'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What color was the little door that Mia found?',
        options: ['Yellow', 'Blue', 'Red', 'Green'],
        answerIndex: 1,
        explanation: 'Mia saw a little blue door situated between two tall houses.'
      },
      {
        id: 'q2',
        question: 'Who was sitting beside the little door?',
        options: ['A ginger cat', 'An old baker', 'A small dog named Pip', 'Mia’s brother'],
        answerIndex: 2,
        explanation: 'A small dog named Pip was sitting by the door and wagged its tail.'
      },
      {
        id: 'q3',
        question: 'How did Mia feel at the end of her walk?',
        options: ['Sad and tired', 'Angry at the noise', 'Happy to have made a new friend', 'Lost on the street'],
        answerIndex: 2,
        explanation: 'Mia smiled because she found a sweet new friend that morning.'
      }
    ]
  },
  {
    id: '2c437665-f014-4ac3-bfe6-64b601912002',
    title: 'A Rainy Day at the Market',
    level: 'beginner',
    minutes: 5,
    icon: 'umbrella',
    scene: 'Rain · Warm bread · Kindness',
    coverImage: rainyMarketImage,
    summary: 'On a gray Saturday morning errand to fetch fresh bread, Leo turns an ordinary walk into a shared moment of warmth and generosity by offering his red umbrella to a passerby in the rain.',
    keyThemes: ['Spontaneous Generosity', 'Community Empathy', 'Simple Joys', 'Shared Solace'],
    learningFocus: 'Sensory weather vocabulary · Common daily verbs · Polite social interaction',
    narrative: [
      'It is Saturday, and Leo needs bread. He takes his red umbrella to the market. Rain falls softly on the road.',
      'At the bakery, he buys a warm loaf. The baker gives him a paper bag. On his way home, Leo sees a woman without an umbrella standing under a cold awning.',
      '“You can walk with me,” he says warmly. They share the umbrella all the way to the bus stop, listening to the rain tap gently against the fabric.'
    ],
    vocabulary: [
      {
        word: 'umbrella',
        phonetic: '/ʌmˈbrel.ə/',
        partOfSpeech: 'noun',
        meaning: 'A circular canopy that you hold over your head to stay dry in rain',
        example: 'Leo carries a red umbrella.'
      },
      {
        word: 'loaf',
        phonetic: '/loʊf/',
        partOfSpeech: 'noun',
        meaning: 'A whole piece of bread that has been baked in one shape',
        example: 'He buys a warm loaf from the local bakery.'
      },
      {
        word: 'share',
        phonetic: '/ʃer/',
        partOfSpeech: 'verb',
        meaning: 'To use or enjoy something together with another person',
        example: 'They share the umbrella in the rain.'
      },
      {
        word: 'gently',
        phonetic: '/ˈdʒent.li/',
        partOfSpeech: 'adverb',
        meaning: 'In a soft, calm, or delicate manner',
        example: 'The rain fell gently on the pavement.'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why did Leo go to the market on Saturday?',
        options: ['To purchase fresh fruit', 'To buy bread', 'To borrow an umbrella', 'To catch the bus'],
        answerIndex: 1,
        explanation: 'Leo needed bread, so he went to the neighborhood bakery.'
      },
      {
        id: 'q2',
        question: 'What color was Leo’s umbrella?',
        options: ['Bright yellow', 'Deep green', 'Red', 'Slate blue'],
        answerIndex: 2,
        explanation: 'He took his red umbrella with him to stay dry.'
      },
      {
        id: 'q3',
        question: 'What kind act did Leo perform on his walk back?',
        options: ['He gave away all his money', 'He shared his umbrella with a stranger', 'He opened a bakery', 'He rescued a kitten'],
        answerIndex: 1,
        explanation: 'Leo offered to share his umbrella with a woman standing in the rain until they reached the bus stop.'
      }
    ]
  },
  {
    id: '2c437665-f014-4ac3-bfe6-64b601912003',
    title: 'The Bicycle in the Garden',
    level: 'elementary',
    minutes: 6,
    icon: 'bike',
    scene: 'An old bicycle · A small adventure',
    coverImage: bicycleGardenImage,
    summary: 'Nora revitalizes her grandfather’s vintage bicycle hidden among garden shrubs, uncovering intergenerational memories of his youth and finding joy in timeless, restored treasures.',
    keyThemes: ['Intergenerational Memory', 'Restoration & Care', 'Nostalgia', 'Outdoor Wonder'],
    learningFocus: 'Past simple narrative verbs · Compound nouns and garden terms · Sequencing transitions',
    narrative: [
      'Nora found an old bicycle at the back of her grandfather’s garden. Its dark green paint was faded, but the wheels still turned freely when she spun them.',
      'Together they cleaned the dusty metal frame and filled the rubber tires with fresh air. Grandfather smiled as he told Nora stories of riding it to school every morning when he was young.',
      'On Sunday afternoon, Nora rode the bicycle along the willow-lined river path. It was not the newest or fastest bicycle on the trail, but the steady chime of its bell sounded like a warm memory.'
    ],
    vocabulary: [
      {
        word: 'faded',
        phonetic: '/ˈfeɪ.dɪd/',
        partOfSpeech: 'adjective',
        meaning: 'Having lost brightness or color over time',
        example: 'Its paint was faded after years in the garden.'
      },
      {
        word: 'frame',
        phonetic: '/freɪm/',
        partOfSpeech: 'noun',
        meaning: 'The main supporting structure or skeleton of a vehicle or object',
        example: 'They carefully cleaned the bicycle frame.'
      },
      {
        word: 'willow',
        phonetic: '/ˈwɪl.oʊ/',
        partOfSpeech: 'noun',
        meaning: 'A tree that grows near water with long, graceful drooping branches',
        example: 'Nora rode along the willow-lined river path.'
      },
      {
        word: 'chime',
        phonetic: '/tʃaɪm/',
        partOfSpeech: 'noun',
        meaning: 'A clear, ringing sound made by a bell',
        example: 'The chime of the bicycle bell echoed across the path.'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Where did Nora discover the bicycle?',
        options: ['In a bicycle shop window', 'At the back of her grandfather’s garden', 'Near the river bridge', 'In an old barn'],
        answerIndex: 1,
        explanation: 'She found the forgotten bicycle resting behind her grandfather’s garden flowers.'
      },
      {
        id: 'q2',
        question: 'Who originally rode the bicycle in the past?',
        options: ['Nora’s mother', 'Her grandfather when he was a boy', 'The local baker', 'Her school teacher'],
        answerIndex: 1,
        explanation: 'Grandfather recalled riding this exact bicycle to school when he was young.'
      },
      {
        id: 'q3',
        question: 'Where did Nora take the bicycle on Sunday?',
        options: ['Along the river path', 'Down a steep mountain road', 'Through a busy shopping mall', 'To the bicycle mechanic'],
        answerIndex: 0,
        explanation: 'She rode leisurely along the willow-lined path beside the flowing river.'
      }
    ]
  },
  {
    id: '2c437665-f014-4ac3-bfe6-64b601912004',
    title: 'The Lighthouse Keeper’s Cat',
    level: 'elementary',
    minutes: 6,
    icon: 'compass',
    scene: 'Coastal cliffs · Salt air · Night beacon',
    coverImage: heroImage,
    summary: 'Amid thick coastal fog high above rocky cliffs, old Thomas and his observant orange tabby cat work together to warn a disoriented fishing vessel and guide it safely to harbor.',
    keyThemes: ['Vigilance & Duty', 'Maritime Life', 'Human-Animal Intuition', 'Guiding Light'],
    learningFocus: 'Atmospheric nature adjectives · Compound maritime terms (foghorn, beacon) · Cause-and-effect narrative structures',
    narrative: [
      'High above the churning white waves, old Thomas tended the lantern room of St. Jude Lighthouse. At his heels trotted Barnaby, an orange tabby cat with half an ear and whiskers as white as sea foam.',
      'When thick sea fog rolled over the granite cliffs, Barnaby would perch on the copper windowsill. His sharp eyes watched the dark water long before the harbor bell rang.',
      'One foggy dusk, Barnaby cried out toward the rocky cove. Thomas peered through his brass telescope and spotted a small fishing boat lost in the mist. Thomas immediately sounded the foghorn, guiding the fishermen safely into the sheltered bay.'
    ],
    vocabulary: [
      {
        word: 'churning',
        phonetic: '/ˈtʃɝː.nɪŋ/',
        partOfSpeech: 'adjective',
        meaning: 'Moving about vigorously and violently, like stormy water',
        example: 'The waves were churning against the rocky shore.'
      },
      {
        word: 'beacon',
        phonetic: '/ˈbiː.kən/',
        partOfSpeech: 'noun',
        meaning: 'A guiding light or signal, especially for ships or aircraft',
        example: 'The lighthouse beacon rotated throughout the dark night.'
      },
      {
        word: 'sheltered',
        phonetic: '/ˈʃel.tɚd/',
        partOfSpeech: 'adjective',
        meaning: 'Protected from wind, rain, and severe weather',
        example: 'The small boat slipped safely into the sheltered bay.'
      },
      {
        word: 'foghorn',
        phonetic: '/ˈfɑːɡ.hɔːrn/',
        partOfSpeech: 'noun',
        meaning: 'A loud horn used on coastlines to warn boats in deep fog',
        example: 'The deep foghorn echoed across the ocean.'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What was Barnaby’s appearance?',
        options: ['A sleek black kitten', 'An orange tabby cat with white whiskers', 'A spotted puppy', 'A grey sea bird'],
        answerIndex: 1,
        explanation: 'Barnaby was an orange tabby cat with half an ear and white whiskers.'
      },
      {
        id: 'q2',
        question: 'What did Barnaby notice that alerted Thomas?',
        options: ['A school of dolphins', 'A fishing boat lost in the heavy mist', 'A broken window', 'A storm cloud far away'],
        answerIndex: 1,
        explanation: 'Barnaby alerted Thomas to a fishing boat struggling in the dense fog near the cove.'
      },
      {
        id: 'q3',
        question: 'How did Thomas guide the boat to safety?',
        options: ['By waving a red flag', 'By sounding the lighthouse foghorn', 'By swimming to the boat', 'By calling on a radio'],
        answerIndex: 1,
        explanation: 'Thomas sounded the foghorn, whose loud warning guided the sailors safely into the bay.'
      }
    ]
  },
  {
    id: '2c437665-f014-4ac3-bfe6-64b601912005',
    title: 'The Clockmaker of Prague',
    level: 'intermediate',
    minutes: 8,
    icon: 'clock',
    scene: 'Gears & springs · Antique shop · Hidden message',
    coverImage: blueDoorImage,
    summary: 'Inside an antique workshop echoing with ticking pendulums, Master Karel repairs a mysterious pocket watch and uncovers a secret engraving honoring how love endures through the passage of time.',
    keyThemes: ['Craftsmanship & Patience', 'Echoes of History', 'The Value of Time', 'Hidden Sentiments'],
    learningFocus: 'Specialized descriptive prose · Passive voice and relative clauses · Abstract reflective concepts',
    narrative: [
      'In a narrow lane beneath the medieval spires of Prague, Master Karel worked by the amber glow of a solitary brass lamp. His workshop was a sanctuary of rhythm, filled with the collective ticking of hundreds of pendulum clocks.',
      'A young traveler brought him an intricate pocket watch discovered in a flea market. Its engraved lid was tarnished silver, and inside, the escapement mechanism refused to tick. Karel adjusted his magnifying loupe and gently disassembled the casing with tweezers.',
      'Beneath the balance wheel, etched into the gold plate in miniature script, lay a message: “Time preserves what love creates.” Karel replaced a fractured jewel bearing, wound the delicate mainspring, and smiled as the pocket watch began its song once more.'
    ],
    vocabulary: [
      {
        word: 'sanctuary',
        phonetic: '/ˈsæŋk.tʃu.er.i/',
        partOfSpeech: 'noun',
        meaning: 'A place of refuge, safety, or peaceful retreat',
        example: 'The quiet workshop was a sanctuary from the bustling city.'
      },
      {
        word: 'intricate',
        phonetic: '/ˈɪn.trə.kət/',
        partOfSpeech: 'adjective',
        meaning: 'Having many complex and finely interrelated parts',
        example: 'The pocket watch contained an intricate set of miniature gears.'
      },
      {
        word: 'tarnished',
        phonetic: '/ˈtɑːr.nɪʃt/',
        partOfSpeech: 'adjective',
        meaning: 'Dull or discolored metal due to exposure to air and moisture',
        example: 'The tarnished silver lid gleamed after careful polishing.'
      },
      {
        word: 'escapement',
        phonetic: '/ɪˈskeɪp.mənt/',
        partOfSpeech: 'noun',
        meaning: 'The mechanism in a clock that regulates the release of energy to the balance wheel',
        example: 'The escapement regulated the rhythmic ticking of the timepiece.'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Where did Karel’s workshop reside?',
        options: ['In a modern glass tower', 'In a narrow lane beneath medieval spires in Prague', 'In a quiet harbor town', 'Inside a busy train station'],
        answerIndex: 1,
        explanation: 'Karel’s sanctuary was located in an ancient, narrow lane of Prague.'
      },
      {
        id: 'q2',
        question: 'What secret inscription was discovered under the balance wheel?',
        options: ['“Gold is heavier than lead.”', '“Time preserves what love creates.”', '“Always arrive at noon.”', '“Crafted in the summer of 1882.”'],
        answerIndex: 1,
        explanation: 'The delicate miniature inscription read: “Time preserves what love creates.”'
      },
      {
        id: 'q3',
        question: 'How did Karel successfully repair the watch?',
        options: ['He replaced the battery', 'He replaced a fractured jewel bearing and rewound the mainspring', 'He bought a brand-new movement', 'He melted the silver casing'],
        answerIndex: 1,
        explanation: 'Karel replaced the cracked jewel bearing and adjusted the fine mainspring.'
      }
    ]
  },
  {
    id: '2c437665-f014-4ac3-bfe6-64b601912006',
    title: 'A Recipe from the Mountains',
    level: 'intermediate',
    minutes: 7,
    icon: 'coffee',
    scene: 'Cedar forest · Herbal tea · Grandmother’s memory',
    coverImage: bicycleGardenImage,
    summary: 'Returning to an ancestral highland cabin after the first autumn frost, Clara brews herbal hearth tea from her grandmother’s weathered notebook, connecting intimately across generations.',
    keyThemes: ['Culinary Heritage', 'Seasonal Rhythms', 'Cherished Keepsakes', 'Family Traditions'],
    learningFocus: 'Sensory flavor and aroma vocabulary · Culinary verbs (infuse, steep, boil) · Nostalgic reflective prose',
    narrative: [
      'Each autumn, when the first frost dusted the highland pines, Clara climbed to the mountain cabin where her family had gathered for three generations. The air smelled of wild cedar and woodsmoke.',
      'Tucked inside a wooden spice box on the hearth was a weathered linen notebook. In her grandmother’s elegant cursive script was written the recipe for Mountain Hearth Tea: wild chamomile, dried orange peel, crushed coriander seeds, and two drops of mountain pine honey.',
      'Clara boiled fresh stream water in a speckled kettle, infused the fragrant herbs, and poured the steaming amber liquid into two earthenware cups. Sitting beside the window as snow flurries began to dance, she felt as though her grandmother were sitting right across the table.'
    ],
    vocabulary: [
      {
        word: 'highland',
        phonetic: '/ˈhaɪ.lənd/',
        partOfSpeech: 'adjective',
        meaning: 'Belonging to an area of high or mountainous land',
        example: 'The crisp highland air invigorated Clara.'
      },
      {
        word: 'weathered',
        phonetic: '/ˈweð.ɚd/',
        partOfSpeech: 'adjective',
        meaning: 'Altered or aged in texture or color by long exposure to the elements',
        example: 'The weathered notebook was preserved in a cedar spice box.'
      },
      {
        word: 'infused',
        phonetic: '/ɪnˈfjuːzd/',
        partOfSpeech: 'verb',
        meaning: 'Steeped ingredients in hot liquid to extract their flavor or fragrance',
        example: 'She infused the dried chamomile and orange peel in boiling water.'
      },
      {
        word: 'earthenware',
        phonetic: '/ˈɝː.θən.wer/',
        partOfSpeech: 'noun',
        meaning: 'Pottery made of clay fired at relatively low temperatures',
        example: 'The warm tea was poured into rustic earthenware mugs.'
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'When did Clara traditionally visit the mountain cabin?',
        options: ['During the heat of midsummer', 'In spring during blossom season', 'In autumn after the first frost', 'On New Year’s Eve'],
        answerIndex: 2,
        explanation: 'Clara hiked up each autumn when the first frost dusted the highland pines.'
      },
      {
        id: 'q2',
        question: 'What special item held the secret tea recipe?',
        options: ['A handwritten cookbook on the kitchen counter', 'A weathered linen notebook inside a cedar spice box', 'A framed picture on the fireplace', 'An old letter in a tea tin'],
        answerIndex: 1,
        explanation: 'The recipe was penned in grandmother’s linen notebook stored in the wooden spice box.'
      },
      {
        id: 'q3',
        question: 'What gave the Mountain Hearth Tea its sweet, herbal aroma?',
        options: ['Black tea and brown sugar', 'Chamomile, dried orange peel, coriander, and mountain pine honey', 'Fresh mint and lemon slices', 'Ground ginger and cinnamon sticks'],
        answerIndex: 1,
        explanation: 'Grandmother’s blend combined wild chamomile, dried orange peel, coriander, and pine honey.'
      }
    ]
  }
];

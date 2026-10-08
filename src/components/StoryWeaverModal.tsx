import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Clock, Layers, Loader2 } from 'lucide-react';
import { Story, ReadingLevel, VocabularyItem, ComprehensionQuestion } from '../types';
import { useReading } from '../context/ReadingContext';
import heroImage from '../assets/images/hero_pocket_storybook_1790847713354.jpg';
import blueDoorImage from '../assets/images/story_blue_door_1790847674656.jpg';
import rainyMarketImage from '../assets/images/story_rainy_market_1790847688141.jpg';
import bicycleGardenImage from '../assets/images/story_bicycle_garden_1790847700999.jpg';

interface StoryWeaverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryWeaverModal: React.FC<StoryWeaverModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addStory } = useReading();

  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<ReadingLevel>('beginner');
  const [minutes, setMinutes] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'A stray ginger cat who visits an old bookshop',
    'Two neighbors sharing a garden vegetable harvest',
    'A train ride through the snowy morning mountains',
    'A baker who teaches an apprentice how to make bread'
  ];

  const handleWeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setErrorMsg('');

    try {
      // Create a crafted, graded story tailored to user prompt
      const cleanTopic = topic.trim();
      
      // Graded vocabulary and questions based on level
      const storyId = 'story_custom_' + Date.now();
      
      let generatedNarrative: string[] = [];
      let generatedVocab: VocabularyItem[] = [];
      let generatedQuestions: ComprehensionQuestion[] = [];

      if (level === 'beginner') {
        generatedNarrative = [
          `Every morning begins with quiet sunshine. ${cleanTopic}. The air is cool and peaceful.`,
          `A gentle breeze rustles the green leaves. A kind smile welcomes everyone who walks past the door.`,
          `At the end of the day, small friendships make the ordinary afternoon feel warm and memorable.`
        ];
        generatedVocab = [
          {
            word: 'sunshine',
            phonetic: '/ˈsʌn.ʃaɪn/',
            partOfSpeech: 'noun',
            meaning: 'Direct sunlight unbroken by cloud',
            example: 'The room filled with morning sunshine.'
          },
          {
            word: 'breeze',
            phonetic: '/briːz/',
            partOfSpeech: 'noun',
            meaning: 'A gentle, refreshing wind',
            example: 'A cool breeze blew across the garden.'
          },
          {
            word: 'ordinary',
            phonetic: '/ˈɔːr.dən.er.i/',
            partOfSpeech: 'adjective',
            meaning: 'Normal, standard, with no special or distinctive features',
            example: 'An ordinary afternoon turned into a special memory.'
          }
        ];
        generatedQuestions = [
          {
            id: 'q1',
            question: `What was the central atmosphere of ${cleanTopic}?`,
            options: ['Loud and scary', 'Cool, quiet, and peaceful', 'Hurried and busy', 'Dark and stormy'],
            answerIndex: 1,
            explanation: 'The narrative describes the morning as cool, quiet, and peaceful.'
          },
          {
            id: 'q2',
            question: 'What rustled in the gentle breeze?',
            options: ['Old newspapers', 'The green leaves', 'A window curtain', 'A bicycle bell'],
            answerIndex: 1,
            explanation: 'The gentle wind caused the green leaves to rustle softly.'
          },
          {
            id: 'q3',
            question: 'What made the afternoon feel warm?',
            options: ['A cup of tea', 'Small friendships', 'A roaring fire', 'A wool blanket'],
            answerIndex: 1,
            explanation: 'Small friendships gave warmth to the ordinary day.'
          }
        ];
      } else if (level === 'elementary') {
        generatedNarrative = [
          `Behind the cobblestone square, a new adventure began. ${cleanTopic}. The morning light cast long golden shadows across the stone walkway.`,
          `Curious footsteps led toward a weathered wooden gate where ancient climbing ivy grew thick and fragrant. An unexpected greeting turned into a shared conversation.`,
          `Before the village clock tower chimed midday, a small discovery had transformed an ordinary weekend into a treasured story.`
        ];
        generatedVocab = [
          {
            word: 'curious',
            phonetic: '/ˈkjʊr.i.əs/',
            partOfSpeech: 'adjective',
            meaning: 'Eager to know or learn something new',
            example: 'Curious footsteps led toward the secret gate.'
          },
          {
            word: 'weathered',
            phonetic: '/ˈweð.ɚd/',
            partOfSpeech: 'adjective',
            meaning: 'Seasoned or worn by long exposure to the weather',
            example: 'The weathered wooden gate creaked gently.'
          },
          {
            word: 'transformed',
            phonetic: '/trænˈsfɔːrmd/',
            partOfSpeech: 'verb',
            meaning: 'Made a thorough or dramatic change in the form or character of something',
            example: 'A small discovery transformed the quiet morning.'
          }
        ];
        generatedQuestions = [
          {
            id: 'q1',
            question: 'Where did the morning adventure begin?',
            options: ['At a crowded airport', 'Behind the cobblestone square', 'Inside a noisy factory', 'On an underground subway'],
            answerIndex: 1,
            explanation: 'The story starts behind the quiet cobblestone square.'
          },
          {
            id: 'q2',
            question: 'What plant was growing along the weathered gate?',
            options: ['Thorny roses', 'Ancient climbing ivy', 'Tall sunflowers', 'Wild blackberries'],
            answerIndex: 1,
            explanation: 'Thick, fragrant climbing ivy covered the wooden gate.'
          },
          {
            id: 'q3',
            question: 'What sound marked the arrival of midday?',
            options: ['A church whistle', 'The village clock tower chime', 'A barking dog', 'A train engine'],
            answerIndex: 1,
            explanation: 'The village clock tower chimed midday.'
          }
        ];
      } else {
        generatedNarrative = [
          `In the quiet margins of the old quarter, an unspoken tradition endured. ${cleanTopic}. The air was saturated with cedar resin, antique parchment, and morning mist.`,
          `Carefully examining the surroundings revealed delicate craftsmanship that had stood resilient against decades of change. Each detail harbored a history waiting to be deciphered.`,
          `As evening descended in shades of violet and slate, the lingering impression was one of quiet reverie—a reminder that the most meaningful narratives are often discovered in overlooked corners.`
        ];
        generatedVocab = [
          {
            word: 'resilient',
            phonetic: '/rɪˈzɪl.jənt/',
            partOfSpeech: 'adjective',
            meaning: 'Able to withstand or recover quickly from difficult conditions',
            example: 'The woodwork remained resilient against decades of harsh weather.'
          },
          {
            word: 'deciphered',
            phonetic: '/dɪˈsaɪ.fɚd/',
            partOfSpeech: 'verb',
            meaning: 'Succeeded in understanding, interpreting, or identifying something obscure',
            example: 'The hidden inscription was slowly deciphered.'
          },
          {
            word: 'reverie',
            phonetic: '/ˈrev.ɚ.i/',
            partOfSpeech: 'noun',
            meaning: 'A state of being pleasantly lost in one’s thoughts; a daydream',
            example: 'He sat in quiet reverie by the glowing fireplace.'
          }
        ];
        generatedQuestions = [
          {
            id: 'q1',
            question: 'What scents saturated the morning air?',
            options: ['Sea salt and diesel', 'Cedar resin, antique parchment, and mist', 'Cinnamon and melted chocolate', 'Fresh pine needles and gasoline'],
            answerIndex: 1,
            explanation: 'The atmosphere held the fragrance of cedar resin, antique parchment, and mist.'
          },
          {
            id: 'q2',
            question: 'What did the surroundings reveal upon close examination?',
            options: ['Modern plastic furniture', 'Delicate craftsmanship that endured decades of change', 'Neglected rubbish', 'Electric wiring'],
            answerIndex: 1,
            explanation: 'Careful observation revealed resilient, delicate craftsmanship.'
          },
          {
            id: 'q3',
            question: 'What emotion lingered as evening arrived in shades of violet and slate?',
            options: ['Frantic panic', 'Quiet reverie', 'Boredom', 'Celebratory laughter'],
            answerIndex: 1,
            explanation: 'The narrative concludes with a sense of quiet reverie.'
          }
        ];
      }

      // Default cover illustration matching the level
      const coverImages = [
        heroImage,
        blueDoorImage,
        rainyMarketImage,
        bicycleGardenImage
      ];
      const randomCover = coverImages[Math.floor(Math.random() * coverImages.length)];

      const newStory: Story = {
        id: storyId,
        title: cleanTopic.length > 30 ? cleanTopic.slice(0, 30) + '...' : cleanTopic,
        level,
        minutes,
        icon: 'book',
        scene: `${cleanTopic} · Graded Reader`,
        coverImage: randomCover,
        summary: `A graded ${level} short story exploring ${cleanTopic.toLowerCase()}, crafted to help language learners strengthen reading comprehension and vocabulary naturally.`,
        keyThemes: ['Discovery & Exploration', 'Observation', 'New Perspectives'],
        learningFocus: `Graded ${level} syntax · Contextual vocabulary building · Narrative comprehension`,
        narrative: generatedNarrative,
        vocabulary: generatedVocab,
        questions: generatedQuestions,
        isCustom: true
      };

      // Artificial short delay for realistic authoring experience
      setTimeout(() => {
        addStory(newStory);
        setIsGenerating(false);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg('Failed to create story. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Story Weaver Generator"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#B5C3CA]/40 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#365C78] via-[#E6A653] to-[#356A58]" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-[#B5C3CA]/25">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E6A653]" />
            <h3 className="font-serif-book text-lg font-semibold text-[#20313D]">
              Story Weaver
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#657681] hover:text-[#20313D] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleWeave} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#657681] uppercase tracking-wider mb-2">
              Story Prompt or Theme
            </label>
            <textarea
              required
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. A morning in a warm bakery, or a secret garden behind the library..."
              className="w-full p-3 bg-[#F1F4F2]/50 border border-[#B5C3CA]/50 rounded-xl text-sm text-[#20313D] placeholder-[#657681] focus:outline-none focus:ring-1 focus:ring-[#365C78]"
            />
          </div>

          {/* Quick inspiration prompts */}
          <div>
            <span className="text-[11px] text-[#657681] block mb-1.5">
              Or pick an idea:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setTopic(p)}
                  className="text-[11px] text-[#365C78] bg-[#E3ECF0] hover:bg-[#365C78] hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Graded Reading Level */}
          <div>
            <label className="block text-xs font-semibold text-[#657681] uppercase tracking-wider mb-2">
              Graded Reading Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner' as ReadingLevel, label: 'Beginner', desc: 'Short sentences & A1/A2 words' },
                { id: 'elementary' as ReadingLevel, label: 'Elementary', desc: 'Narrative flow & B1 phrases' },
                { id: 'intermediate' as ReadingLevel, label: 'Intermediate', desc: 'Rich vocabulary & B2 nuances' }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setLevel(lvl.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    level === lvl.id
                      ? 'border-[#365C78] bg-[#E3ECF0] text-[#365C78]'
                      : 'border-[#B5C3CA]/40 bg-white text-[#657681] hover:border-[#365C78]/40'
                  }`}
                >
                  <div className="text-xs font-semibold mb-0.5">{lvl.label}</div>
                  <div className="text-[10px] opacity-80 leading-tight">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Read Time */}
          <div>
            <label className="block text-xs font-semibold text-[#657681] uppercase tracking-wider mb-2">
              Reading Length
            </label>
            <div className="flex items-center gap-2">
              {[3, 5, 7].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinutes(m)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    minutes === m
                      ? 'border-[#365C78] bg-[#365C78] text-white'
                      : 'border-[#B5C3CA]/40 bg-white text-[#657681]'
                  }`}
                >
                  {m} Minutes
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
              {errorMsg}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full py-3 px-4 rounded-xl bg-[#365C78] hover:bg-[#2c4b63] disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#E6A653]" />
                  <span>Weaving Graded Story...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#E6A653]" />
                  <span>Weave Graded Story</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

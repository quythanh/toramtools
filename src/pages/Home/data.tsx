import type { IToolCard } from './type';

const toolCards: IToolCard[] = [
  {
    key: 'xp',
    href: '/exp-calculator',
    title: 'Experience Calculator',
    description:
      "Find how many times takes to reach certain level through either main quest or side quests or how many levels you'll get by doing these quests a certain number of times.",
  },
  {
    key: 'sp',
    href: '/sp.html',
    title: 'Stat and Skill Points Calculator',
    description:
      "Find how many skill and stat points you'll have at certain level counting extra points from emblems or not. You may also find required level to have certain amount of stat/skill points.",
  },
  {
    key: 'bs',
    href: '/blacksmith.html',
    title: 'Blacksmith Crafting Calculator',
    description:
      'Find how much potential your weapons/armor will have or how much success chance each craft might have based on your stats, equipaments and skills related to crafting.',
  },
  {
    key: 'as',
    href: '/advanced-search',
    title: 'Simplified Advanced Search',
    description: (
      <>
        Less trouble finding items at{' '}
        <a href="http://coryn.club" target="_blank" rel="noreferrer">
          Coryn Club.
        </a>
      </>
    ),
  },
  {
    key: 'ns',
    href: '/scroll.html',
    title: 'Ninja Scroll Database',
    description:
      'Find which weapons are required to craft a scroll given its type/skills or check which kind of scroll a certain combination of weapons will produce.',
  },
  {
    key: 'tc',
    href: '/toramcafe.html',
    title: 'ToramCafe English Search',
    description: (
      <>
        Find items by english name on japanese database{' '}
        <a href="https://toramcafe.com" target="_blank" rel="noreferrer">
          ToramCafe.com
        </a>
        .
      </>
    ),
  },
];

export default toolCards;

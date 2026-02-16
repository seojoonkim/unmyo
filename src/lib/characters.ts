export interface Character {
  id: string;
  name: string;
  element: string;
  elementColor: string;
  description: string;
  image: string;
  gradient: string;
}

export const characters: Character[] = [
  {
    id: "harin",
    name: "하린",
    element: "水 · 물",
    elementColor: "from-blue-500 to-cyan-400",
    description: "깊은 직관으로 흐름을 읽는 상담사",
    image: "/characters/harin.png",
    gradient: "from-blue-900/40 to-cyan-900/40",
  },
  {
    id: "jiho",
    name: "지호",
    element: "木 · 나무",
    elementColor: "from-green-500 to-emerald-400",
    description: "성장과 가능성을 밝혀주는 상담사",
    image: "/characters/jiho.png",
    gradient: "from-green-900/40 to-emerald-900/40",
  },
  {
    id: "seojin",
    name: "서진",
    element: "金 · 쇠",
    elementColor: "from-amber-300 to-yellow-200",
    description: "날카로운 분석력의 상담사",
    image: "/characters/seojin.png",
    gradient: "from-amber-900/40 to-yellow-900/40",
  },
  {
    id: "yunha",
    name: "윤하",
    element: "火 · 불",
    elementColor: "from-red-500 to-orange-400",
    description: "열정적인 에너지를 전하는 상담사",
    image: "/characters/yunha.png",
    gradient: "from-red-900/40 to-orange-900/40",
  },
  {
    id: "noeul",
    name: "노을",
    element: "土 · 흙",
    elementColor: "from-amber-600 to-orange-300",
    description: "따뜻한 안정감을 주는 상담사",
    image: "/characters/noeul.png",
    gradient: "from-amber-900/40 to-orange-900/40",
  },
];

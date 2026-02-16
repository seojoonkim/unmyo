export interface Character {
  id: string;
  name: string;
  element: string;
  elementColor: string;
  description: string;
  image: string;
  gradient: string;
  gender: "M" | "F";
  age: number;
  role?: "counselor" | "mascot";
}

export const characters: Character[] = [
  {
    id: "yunha",
    name: "윤하",
    element: "木 · 나무",
    elementColor: "from-green-500 to-emerald-400",
    description: "천 년 된 서재에서 사주를 읽는, 과묵한 도련님",
    image: "/characters/yunha.png",
    gradient: "from-green-900/40 to-emerald-900/40",
    gender: "M",
    age: 22,
    role: "counselor",
  },
  {
    id: "harin",
    name: "하린",
    element: "火 · 불",
    elementColor: "from-red-500 to-orange-400",
    description: "사탕을 물고 운명을 읽는, 위험한 천재 소녀",
    image: "/characters/harin.png",
    gradient: "from-red-900/40 to-orange-900/40",
    gender: "F",
    age: 20,
    role: "counselor",
  },
  {
    id: "jiho",
    name: "지호",
    element: "土 · 흙",
    elementColor: "from-amber-500 to-yellow-400",
    description: "비 오는 날 차 한 잔 건네는, 세상에서 제일 편한 형",
    image: "/characters/jiho.png",
    gradient: "from-amber-900/40 to-yellow-900/40",
    gender: "M",
    age: 38,
    role: "counselor",
  },
  {
    id: "seojin",
    name: "서진",
    element: "金 · 쇠",
    elementColor: "from-slate-400 to-gray-300",
    description: "달빛 아래 완벽한 미소로 독설을 숨긴 귀공자",
    image: "/characters/seojin.png",
    gradient: "from-slate-800/40 to-gray-900/40",
    gender: "M",
    age: 26,
    role: "counselor",
  },
  {
    id: "noeul",
    name: "노을",
    element: "水 · 물",
    elementColor: "from-blue-500 to-cyan-400",
    description: "천문대에서 별을 읽는, 전설의 점성술사 할머니",
    image: "/characters/noeul.png",
    gradient: "from-blue-900/40 to-cyan-900/40",
    gender: "F",
    age: 55,
    role: "counselor",
  },
  {
    id: "myo",
    name: "묘",
    element: "☯ · 음양",
    elementColor: "from-purple-400 to-indigo-400",
    description: "경계를 넘나들며 운명을 장난치는, 오드아이의 트릭스터",
    image: "/characters/myo.png",
    gradient: "from-purple-900/40 to-indigo-900/40",
    gender: "F",
    age: 23,
    role: "counselor",
  },
];

export const counselors = characters;
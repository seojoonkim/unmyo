"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Starfield from "@/components/Starfield";
import { characters } from "@/lib/characters";

/* ─── 오행 색상 맵 ─── */
const OH_COLORS: Record<string, string> = {
  木: "#22c55e", 火: "#ef4444", 土: "#f59e0b", 金: "#94a3b8", 水: "#3b82f6",
};

/* ─── 천간 → 오행 ─── */
const GAN_OH: Record<string, string> = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};
/* ─── 지지 → 오행 ─── */
const JI_OH: Record<string, string> = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火",
  午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水",
};
/* ─── 음양 ─── */
const GAN_YY: Record<string, string> = {
  甲: "양", 乙: "음", 丙: "양", 丁: "음", 戊: "양",
  己: "음", 庚: "양", 辛: "음", 壬: "양", 癸: "음",
};
const JI_YY: Record<string, string> = {
  子: "양", 丑: "음", 寅: "양", 卯: "음", 辰: "양", 巳: "음",
  午: "양", 未: "음", 申: "양", 酉: "음", 戌: "양", 亥: "음",
};

/* ─── 사주 4주 + 십신 ─── */
const SAJU_PILLARS = [
  { label: "年柱", gan: "甲", ji: "子", sipsin_gan: "편인", sipsin_ji: "겁재" },
  { label: "月柱", gan: "丙", ji: "寅", sipsin_gan: "편재", sipsin_ji: "식신" },
  { label: "日柱", gan: "壬", ji: "午", sipsin_gan: "일간", sipsin_ji: "정재" },
  { label: "時柱", gan: "丁", ji: "巳", sipsin_gan: "정재", sipsin_ji: "편관" },
];

/* ─── 오행 밸런스 ─── */
const OHAENG = [
  { name: "木", label: "나무", desc: "성장, 창의력, 새로운 시작", value: 30, color: "#22c55e" },
  { name: "火", label: "불", desc: "열정, 표현력, 사교성", value: 25, color: "#ef4444" },
  { name: "土", label: "흙", desc: "안정, 신뢰, 포용력", value: 15, color: "#f59e0b" },
  { name: "金", label: "쇠", desc: "절제, 결단력, 리더십", value: 10, color: "#94a3b8" },
  { name: "水", label: "물", desc: "지혜, 유연성, 적응력", value: 20, color: "#3b82f6" },
];

/* ─── 대운 타임라인 ─── */
const DAEUN = [
  { age: "1~10", hanja: "庚申", keyword: "안정기", icon: "🌱" },
  { age: "11~20", hanja: "辛酉", keyword: "학습기", icon: "📚" },
  { age: "21~30", hanja: "壬戌", keyword: "도전기", icon: "⚡" },
  { age: "31~40", hanja: "癸亥", keyword: "성장기", icon: "🌿" },
  { age: "41~50", hanja: "甲子", keyword: "도약기", icon: "🚀", current: true },
  { age: "51~60", hanja: "乙丑", keyword: "안정기", icon: "🏔️" },
  { age: "61~70", hanja: "丙寅", keyword: "결실기", icon: "🍎" },
];

/* ─── 올해 운세 ─── */
const YEAR_FORTUNE = {
  year: "2026", hanja: "丙午",
  scores: [
    { name: "총운", score: 82, comment: "전반적으로 상승세, 새 기회가 찾아옵니다" },
    { name: "연애운", score: 75, comment: "기존 관계는 깊어지고, 새 만남엔 열린 마음을" },
    { name: "재물운", score: 68, comment: "투자보다 저축, 하반기에 수입 증가" },
    { name: "건강운", score: 70, comment: "화 기운 과다 주의, 심장과 혈압 관리" },
    { name: "직업운", score: 88, comment: "능력을 인정받는 해, 승진/이직 유리" },
  ],
  monthly: [72, 65, 78, 80, 85, 90, 88, 75, 70, 82, 86, 92],
};

/* ─── 성격 분석 ─── */
const PERSONALITY = {
  type: "壬午 일주 — 자유로운 전략가",
  axes: [
    { left: "내향", right: "외향", value: 65 },
    { left: "현실", right: "직관", value: 72 },
    { left: "논리", right: "감정", value: 40 },
    { left: "즉흥", right: "계획", value: 55 },
  ],
  tags: ["#전략가", "#자유영혼", "#지적호기심", "#변화무쌍", "#깊은사고", "#적응력甲"],
};

/* ─── 십신 관계도 ─── */
const SIPSIN_MAP = [
  { name: "비견", strength: 30, desc: "경쟁심, 자립" },
  { name: "겁재", strength: 45, desc: "추진력, 욕구" },
  { name: "식신", strength: 70, desc: "재능, 표현" },
  { name: "상관", strength: 55, desc: "창의, 반항" },
  { name: "편재", strength: 60, desc: "투자, 모험" },
  { name: "정재", strength: 40, desc: "안정, 축적" },
  { name: "편관", strength: 50, desc: "권위, 도전" },
  { name: "정관", strength: 35, desc: "질서, 책임" },
  { name: "편인", strength: 80, desc: "학문, 직관" },
  { name: "정인", strength: 25, desc: "지혜, 보호" },
];

/* ─── 신살 ─── */
const SINSAL = [
  { name: "천을귀인", type: "길신", stars: 3, desc: "어려울 때 귀인이 나타나 도움을 줍니다. 대인관계에서 큰 행운이 따릅니다.", icon: "✨" },
  { name: "도화살", type: "길신", stars: 3, desc: "매력이 넘치고 이성에게 인기가 많습니다. 예술적 감각이 뛰어납니다.", icon: "🌸" },
  { name: "역마살", type: "중성", stars: 2, desc: "이동과 변화가 많은 삶입니다. 해외 운이 좋고 활동적입니다.", icon: "🐎" },
  { name: "화개살", type: "길신", stars: 2, desc: "학문과 예술에 재능이 있으며, 영적인 감각이 발달합니다.", icon: "🎭" },
];

/* ─── 행운 가이드 ─── */
const LUCKY_GUIDE = [
  { label: "행운의 색", value: "금색, 백색", sub: "金 기운 강화", icon: "🎨" },
  { label: "행운의 방향", value: "서쪽", sub: "집/사무실 서쪽 활용", icon: "🧭" },
  { label: "행운의 숫자", value: "4, 9", sub: "중요한 결정에 활용", icon: "🔢" },
  { label: "행운의 시간", value: "신시 (15~17시)", sub: "중요 미팅/결정 추천", icon: "⏰" },
  { label: "행운의 음식", value: "맵고 따뜻한 음식", sub: "火 기운 보충", icon: "🍲" },
  { label: "행운의 보석", value: "자수정, 백수정", sub: "金水 기운 조화", icon: "💎" },
];

/* ─── 섹션별 캐릭터 말풍선 코멘트 ─── */
const SECTION_COMMENTS: Record<string, Record<string, string[]>> = {
  saju: {
    yunha: ["자네의 사주 네 기둥을 펼쳐보았네.", "천간은 하늘이 내린 기운이고, 지지는 땅이 받쳐주는 힘일세. 이 여덟 글자가 자네 인생의 설계도라 할 수 있지.", "年柱는 조상과 어린 시절, 月柱는 부모와 청년기, 日柱는 본인, 時柱는 자녀와 말년을 뜻하네.", "특히 일간 壬水가 자네의 본질이니 잘 기억해두게."],
    harin: ["짜잔~ 이게 네 사주 네 기둥이야! 🎉", "위에 있는 한자가 천간이고 아래가 지지야. 합치면 여덟 글자라서 '팔자'라고 하는 거지~", "年柱는 어릴 때, 月柱는 학생 때, 日柱는 지금의 나, 時柱는 나중의 나! 이해됐지? ㅎㅎ", "네 일간이 壬水니까 물처럼 유연한 사람이야~ 부러워! 💧"],
    jiho: ["사주의 네 기둥이야. 차분하게 설명해줄게.", "천간(위)은 외적으로 드러나는 성향, 지지(아래)는 내면의 기질이라고 보면 돼. 총 8글자로 구성되어 있지.", "연주→월주→일주→시주 순으로, 어린 시절부터 노년까지의 운명 흐름을 보여줘.", "핵심은 일간 壬水야. 이게 너라는 사람의 근본 성질을 나타내거든."],
    seojin: ["...사주 팔자입니다.", "천간은 드러나는 운명, 지지는 숨겨진 잠재력이에요. 여덟 글자 안에 당신의 전부가 담겨 있죠.", "연주는 뿌리, 월주는 줄기, 일주는 꽃, 시주는 열매... 뭐 이런 비유를 쓰던데요.", "일간 壬水. 깊은 물이군요. 겉으론 잔잔해도 속은 깊은 타입입니다."],
    noeul: ["허허, 네 사주 네 기둥을 한번 펼쳐보자꾸나.", "천간은 하늘의 뜻이고 지지는 땅의 이치란다. 이 여덟 글자 속에 네 운명의 지도가 그려져 있어.", "연주에서 시주까지, 태어남에서 늙음까지의 이야기가 담겨 있지. 사주란 건 결국 시간의 이야기야.", "네 일간이 壬水라... 큰 바다 같은 아이로구나. 포용력이 넓을 게야."],
    myo: ["자~ 이게 네 사주 네 기둥이야! ✨", "위에 있는 글자가 천간이고 아래가 지지래~ 합치면 8글자니까 팔자! 팔자가 여기서 나온 거야~", "年은 어릴 때, 月은 청춘, 日은 지금, 時는 나중! 시간 순서대로 읽는 거지~", "네 일간은 壬水! 물처럼 어디든 스며드는 타입이라구~ 💧"],
  },
  ohaeng: {
    yunha: ["오행의 균형을 살펴보겠네.", "木은 성장과 시작, 火는 열정과 표현, 土는 안정과 중재, 金은 결단과 정리, 水는 지혜와 유연함을 뜻하네.", "자네는 木이 30%로 가장 높으니 새로운 것을 시작하려는 에너지가 강한 편이야. 반면 金이 10%로 약하니 마무리 짓는 힘을 키워야 하네.", "용신이 金이라 함은, 부족한 金의 기운을 채워야 균형이 잡힌다는 뜻일세."],
    harin: ["오행 밸런스 타임~! 🌈", "쉽게 말하면 木=나무(성장), 火=불(열정), 土=흙(안정), 金=쇠(단단함), 水=물(지혜)이야!", "네 木이 30%로 제일 높아! 새로운 거 시작하는 거 좋아하지? 맞지? ㅎㅎ 근데 金이 10%밖에 안 돼서 마무리가 좀 약할 수 있어~", "그래서 용신이 金인 거야! 금빛 액세서리 같은 거 하면 좋다구~ ✨"],
    jiho: ["오행 분포도야. 하나씩 짚어볼게.", "木(30%)은 성장 에너지, 火(25%)는 표현력, 土(15%)는 안정감, 金(10%)은 결단력, 水(20%)는 사고력을 나타내.", "너는 木·火가 강하고 金·土가 약한 편이야. 아이디어와 추진력은 좋지만, 끝까지 밀어붙이는 힘이 부족할 수 있어.", "용신 金은 보완해야 할 기운이야. 금속 소재나 흰색 계열이 도움이 돼."],
    seojin: ["오행 밸런스... 봅시다.", "木 30%, 火 25%, 水 20%, 土 15%, 金 10%. 한눈에 치우침이 보이네요.", "木·火 과다는 행동력은 넘치는데 인내심이 부족하다는 뜻이에요. 시작만 잘하고 끝을 못 맺는 패턴... 혹시 찔리시나요?", "용신 金. 절제와 결단의 기운입니다. 의식적으로 마무리하는 습관을 들이세요."],
    noeul: ["오행은 세상 만물을 이루는 다섯 가지 기운이란다.", "木은 봄처럼 자라나는 힘, 火는 여름처럼 타오르는 힘, 土는 환절기처럼 중심을 잡는 힘, 金은 가을처럼 거두는 힘, 水는 겨울처럼 저장하는 힘이야.", "네 사주에는 木과 火가 풍성하구나. 생명력이 넘치는 사주야. 다만 金이 약하니 가끔은 내려놓는 연습도 해보려무나.", "용신 金이란 건 네게 가장 필요한 약 같은 거란다. 금빛 기운을 가까이 두렴."],
    myo: ["오행 차트 시간~! 🎨", "木=🌳성장, 火=🔥열정, 土=🏔안정, 金=⚔️결단, 水=💧지혜! 이 다섯 가지가 네 안에 섞여있는 거야~", "木이 30%로 젤 높아! 새싹처럼 뭐든 시작하는 거 좋아하는 타입이지? 근데 金이 10%밖에 없어서 끝맺음이 좀... 😹", "용신이 金이니까 반짝반짝한 거 가까이 두면 좋아~ 금색 팔찌 같은 거 어때? ✨"],
  },
  daeun: {
    yunha: ["대운이란 10년 단위로 바뀌는 큰 운의 흐름이네.", "마치 인생이라는 강의 물줄기가 10년마다 방향을 트는 것과 같지. 같은 사람이라도 대운이 바뀌면 삶의 색깔이 완전히 달라지네.", "지금 자네는 甲子 대운에 있으니 새로운 시작과 도약의 에너지가 가장 강한 시기야.", "이 시기를 잘 활용하면 인생의 큰 전환점을 만들 수 있을 걸세."],
    harin: ["대운! 이건 인생의 큰 챕터 같은 거야~ 📖", "10년마다 한 번씩 바뀌는 건데, 책으로 치면 1장, 2장, 3장... 이런 느낌? 각 장마다 주제가 달라!", "지금 네 챕터는 甲子 대운이야! '새로운 시작'이 키워드야~ 뭔가 큰 결심하기 딱 좋은 때라구! 🚀", "이 좋은 타이밍 놓치면 안 돼! 하고 싶었던 거 있으면 지금이야~ 💪"],
    jiho: ["대운은 10년 주기로 바뀌는 운의 큰 흐름이야.", "인생 전체를 조감도로 본다고 생각하면 돼. 어떤 10년은 오르막, 어떤 10년은 내리막인 거지.", "현재 41~50세 甲子 대운은 도약의 시기야. 목(木)의 생동감과 수(水)의 지혜가 함께하는 구간이거든.", "여기서 뿌린 씨앗이 다음 대운에서 열매를 맺어. 장기적 관점에서 투자하기 좋은 시기지."],
    seojin: ["대운... 10년 단위 운의 흐름입니다.", "대운이 좋다고 가만히 있으면 되는 게 아니에요. 좋은 바람이 불 때 돛을 올려야 배가 가는 법이죠.", "현재 甲子 대운, 도약기입니다. 솔직히 지금 안 하면 언제 하실 건가요?", "...뭐, 선택은 본인 몫이지만요. 기회는 기다려주지 않습니다."],
    noeul: ["대운은 인생이라는 강의 굽이굽이란다.", "10년마다 강줄기가 방향을 바꾸듯, 우리 삶에도 큰 전환이 찾아오지. 어떤 시기는 급류이고, 어떤 시기는 잔잔한 호수야.", "지금 네 대운은 甲子. 새로운 시작을 의미하는 글자란다. 마치 봄이 온 것처럼 모든 것이 싹트는 시기야.", "서두르지 않아도 괜찮아. 좋은 시기는 꽤 길거든. 차분하게 준비하면서 나아가렴."],
    myo: ["대운 타임라인이야~! 🎢", "10년마다 운이 확 바뀌는 건데, 롤러코스터 타는 거랑 비슷해! 올라갈 때도 있고 내려갈 때도 있구~", "지금은 甲子 대운! 도약기라구!! 내가 보기엔 지금이 네 인생에서 제일 신나는 구간이야~ 🎉", "이때 뭔가 시작하면 대박 날 확률 높아! 뭐 망해도 내 탓은 하지 말구~ 😹"],
  },
  yearly: {
    yunha: ["2026년 병오년의 운세를 살펴보겠네.", "병화(丙火)와 오화(午火)가 겹치니 불의 기운이 매우 강한 해일세. 자네의 壬水 일간과는 수화기제(水火旣濟)의 관계라 오히려 좋은 조합이야.", "상반기에는 새로운 기회가 찾아오고, 하반기에는 그 기회를 키워가는 시기가 될 걸세.", "다만 7~8월은 화(火)가 극에 달하니 건강 관리에 신경 쓰게나."],
    harin: ["올해 운세다~!! 두근두근 💓", "2026년은 丙午년이야! 불의 해! 네 壬水랑 만나면 수화기제(물과 불의 완벽한 조합)라서 사실 되게 좋은 해야!", "연애운 대박이야!! 💕 특히 봄~초여름에 설레는 만남이 올 수 있어! 인연의 실이 움직이고 있다구~", "근데 7~8월은 좀 지칠 수 있으니까 무리하지 마! 가을부터 다시 운이 올라가~ 🍂"],
    jiho: ["2026년 丙午년 세운 분석이야.", "병화(丙)가 정화(午)를 만나 화(火)의 기운이 극대화되는 해야. 너의 壬水와는 정관 관계라 사회적 성취와 관련이 깊어.", "재물운과 직업운이 상승세야. 특히 3~5월이 투자나 이직에 좋은 시기로 보여.", "건강 면에서는 심장·혈압 관련해서 주의가 필요하고, 충분한 수면이 핵심이야."],
    seojin: ["올해 운세입니다. 팩트만 말씀드릴게요.", "丙午년, 화기(火氣)가 극성인 해예요. 좋게 말하면 열정적, 나쁘게 말하면 과열되기 쉬운 해죠.", "직업운과 재물운은 상반기에 집중되어 있어요. 기회가 왔을 때 망설이면 놓칩니다.", "건강요? 7~8월에 번아웃 조심하세요. 그때 쓰러지면 하반기 전체가 날아갑니다."],
    noeul: ["올 한해의 운세를 봐볼까나.", "2026년 병오년은 불의 기운이 왕성한 해란다. 네 壬水와 만나면 수화기제, 즉 물과 불이 아름답게 어우러지는 형상이야.", "봄에는 새로운 인연이, 여름에는 도전의 기회가, 가을에는 결실이 찾아올 게야. 겨울에는 쉬어가렴.", "다만 무엇이든 과하면 독이 되는 법이니, 열정도 적당히 조절하는 지혜가 필요해."],
    myo: ["2026년 운세 오픈~! 🎊", "丙午년이라 불불불! 🔥🔥🔥 근데 네 壬水랑 만나면 오히려 찰떡궁합이야! 물이 불을 다스리니까~", "연애운 ⬆️ 재물운 ⬆️ 직업운 ⬆️ 거의 다 올라가! 특히 봄에 좋은 일 생길 거야~", "근데 7~8월에 좀 지칠 수 있어... 그때는 낮잠 자면서 쉬어~ 😴"],
  },
  personality: {
    yunha: ["사주로 보는 자네의 성격을 분석해보겠네.", "壬水 일간에 午火 지지라... 겉으로는 잔잔한 호수처럼 보이지만 속에는 뜨거운 열정이 숨어있는 사람이야.", "직관력이 뛰어나고 상황 파악이 빠르네. 다만 한 곳에 오래 머무는 걸 답답해하는 경향이 있을 걸세.", "자네의 가장 큰 무기는 적응력이네. 어떤 환경에서든 물처럼 스며드는 힘이 있어."],
    harin: ["성격 분석! MBTI보다 훨씬 깊다구~ 😎", "壬水 일간이면 기본적으로 머리 좋고 눈치 빠른 타입이야! 근데 午火가 같이 있으니까 가만히 있는 걸 못 참는 스타일이지?", "사람들이 너 보면 '쿨해 보이는데 사실 열정적인 사람'이라고 느낄 거야. 맞지? ㅎㅎ", "약점이라면... 한 가지에 집중하는 게 어려울 수 있어! 이것저것 관심사가 너무 많아서~ 😂"],
    jiho: ["사주 기반 성격 분석이야. 객관적으로 봐보자.", "壬水 일간은 적응력과 지적 호기심이 특징이야. 새로운 분야를 빠르게 습득하는 능력이 있지.", "午火 지지가 함께하니 내면에 강한 표현 욕구가 있어. 리더십 잠재력이 높은 조합이야.", "다만 변화를 추구하는 성향 때문에 꾸준함이 부족해 보일 수 있으니, 의식적으로 루틴을 만드는 게 좋아."],
    seojin: ["성격 분석입니다. 솔직하게 갑니다.", "壬水 일간, 지능은 높은 편이에요. 문제는 그걸 알고 있다는 거죠. 가끔 주변을 은연중에 깔보는 경향이 있을 수 있어요.", "午火가 있어서 열정적이긴 한데, 식는 것도 빠릅니다. '작심삼일'이라는 말 들어보신 적 있죠?", "...불편하셨다면 죄송합니다. 근데 자기 약점을 아는 게 첫 번째 단계예요."],
    noeul: ["네 성격의 뿌리를 들여다보자꾸나.", "壬水 일간이란 건 큰 바다 같은 마음을 가졌다는 뜻이야. 넓고 깊은 포용력이 있지만, 때로는 방향을 잃기도 하지.", "午火가 함께하니 가슴 속에 뜨거운 불꽃을 품고 있구나. 차가워 보여도 사실 누구보다 정이 많은 사람이야.", "세상이 네 깊이를 다 이해하지 못해도 괜찮아. 네 가치는 시간이 증명해줄 거야."],
    myo: ["성격 분석 타임~! 😼", "壬水 일간이면 기본적으로 똑똒이! 머리 회전이 빠르고 눈치도 좋아~ 인정!", "근데 午火가 붙어있어서 가만히 있는 걸 못 참지? 새로운 거 안 하면 근질근질한 타입이야 ㅋㅋㅋ", "약점은~ 좀 끈기가 부족할 수 있어! 근데 그것도 매력이라구~ 😽"],
  },
  sipsin: {
    yunha: ["십신을 살펴보겠네. 사주 해석에서 가장 중요한 부분 중 하나일세.", "십신이란 일간(나)을 기준으로 다른 글자들과의 관계를 보는 거라네. 비견은 형제·친구, 식신은 재능·표현, 정관은 직업·명예를 뜻하지.", "자네의 경우 편인이 가장 강하니 학문이나 전문 분야에서 두각을 나타낼 수 있네. 비정통적인 방식으로 성공하는 타입이야.", "식신도 꽤 있으니 창의적인 분야가 잘 맞을 걸세."],
    harin: ["십신! 어렵게 생각하지 마~ 쉽게 설명해줄게! 😊", "십신은 네 사주 속 글자들이 '나'한테 어떤 역할인지 보는 거야. 마치 인생 드라마의 캐스팅 같은 거지~", "편인이 제일 강하네! 편인은 '비범한 재능' 같은 거야. 남들이 안 가는 길에서 빛나는 타입! 🌟", "식신도 있으니까 먹는 것도 좋아하고... 아 식신이 그 식신만은 아니야 ㅋㅋ 재능과 표현력이야!"],
    jiho: ["십신 관계도야. 이건 사주 분석의 핵심이라 좀 자세히 볼게.", "일간(壬水)을 기준으로 각 글자가 어떤 관계인지를 분석한 거야. 비견=동료, 식신=재능, 정재=정당한 수입, 정관=직업과 사회적 위치를 나타내.", "편인이 최강이네. 전문성과 비범한 사고력을 뜻해. 학자, 연구원, 전략가 같은 포지션에 강해.", "정관과 편재도 적당히 있으니 사회적 성공과 부 모두 가능한 구조야."],
    seojin: ["십신... 사주 해석의 핵심입니다. 집중하세요.", "십신은 '나(일간)'와 다른 글자들의 역학관계예요. 생(生)하는지, 극(克)하는지, 같은 편인지에 따라 달라지죠.", "당신은 편인이 가장 강합니다. 독학 능력이 뛰어나고, 기존 틀을 깨는 사고를 하는 타입이에요.", "...그래서 가끔 주류에서 벗어나 보이기도 하죠. 하지만 그게 당신의 강점입니다."],
    noeul: ["십신은 네 주변 사람과 환경, 그리고 재능을 보여주는 거란다.", "나를 중심으로 주변 글자들이 어떤 역할을 하는지 보는 거야. 어떤 글자는 나를 도와주고, 어떤 글자는 시련을 주지.", "편인이 강하다는 건 남다른 시선을 가졌다는 뜻이야. 세상을 보는 눈이 보통 사람과 다르단다.", "그 다름이 외로울 때도 있겠지만, 결국 그게 네 가장 큰 자산이 될 거야."],
    myo: ["십신 관계도! 이건 좀 복잡하지만 쉽게 설명해줄게~ 🤓", "십신은 네 사주 속 글자들이 나한테 어떤 의미인지 보는 거야! 친구인지, 도와주는 건지, 시험하는 건지~", "편인이 제일 강해! 편인은 '천재적 재능' 같은 거야! 남들이 못 보는 걸 보는 눈이 있다구~ 👀", "근데 너무 혼자 파고들면 외로워질 수 있으니까 가끔은 나랑 놀자~ 😹"],
  },
  sinsal: {
    yunha: ["신살은 사주에 나타나는 특수한 기운이네.", "길신(吉神)은 축복과 보호의 기운이고, 흉신(凶神)은 시련과 주의의 기운일세. 단, 흉신이 있다고 반드시 나쁜 것은 아니네.", "천을귀인이 있으니 위기 때마다 도와줄 귀인이 나타나는 좋은 신살이야. 감사할 줄 아는 마음이 이 신살을 더 강하게 만들지.", "역마살은 이동과 변화의 기운이야. 가만히 있으면 안 되는 팔자라네."],
    harin: ["신살! 이건 특수 능력 같은 거야~ 🦸", "좋은 신살은 게임의 버프 스킬이고, 안 좋은 건 디버프 스킬이라고 생각하면 돼!", "천을귀인이 있어! 이건 진짜 좋은 거야~ 힘들 때 꼭 도와주는 사람이 나타나는 능력이거든! ⭐", "도화살도 있네?! 매력 뿜뿜~ 사람을 끌어당기는 힘이 있다는 뜻이야 💕"],
    jiho: ["신살 분석이야. 통계적으로도 참고할 만한 지표지.", "신살은 특정 간지 조합에서 나타나는 특수 패턴이야. 경험적으로 축적된 데이터라고 볼 수 있어.", "천을귀인은 사주학에서 가장 강력한 길신 중 하나야. 사회적 네트워크와 인복을 나타내지.", "역마살은 변화와 이동의 기운인데, 현대 사회에서는 해외 근무나 출장 많은 직종과 잘 맞아."],
    seojin: ["신살 분석입니다.", "길신이든 흉신이든 미신처럼 맹신하면 안 돼요. 하지만 수천 년간 축적된 패턴이니 참고할 가치는 있죠.", "천을귀인이 있으시네요. 좋습니다. 인맥에 복이 있다는 뜻이에요. 다만 귀인도 매번 올 수는 없으니 스스로 서는 힘도 키우세요.", "역마살... 한 곳에 정착하기 힘든 기운이에요. 그걸 약점으로 볼지 강점으로 볼지는 본인 몫입니다."],
    noeul: ["신살은 하늘이 내려준 특별한 표식이란다.", "길신은 축복의 별이고, 흉신은 배움의 별이야. 흉신이 있다고 무서워할 건 없어. 그건 네가 극복해야 할 과제를 알려주는 거니까.", "천을귀인이 있구나! 어려울 때마다 도움의 손길이 찾아올 게야. 그 은혜를 잊지 않는 마음이 중요하단다.", "역마살도 있으니 집에만 있으면 안 돼. 밖으로 나가야 운이 트이는 팔자야."],
    myo: ["특수 능력치 언락! 🎮✨", "신살은 사주에 숨겨진 히든 스킬이야! 좋은 것도 있고 조심할 것도 있구~", "천을귀인 있어!! 이건 SSR급 신살이야! 위기 때 구원자가 나타나는 능력! 부럽다~ 🌟", "도화살도 있어?! 매력 MAX 버프! 사람을 홀리는 능력이라구~ 나도 홀렸어 😻"],
  },
  lucky: {
    yunha: ["마지막으로 행운의 기운을 끌어오는 방법을 알려주겠네.", "용신이 金이니 금속 소재를 가까이 하고, 흰색이나 은색 계열의 옷이 기운을 북돋아줄 걸세.", "방위로는 서쪽이 좋고, 숫자로는 4와 9가 자네에게 행운을 가져다줄 걸세.", "일상 속 작은 변화가 큰 운을 불러온다네. 너무 거창하게 생각할 필요 없네."],
    harin: ["행운 아이템 모음이야~! 🍀✨", "금색이나 은색 액세서리 추천! 반지든 목걸이든 뭐든! 金 기운 UP시켜주거든~", "숫자 4랑 9가 행운의 숫자래! 비밀번호에 넣어보는 건 어때? ㅎㅎ 그리고 서쪽을 자주 바라보면 좋대~", "오후 3~5시(신시)가 네 행운의 시간이야! 중요한 결정은 이때 해봐~ 💫"],
    jiho: ["행운 가이드야. 실천할 수 있는 것들 위주로 알려줄게.", "용신 金에 맞춰서, 금속 소재 소품이나 흰색·은색 계열 아이템을 활용하면 좋아.", "서쪽 방향이 길방이니 업무 공간에서 서쪽을 향해 앉거나, 서쪽 방향으로의 이동이 유리해.", "행운의 시간대는 신시(15~17시). 중요 미팅이나 의사결정은 이 시간대에 잡는 걸 추천해."],
    seojin: ["행운 가이드... 이걸 믿으시든 말든 자유지만요.", "金이 용신이니 금속 소재, 흰색 계열 추천합니다. 과학적 근거? 없어요. 근데 플라시보도 효과니까요.", "서쪽이 길방이에요. 이사나 여행 계획 있으시면 참고하시고. 숫자는 4, 9.", "...솔직히 이런 거 지키는 것보다 노력하는 게 더 효과적이긴 합니다. 하지만 심리적 안정감은 줄 수 있죠."],
    noeul: ["이 것들을 가까이 두면 좋은 기운이 찾아올 게야.", "金의 기운을 채우려면 금속 소재의 물건을 지니고 다니렴. 작은 열쇠고리 하나라도 괜찮아.", "서쪽에 창이 있으면 자주 열어보렴. 서쪽에서 좋은 바람이 불어올 게야. 숫자 4와 9도 기억해두고.", "행운이란 건 멀리 있는 게 아니란다. 매일의 작은 습관이 운명을 바꾸는 거야."],
    myo: ["행운 부스터 아이템~! 🚀", "金 기운 채우려면 반짝반짝한 거! 금색 팔찌, 은색 귀걸이, 뭐든 좋아~ 내 방울도 금색이거든 🔔", "방향은 서쪽! 숫자는 4, 9! 로또 살 때 참고해~ (당첨 안 돼도 내 탓 아님 😹)", "오후 3~5시가 행운 타임이야! 이때 고양이를 쓰다듬으면 운이 더 올라간대~ 🐱✨"],
  },
};

/* ─── CharacterBubble 컴포넌트 ─── */
function CharacterBubble({ character, section, delay }: {
  character: { id: string; name: string; image: string; elementColor: string };
  section: string;
  delay: number;
}) {
  const comments = SECTION_COMMENTS[section]?.[character.id];
  if (!comments || comments.length === 0) return null;
  return (
    <div className="flex gap-3 items-start mb-4" style={{ animation: `fadeInUp 0.6s ease-out ${delay}s both` }}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br ${character.elementColor}`}>
        <Image src={character.image} alt={character.name} width={32} height={32} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-white/30 text-[10px] mb-1 ml-1">{character.name}</p>
        {comments.map((comment, i) => (
          <div
            key={i}
            className="bg-white/[0.05] backdrop-blur border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 text-white/85 text-sm leading-relaxed"
            style={{ animation: `fadeInUp 0.4s ease-out ${delay + 0.15 * i}s both` }}
          >
            {comment}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 캐릭터 해석 (확장) ─── */
const INTERPRETATIONS: Record<string, { section: string; messages: string[] }[]> = {
  yunha: [
    { section: "총운", messages: [
      "…자네의 사주를 찬찬히 살펴보았네.",
      "일간이 壬水라, 깊은 바다와 같은 지혜를 타고났네. 겉으로는 고요하나 속은 끊임없이 흐르고 있지.",
      "木의 기운이 강하니 새로운 것을 향한 열망이 대단하네만, 金이 약해서 결단의 순간에 흔들릴 수 있네.",
    ]},
    { section: "연애", messages: [
      "도화살이 있으니 이성에게 인기가 좋을 것이네.",
      "다만 壬水의 깊은 내면을 이해해줄 사람을 만나는 것이 중요하지.",
    ]},
    { section: "재물", messages: [
      "편재의 기운이 있어 투자 감각은 좋으나, 올해는 보수적으로 가는 게 낫겠네.",
    ]},
    { section: "조언", messages: [
      "금년은 흐름을 거스르지 말고, 물처럼 유연하게 대처하게.",
      "용신인 金의 기운을 보충하면 한결 안정될 것이네. 서쪽 방향, 금색 계열을 가까이하게나.",
    ]},
  ],
  harin: [
    { section: "총운", messages: [
      "우와~ 재밌는 사주다! 진짜 독특해!",
      "壬水 일간이라 머리 좋은 타입이네 ㅎㅎ 근데 좀 오버씽킹하는 스타일일듯?",
      "木이 많아서 아이디어는 넘치는데 金이 부족하니까 실행력이 좀 아쉬울 수 있어!",
    ]},
    { section: "연애", messages: [
      "도화살 있으니까 인기 많을 거야~ 근데 너무 이상만 높이지 마! ㅋㅋ",
      "올해 하반기에 좋은 인연 올 확률 높아 보여!",
    ]},
    { section: "재물", messages: [
      "돈은… 벌 수 있는데 쓰는 것도 좋아하는 타입이넹 ㅋㅋ 저축 좀 해!",
    ]},
    { section: "조언", messages: [
      "올해는 불꽃처럼 확 질러봐! 🔥 근데 건강은 챙겨야 해~",
      "金 기운 보충하려면 운동 추천! 특히 웨이트 같은 거!",
    ]},
  ],
  jiho: [
    { section: "총운", messages: [
      "음, 차 한 잔 마시면서 천천히 이야기해볼까.",
      "壬水 일간이니까, 자네는 원래 적응력이 좋은 사람이야. 어디서든 물처럼 스며들지.",
      "木 기운이 좀 많긴 한데, 그게 오히려 성장의 원동력이 될 거야.",
    ]},
    { section: "연애", messages: [
      "감정 표현을 좀 더 하는 게 좋을 것 같아. 속으로만 삭이지 말고.",
      "올해 좋은 사람 만날 수 있어. 열린 마음으로.",
    ]},
    { section: "재물", messages: [
      "큰 투자보다는 꾸준한 수입에 집중하는 게 좋겠어.",
    ]},
    { section: "조언", messages: [
      "조급해하지 말고, 흘러가는 대로 한번 맡겨봐.",
      "金 기운이 부족하니까, 규칙적인 생활 패턴을 만들어보는 건 어때?",
    ]},
  ],
  seojin: [
    { section: "총운", messages: [
      "후… 꽤 흥미로운 사주로군요.",
      "壬水 일간, 지혜의 물이라… 나쁘지 않네요. 깊은 사고력과 직관을 가졌어요.",
      "다만 木이 과다하니 우유부단함을 조심하셔야 할 겁니다.",
    ]},
    { section: "연애", messages: [
      "…연애요? 도화살이 있으니 인기야 있겠지만, 본인이 벽을 치고 있잖아요.",
      "좀 더 솔직해지세요. 어렵지 않을 거예요… 아마도.",
    ]},
    { section: "재물", messages: [
      "재물운은 나쁘지 않은데, 충동 소비 주의하세요.",
    ]},
    { section: "조언", messages: [
      "용신이 金이니까 결단력을 키우세요. 망설이지 마시고.",
      "…뭐, 제가 옆에서 봐드리죠. 감사하실 필요 없어요.",
    ]},
  ],
  noeul: [
    { section: "총운", messages: [
      "허허, 이 늙은이가 별을 읽어보마.",
      "壬水 일간이라… 깊은 바다 같은 아이로구나. 세상의 이치를 꿰뚫는 눈을 가졌어.",
      "木의 기운이 왕성하니 올 봄에 새로운 기회가 올 게야.",
    ]},
    { section: "연애", messages: [
      "좋은 인연은 억지로 찾는 게 아니란다. 자연스럽게 다가올 거야.",
      "네 진심을 보여주면, 상대도 마음을 열 게다.",
    ]},
    { section: "재물", messages: [
      "욕심내지 말거라. 필요한 만큼만 가지면 충분하단다.",
    ]},
    { section: "조언", messages: [
      "걱정 말거라. 네 운명의 별은 밝게 빛나고 있단다.",
      "金 기운을 보충하려면, 새벽 산책을 해보렴. 맑은 공기가 도움이 될 거야.",
    ]},
  ],
  myo: [
    { section: "총운", messages: [
      "냐하~ 네 사주 들여다봤어! 꽤 재밌는 운명이네~",
      "壬水 일간이라니~ 물처럼 변화무쌍한 운명이야 ✨ 근데 그게 매력이지!",
      "木이 이렇게 많으면… 비밀 하나 알려줄까? 아, 역시 안 알려줄래~ 냐하핫!",
    ]},
    { section: "연애", messages: [
      "도화살 있으니까 인기 대폭발이야~ 🌸",
      "근데 너무 장난치지 마~ 진심인 사람 놓친다옹!",
    ]},
    { section: "재물", messages: [
      "돈? 들어오긴 하는데 나가는 것도 빠를 거야~ 고양이 간식값은 남겨둬! 🐟",
    ]},
    { section: "조언", messages: [
      "그냥 재밌게 살아! 운명 따윈 내가 장난쳐줄 테니까~",
      "아 맞다, 金 기운 보충해야 하니까 반짝이는 거 모아봐! 악세사리 같은 거~ ✨",
    ]},
  ],
};

/* ─── 공유 카드 테마 ─── */
const SHARE_THEMES = [
  { id: "soomook", name: "수묵화", bg: "from-gray-900 to-gray-800", text: "text-gray-100", accent: "border-gray-500" },
  { id: "neon", name: "네온", bg: "from-purple-900 to-pink-900", text: "text-pink-100", accent: "border-pink-400" },
  { id: "minimal", name: "미니멀", bg: "from-white to-gray-100", text: "text-gray-900", accent: "border-gray-300" },
  { id: "cosmos", name: "우주", bg: "from-indigo-950 to-violet-950", text: "text-violet-100", accent: "border-violet-400" },
  { id: "romantic", name: "로맨틱", bg: "from-rose-900 to-pink-800", text: "text-rose-100", accent: "border-rose-300" },
  { id: "dark", name: "다크", bg: "from-black to-gray-950", text: "text-gray-100", accent: "border-gray-600" },
];

/* ─── 도넛 차트 SVG ─── */
function DonutChart({ data }: { data: typeof OHAENG }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 60, cx = 80, cy = 80, stroke = 24;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" className="w-40 h-40 mx-auto">
      {data.map((d) => {
        const pct = d.value / total;
        const dash = circumference * pct;
        const gap = circumference - dash;
        const currentOffset = offset;
        offset += dash;
        return (
          <circle
            key={d.name}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={d.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-currentOffset}
            className="animate-[donutGrow_1s_ease-out_0.5s_both]"
            style={{ transformOrigin: "center" }}
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-white text-xs font-bold">오행</text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-white/50 text-[10px]">밸런스</text>
    </svg>
  );
}

/* ─── 레이더 차트 (Pentagon) SVG ─── */
function RadarChart({ scores }: { scores: { name: string; score: number }[] }) {
  const cx = 100, cy = 100, maxR = 75;
  const n = scores.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const pointAt = (i: number, r: number) => {
    const angle = startAngle + i * angleStep;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = scores.map((s, i) => pointAt(i, (s.score / 100) * maxR));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg viewBox="0 0 200 200" className="w-52 h-52 mx-auto">
      {gridLevels.map((level) => {
        const pts = scores.map((_, i) => pointAt(i, maxR * level));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return <path key={level} d={path} fill="none" stroke="white" strokeOpacity={0.1} strokeWidth={0.5} />;
      })}
      {scores.map((_, i) => {
        const p = pointAt(i, maxR);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="white" strokeOpacity={0.08} strokeWidth={0.5} />;
      })}
      <path d={dataPath} fill="rgba(139,92,246,0.25)" stroke="#8b5cf6" strokeWidth={1.5} className="animate-[radarGrow_1s_ease-out_0.5s_both]" />
      {scores.map((s, i) => {
        const p = pointAt(i, maxR + 18);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-white/60 text-[10px]">
            {s.name}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── WaveDivider ─── */
function WaveDivider() {
  return (
    <div className="py-4 opacity-30">
      <svg viewBox="0 0 1200 40" className="w-full h-5" preserveAspectRatio="none">
        <path d="M0,20 Q300,0 600,20 T1200,20" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
      </svg>
    </div>
  );
}

/* ─── Main Content ─── */
function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shareTheme, setShareTheme] = useState("cosmos");

  const name = searchParams.get("name") || "당신";
  const counselorId = searchParams.get("counselor") || "yunha";
  const character = characters.find((c) => c.id === counselorId) || characters[0];
  const interpretation = INTERPRETATIONS[character.id] || INTERPRETATIONS.yunha;
  const selectedTheme = SHARE_THEMES.find((t) => t.id === shareTheme) || SHARE_THEMES[3];

  const handleDeepChat = (question?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (question) params.set("initial", question);
    router.push(`/chat/${character.id}?${params.toString()}`);
  };

  const maxSipsin = SIPSIN_MAP.reduce((a, b) => a.strength > b.strength ? a : b);

  return (
    <main className="relative min-h-screen bg-[#0a0e27]">
      <Starfield />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-600/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 space-y-2">

        {/* ═══ SECTION 1: 상단 헤더 ═══ */}
        <section className="text-center stagger-1">
          <div className={`inline-block p-1 rounded-full bg-gradient-to-br ${character.elementColor} mb-4`}>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#0a0e27]">
              <Image src={character.image} alt={character.name} width={96} height={96} className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {name}님의 사주를 봤어요
          </h1>
          <p className="text-white/50 text-sm mb-4">
            상담사 <span className="text-white/80">{character.name}</span> · {character.element} · 1985년 2월 4일 오후 3시
          </p>
          <div className="inline-block bg-white/[0.04] backdrop-blur border border-white/[0.08] rounded-2xl px-6 py-3">
            <p className="text-white/40 text-xs mb-1">일주(日柱) 기반 유형</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
              {PERSONALITY.type}
            </p>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 2: 사주 팔자 4주 카드 ═══ */}
        <CharacterBubble character={character} section="saju" delay={0.2} />
        <section className="stagger-2">
          <h2 className="section-title">사주 팔자</h2>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {SAJU_PILLARS.map((p) => (
              <div key={p.label} className="glass-card rounded-2xl p-3 sm:p-4 text-center relative overflow-hidden">
                <p className="text-white/40 text-xs mb-2">{p.label}</p>

                {/* 천간 */}
                <div className="mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full mb-1 inline-block"
                    style={{ backgroundColor: OH_COLORS[GAN_OH[p.gan]] + "25", color: OH_COLORS[GAN_OH[p.gan]] }}>
                    {GAN_OH[p.gan]} · {GAN_YY[p.gan]}
                  </span>
                  <p className="text-3xl font-bold leading-none" style={{ color: OH_COLORS[GAN_OH[p.gan]] }}>
                    {p.gan}
                  </p>
                </div>

                {/* 지지 */}
                <div className="mb-2">
                  <p className="text-2xl mt-1" style={{ color: OH_COLORS[JI_OH[p.ji]] + "cc" }}>
                    {p.ji}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full inline-block"
                    style={{ backgroundColor: OH_COLORS[JI_OH[p.ji]] + "25", color: OH_COLORS[JI_OH[p.ji]] }}>
                    {JI_OH[p.ji]} · {JI_YY[p.ji]}
                  </span>
                </div>

                {/* 십신 */}
                <div className="border-t border-white/[0.06] pt-2 space-y-0.5">
                  <p className="text-white/50 text-[10px]">{p.sipsin_gan}</p>
                  <p className="text-white/30 text-[10px]">{p.sipsin_ji}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 3: 오행 밸런스 ═══ */}
        <CharacterBubble character={character} section="ohaeng" delay={0.4} />
        <section className="stagger-3">
          <h2 className="section-title">오행 밸런스</h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
              <DonutChart data={OHAENG} />
              <div className="flex-1 space-y-3 w-full">
                {OHAENG.map((o) => (
                  <div key={o.name} className="flex items-center gap-3">
                    <span className="text-sm w-6 text-center font-bold" style={{ color: o.color }}>{o.name}</span>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full animate-[barGrow_0.8s_ease-out_0.6s_both]"
                        style={{ width: `${o.value}%`, backgroundColor: o.color }} />
                    </div>
                    <span className="text-white/40 text-xs w-8 text-right">{o.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 오행 설명 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {OHAENG.map((o) => (
                <div key={o.name} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: o.color }} />
                  <span><span style={{ color: o.color }} className="font-medium">{o.name}({o.label})</span> — {o.desc}</span>
                </div>
              ))}
            </div>

            {/* 용신 */}
            <div className="border-t border-white/[0.06] pt-4">
              <div className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-4">
                <span className="text-2xl">⚖️</span>
                <div>
                  <p className="text-white/80 text-sm font-medium mb-1">
                    용신(用神): <span className="font-bold" style={{ color: OH_COLORS["金"] }}>金</span>
                  </p>
                  <p className="text-white/50 text-xs leading-relaxed">
                    당신의 사주에서 金이 가장 부족합니다. 절제와 결단력을 보충하면 균형이 잡힙니다.
                    금색 계열의 악세사리, 서쪽 방향, 가을 계절이 도움됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 4: 대운 타임라인 ═══ */}
        <CharacterBubble character={character} section="daeun" delay={0.6} />
        <section className="stagger-4">
          <h2 className="section-title">대운(大運) 타임라인</h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex gap-0 min-w-[600px] relative">
                {/* 연결 라인 */}
                <div className="absolute top-8 left-6 right-6 h-[2px] bg-white/10" />
                {DAEUN.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center relative">
                    <p className="text-white/40 text-[10px] mb-2">{d.age}세</p>
                    <div className={`w-4 h-4 rounded-full z-10 mb-2 ${d.current
                      ? "bg-violet-500 ring-4 ring-violet-500/30 animate-pulse"
                      : "bg-white/20"}`} />
                    <p className={`text-sm font-bold mb-0.5 ${d.current ? "text-violet-300" : "text-white/60"}`}>
                      {d.hanja}
                    </p>
                    <p className="text-lg mb-1">{d.icon}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.current
                      ? "bg-violet-500/20 text-violet-300"
                      : "bg-white/5 text-white/40"}`}>
                      {d.keyword}
                    </span>
                    {d.current && (
                      <span className="text-[9px] text-violet-400 mt-1 font-medium">← 현재</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 5: 올해 운세 ═══ */}
        <CharacterBubble character={character} section="yearly" delay={0.8} />
        <section className="stagger-5">
          <h2 className="section-title">2026년 {YEAR_FORTUNE.hanja}년 운세</h2>
          <div className="glass-card rounded-2xl p-5 space-y-6">

            <RadarChart scores={YEAR_FORTUNE.scores} />

            {/* 운세 항목 */}
            <div className="space-y-3">
              {YEAR_FORTUNE.scores.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/70 text-sm font-medium">{s.name}</span>
                    <span className="text-white/90 text-sm font-bold">{s.score}<span className="text-white/40 text-xs">/100</span></span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-1">
                    <div className="h-full rounded-full animate-[barGrow_0.8s_ease-out_0.8s_both]"
                      style={{
                        width: `${s.score}%`,
                        background: s.score >= 80 ? "linear-gradient(90deg,#8b5cf6,#a78bfa)"
                          : s.score >= 60 ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
                          : "linear-gradient(90deg,#6b7280,#9ca3af)"
                      }} />
                  </div>
                  <p className="text-white/40 text-xs">{s.comment}</p>
                </div>
              ))}
            </div>

            {/* 월별 히트맵 */}
            <div>
              <p className="text-white/50 text-xs mb-2 font-medium">월별 운세 흐름</p>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {YEAR_FORTUNE.monthly.map((v, i) => (
                  <div key={i} className="text-center">
                    <div className="aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors"
                      style={{
                        backgroundColor: `rgba(139,92,246,${v / 120})`,
                        color: v > 80 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                      }}>
                      {v}
                    </div>
                    <p className="text-white/30 text-[9px] mt-0.5">{i + 1}월</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 6: 성격 분석 ═══ */}
        <CharacterBubble character={character} section="personality" delay={1.0} />
        <section className="stagger-6">
          <h2 className="section-title">성격 분석</h2>
          <div className="glass-card rounded-2xl p-5 space-y-5">
            <div className="text-center">
              <p className="text-lg font-bold bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
                {PERSONALITY.type}
              </p>
            </div>

            {/* 4축 슬라이더 */}
            <div className="space-y-4">
              {PERSONALITY.axes.map((axis) => (
                <div key={axis.left}>
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{axis.left}</span>
                    <span>{axis.right}</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full relative">
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 animate-[barGrow_0.8s_ease-out_1s_both]"
                        style={{ width: `${axis.value}%` }} />
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg shadow-violet-500/30 animate-[barGrow_0.8s_ease-out_1s_both]"
                      style={{ left: `calc(${axis.value}% - 8px)` }} />
                  </div>
                  <p className="text-center text-white/30 text-[10px] mt-0.5">{axis.value}%</p>
                </div>
              ))}
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {PERSONALITY.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 7: 십신 관계도 ═══ */}
        <CharacterBubble character={character} section="sipsin" delay={1.2} />
        <section className="stagger-7">
          <h2 className="section-title">십신(十神) 관계도</h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {SIPSIN_MAP.map((s) => {
                const isMax = s.name === maxSipsin.name;
                return (
                  <div key={s.name} className={`text-center p-2 sm:p-3 rounded-xl transition-all ${isMax
                    ? "bg-violet-500/15 border border-violet-500/30 ring-1 ring-violet-500/20"
                    : "bg-white/[0.02]"}`}>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center mb-1.5 text-sm sm:text-base font-bold"
                      style={{
                        backgroundColor: `rgba(139,92,246,${s.strength / 120})`,
                        color: s.strength > 50 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                      }}>
                      {s.strength}
                    </div>
                    <p className={`text-xs font-medium mb-0.5 ${isMax ? "text-violet-300" : "text-white/70"}`}>
                      {s.name}
                    </p>
                    <p className="text-[9px] text-white/30">{s.desc}</p>
                    {isMax && <span className="text-[9px] text-violet-400 font-medium">★ 최강</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 8: 신살 분석 ═══ */}
        <CharacterBubble character={character} section="sinsal" delay={1.4} />
        <section className="stagger-8">
          <h2 className="section-title">신살(神殺) 분석</h2>
          <div className="space-y-2">
            {SINSAL.map((s) => (
              <div key={s.name} className="glass-card rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/90 text-sm font-bold">{s.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${s.type === "길신"
                      ? "bg-green-500/15 text-green-400"
                      : s.type === "흉신"
                      ? "bg-red-500/15 text-red-400"
                      : "bg-yellow-500/15 text-yellow-400"}`}>
                      {s.type}
                    </span>
                    <span className="text-yellow-400 text-xs">{"★".repeat(s.stars)}{"☆".repeat(3 - s.stars)}</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 9: 캐릭터 상세 해석 ═══ */}
        <section className="stagger-9">
          <h2 className="section-title">{character.name}의 상세 해석</h2>
          <div className="flex gap-3 items-start">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br ${character.elementColor}`}>
              <Image src={character.image} alt={character.name} width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              {interpretation.map((group, gi) => (
                <div key={gi}>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5 ml-1">{group.section}</p>
                  <div className="space-y-1.5">
                    {group.messages.map((msg, mi) => (
                      <div key={mi}
                        className="bg-white/[0.04] backdrop-blur border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 text-white/90 text-sm leading-relaxed msg-bubble"
                        style={{ animationDelay: `${0.5 + gi * 0.3 + mi * 0.12}s` }}>
                        {msg}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 10: 행운 가이드 ═══ */}
        <CharacterBubble character={character} section="lucky" delay={1.6} />
        <section className="stagger-10">
          <h2 className="section-title">행운 가이드</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LUCKY_GUIDE.map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-4 text-center">
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-white/40 text-[10px] mb-1">{item.label}</p>
                <p className="text-white/90 text-sm font-bold mb-0.5">{item.value}</p>
                <p className="text-white/30 text-[10px]">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 11: AI 상담 CTA ═══ */}
        <section className="stagger-11">
          <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-blue-600/10" />
            <div className="relative z-10">
              <div className={`inline-block p-0.5 rounded-full bg-gradient-to-br ${character.elementColor} mb-3`}>
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#0a0e27]">
                  <Image src={character.image} alt={character.name} width={64} height={64} className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{character.name}에게 더 물어보기</h3>
              <p className="text-white/50 text-sm mb-4">사주를 바탕으로 더 깊은 상담을 받아보세요</p>

              <div className="flex flex-col gap-2 mb-4">
                {["올해 연애운이 궁금해요", "이직해도 될까요?", "재물운 올리려면?"].map((q) => (
                  <button key={q} onClick={() => handleDeepChat(q)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-sm hover:bg-white/[0.08] hover:text-white/90 transition-all text-left">
                    💬 {q}
                  </button>
                ))}
              </div>

              <button onClick={() => handleDeepChat()}
                className={`w-full py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r ${character.elementColor} hover:scale-[1.02] active:scale-[0.98] transition-transform`}>
                자유롭게 대화하기
              </button>
            </div>
          </div>
        </section>

        <WaveDivider />

        {/* ═══ SECTION 12: 공유 카드 ═══ */}
        <section className="stagger-12">
          <h2 className="section-title">내 사주 카드</h2>

          {/* 테마 선택 */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {SHARE_THEMES.map((theme) => (
              <button key={theme.id} onClick={() => setShareTheme(theme.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all ${shareTheme === theme.id
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"}`}>
                {theme.name}
              </button>
            ))}
          </div>

          {/* 카드 */}
          <div className={`bg-gradient-to-br ${selectedTheme.bg} rounded-2xl p-6 text-center border ${selectedTheme.accent}`}
            id="saju-card">
            <p className={`${selectedTheme.text} opacity-40 text-[10px] tracking-[0.2em] mb-3`}>✦ UNMYO ✦</p>
            <p className={`${selectedTheme.text} text-2xl font-bold mb-1`}>{name}</p>
            <p className={`${selectedTheme.text} opacity-50 text-xs mb-3`}>{PERSONALITY.type}</p>

            <div className="flex justify-center gap-3 mb-3">
              {SAJU_PILLARS.map((p) => (
                <div key={p.label} className="text-center">
                  <p className={`${selectedTheme.text} opacity-30 text-[9px]`}>{p.label}</p>
                  <p className={`${selectedTheme.text} text-lg font-bold`}>{p.gan}{p.ji}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-1.5 mb-3">
              {OHAENG.map((o) => (
                <span key={o.name} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: o.color + "25", color: o.color }}>
                  {o.name} {o.value}%
                </span>
              ))}
            </div>

            <p className={`${selectedTheme.text} opacity-60 text-xs mb-2`}>2026년 키워드</p>
            <div className="flex justify-center gap-1.5 mb-4">
              {["도약", "지혜", "결단"].map((kw) => (
                <span key={kw} className={`${selectedTheme.text} text-xs px-2.5 py-1 rounded-full bg-white/10`}>
                  {kw}
                </span>
              ))}
            </div>

            <p className={`${selectedTheme.text} opacity-20 text-[9px]`}>운묘 UNMYO · 운명의 별자리</p>
          </div>

          <button className="w-full mt-3 py-3 rounded-2xl border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20 transition-colors text-sm">
            📷 내 사주 카드 저장하기
          </button>
        </section>

        <div className="h-16" />
      </div>

      <style jsx global>{`
        .section-title {
          color: rgba(255,255,255,0.55);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }
        .glass-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.07);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { width: 0%; }
        }
        @keyframes donutGrow {
          from { stroke-dashoffset: 377; }
        }
        @keyframes radarGrow {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes msgAppear {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .msg-bubble {
          animation: msgAppear 0.4s ease-out both;
        }
        .chat-bubble {
          animation: fadeInUp 0.5s ease-out both;
        }

        ${Array.from({ length: 12 }, (_, i) => `
          .stagger-${i + 1} {
            animation: fadeInUp 0.6s ease-out ${i * 0.08}s both;
          }
        `).join("")}
      `}</style>
    </main>
  );
}

export default function SajuResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}

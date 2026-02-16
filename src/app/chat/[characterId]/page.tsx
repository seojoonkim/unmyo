'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { characters } from '@/lib/characters';
import CharacterMood, { detectMood, type Mood } from '@/components/chat/CharacterMood';
import AmbientSound from '@/components/chat/AmbientSound';
import SajuCard, { parseSajuCard, sampleSajuData } from '@/components/chat/SajuCard';
import TypingParticles, { detectParticleType } from '@/components/chat/TypingParticles';
import { triggerHaptic } from '@/lib/sound-generator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Demo messages with saju card
const demoMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: '오늘의 운세를 봐주세요!',
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'assistant',
    content: `네, 분석 결과를 알려드릴게요.\n\n[saju-card]${JSON.stringify(sampleSajuData)}[/saju-card]\n\n오늘은 대길한 날이에요! 좋은 기운이 감돌고 있으니 새로운 시도를 해보세요.`,
    timestamp: new Date(),
  },
];

export default function ChatPage({ params }: { params: Promise<{ characterId: string }> }) {
  const { characterId } = use(params);
  const router = useRouter();
  const character = characters.find((c) => c.id === characterId);
  const [messages, setMessages] = useState<Message[]>(demoMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood>('neutral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update mood based on latest assistant message
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
    if (lastAssistant) {
      setCurrentMood(detectMood(lastAssistant.content));
    }
  }, [messages]);

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <p>캐릭터를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        '운세의 흐름이 좋아 보이네요. 대길한 기운이 느껴집니다! ✨',
        '조심할 부분이 있어요. 주의가 필요한 시기입니다.',
        '분석 결과, 오행의 균형이 잘 잡혀 있어요.',
        '대박! 최고의 운세가 찾아올 예정이에요!',
        '걱정하지 마세요. 힘든 시기는 곧 지나갈 거예요.',
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      triggerHaptic();
    }, 1500 + Math.random() * 1000);
  };

  const renderMessageContent = (content: string) => {
    const sajuParsed = parseSajuCard(content);
    if (sajuParsed) {
      return (
        <>
          {sajuParsed.before && <p className="whitespace-pre-wrap mb-2">{sajuParsed.before}</p>}
          <SajuCard data={sajuParsed.data} />
          {sajuParsed.after && <p className="whitespace-pre-wrap mt-2">{sajuParsed.after}</p>}
        </>
      );
    }
    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col max-w-lg mx-auto relative">
      {/* Header */}
      <header className="chat-header">
        <button
          onClick={() => router.back()}
          className="text-white/60 hover:text-white transition-colors p-1"
          aria-label="뒤로가기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <CharacterMood
          characterId={character.id}
          characterName={character.name}
          characterImage={character.image}
          mood={currentMood}
        />
        <AmbientSound characterId={character.id} />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chat-messages-area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
          >
            <div className="relative">
              {msg.role === 'assistant' && (
                <div className="chat-bubble-particle-wrapper">
                  <TypingParticles
                    active={false}
                    type={detectParticleType(msg.content)}
                  />
                </div>
              )}
              {renderMessageContent(msg.content)}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-bubble chat-bubble-assistant" ref={typingRef}>
            <div className="relative">
              <div className="chat-bubble-particle-wrapper">
                <TypingParticles active={true} type="purple" />
              </div>
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="메시지를 입력하세요..."
            className="chat-input"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="chat-send-btn"
            aria-label="보내기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

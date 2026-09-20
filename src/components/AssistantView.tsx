import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Globe,
  RefreshCw,
  HelpCircle,
  Wheat,
  Clock
} from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { LANGUAGE_OPTIONS } from '../data/mockData';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AssistantViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  farmerProfile: FarmerProfile;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  language,
  onLanguageChange,
  farmerProfile,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text:
        language === 'te'
          ? `నమస్కారం ${farmerProfile.name} గారూ! 🙏 నేను మీ కిసాన్ మిత్ర AI వ్యవసాయ సహాయకుడిని. మీ వరి, టమోటా పంటల తెగుళ్లు, నేల తేమ, ఎరువుల మోతాదు, లేదా పిఎం-కిసాన్ పథకాల గురించి నన్ను ఏ ప్రశ్న అయినా అడగవచ్చు. మాట్లాడటానికి క్రింది మైక్రోఫోన్ బటన్ నొక్కండి!`
          : language === 'hi'
          ? `नमस्ते ${farmerProfile.name} जी! 🙏 मैं आपका किसान मित्र AI कृषि सहायक हूँ। आप मुझसे धान, टमाटर की फसल सुरक्षा, खाद की मात्रा, सिंचाई समय या सरकारी योजनाओं के बारे में पूछ सकते हैं। बोलकर पूछने के लिए माइक दबाएं!`
          : `Namaste ${farmerProfile.name}! 🙏 I am your KisanMitra AI Agricultural Assistant. Ask me anything about crop diseases, balanced fertilizer doses, irrigation schedules, mandi rates, or government schemes. Tap the microphone to speak!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Set recognition lang
      const langMap: Record<string, string> = {
        te: 'te-IN',
        hi: 'hi-IN',
        en: 'en-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        pa: 'pa-IN',
        gu: 'gu-IN',
      };
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [language]);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for cleaner TTS
    const cleanText = text.replace(/[*_#`~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langMap: Record<string, string> = {
      te: 'te-IN',
      hi: 'hi-IN',
      en: 'en-IN',
      ta: 'ta-IN',
      kn: 'kn-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      pa: 'pa-IN',
      gu: 'gu-IN',
    };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputVal;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          farmerContext: farmerProfile,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          const assistantMsg: Message = {
            id: 'msg-' + (Date.now() + 1),
            sender: 'assistant',
            text: data.reply,
            timestamp: data.timestamp || 'Just now',
          };
          setMessages((prev) => [...prev, assistantMsg]);
          return;
        }
      }
      throw new Error('Local agricultural response generated');
    } catch (err: any) {
      console.warn('Assistant engine notice:', err.message);
      const fallbackReply =
        language === 'te'
          ? `రైతు మిత్రమా 🌾, ప్రస్తుత వరి పొలానికి ఎరువుల నిష్పత్తి: ఎకరానికి 50 కేజీల డీఏపీ (DAP) ఆఖరి దుక్కిలో మరియు 25 కేజీల యూరియా 20-25 రోజులకు వేయండి. ఏదైనా తెగులు ఉంటే వెంటనే పంట డాక్టర్ లో ఫోటో స్కాన్ చేయండి!`
          : language === 'hi'
          ? `किसान भाई 🌾, धान की फसल में जिंक की कमी से खैरा रोग हो सकता है। 5 किग्रा जिंक सल्फेट + 2.5 किग्रा बुझा हुआ चूना 1000 लीटर पानी में मिलाकर प्रति हेक्टेयर छिड़काव करें।`
          : `Dear Farmer 🌾, for optimal crop yield, avoid single heavy doses of nitrogenous fertilizers. Use split doses and ensure soil moisture is checked before watering.`;

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          text: fallbackReply,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts =
    language === 'te'
      ? [
          'వరిలో ఎరువుల మోతాదు ఎంత వేయాలి?',
          'తాజా టమోటా మార్కెట్ ధర ఎంత?',
          'పిఎం-కిసాన్ ₹2000 ఎప్పుడు వస్తుంది?',
          'డ్రిప్ ఇరిగేషన్ సబ్సిడీ ఎలా పొందాలి?',
        ]
      : language === 'hi'
      ? [
          'धान में खाद की सही मात्रा क्या है?',
          'टमाटर की मंडी भाव क्या चल रही है?',
          'PM-किसान 17वीं किस्त की स्थिति?',
          'ड्रिप सिंचाई पर कितनी सब्सिडी मिलती है?',
        ]
      : [
          'What is the recommended fertilizer schedule for Paddy?',
          'How to identify early leaf blast symptoms?',
          'Check eligibility for PMKSY Drip Subsidy',
          'Current APMC benchmark prices for Guntur Chillies',
        ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>Voice & Text Multilingual AI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
            KisanMitra Assistant (కిసాన్ మిత్ర / किसान मित्र)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Friendly agricultural AI for Indian farmers. Speak or write in your native language.
          </p>
        </div>

        {/* Language selector in Chat */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
          <Globe className="w-4 h-4 text-emerald-700" />
          <span className="text-xs text-stone-600 font-medium">Chat Language:</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="text-xs font-bold text-emerald-900 bg-transparent focus:outline-none cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.native} ({opt.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col h-[640px] overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[78%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-emerald-800 text-white rounded-tr-xs'
                        : 'bg-white text-stone-900 border border-stone-200 shadow-xs rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div
                    className={`flex items-center gap-2 px-1 text-[10px] text-stone-600 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="hover:text-emerald-800 transition flex items-center gap-0.5 cursor-pointer font-medium"
                        title="Listen to Voice"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3 h-3 text-red-600" />
                        ) : (
                          <Volume2 className="w-3 h-3 text-emerald-700" />
                        )}
                        <span>{isSpeaking ? 'Stop' : 'Voice'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[78%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-stone-600 flex items-center gap-2 shadow-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                <span>KisanMitra Assistant is thinking in your language...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-stone-100/90 border-t border-stone-200/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Suggested:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 border border-stone-300 hover:border-emerald-500 text-stone-700 hover:text-emerald-800 text-[11px] font-medium whitespace-nowrap transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2">
          {speechSupported && (
            <button
              onClick={toggleListen}
              className={`p-3 rounded-xl transition cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak your question'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <input
            id="assistant-query-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={
              isListening
                ? 'Listening... speak in your language now...'
                : language === 'te'
                ? 'మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి లేదా మాట్లాడండి...'
                : language === 'hi'
                ? 'अपना सवाल यहाँ लिखें या बोलें...'
                : 'Ask anything about crops, fertilizer, irrigation, mandi...'
            }
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <button
            id="send-assistant-btn"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isLoading}
            className="p-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white transition shadow-sm cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

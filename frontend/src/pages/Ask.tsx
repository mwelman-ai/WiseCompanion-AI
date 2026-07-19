import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, Send, Volume2, VolumeX, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  '🔒 Tell me how to identify a bank scam',
  '❤️ Suggest 3 gentle morning stretches',
  '☕ I feel a bit lonely today, can we chat?',
  '💊 Why is it important to take pills on time?'
];

const Ask = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isPremiumPrompt, setIsPremiumPrompt] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if browser supports it
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setErrorText(null);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setErrorText('Could not hear clearly. Try typing or speaking again.');
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    // Load initial welcome message
    const storedName = localStorage.getItem('wisecompanion_name') || 'Friend';
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Hello ${storedName}! I am WiseCompanion, your warm and friendly companion. How are you feeling today? You can type a question below, click one of the suggestions, or tap the microphone to speak to me!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Text-To-Speech (TTS) for Senior comfort
  const speakResponse = (text: string) => {
    if (isMuted) return;
    
    // Stop any current speaking
    window.speechSynthesis.cancel();
    
    // Clean up text (remove emojis for natural speech)
    const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Get stored voice speed preference (slow, normal, fast)
    const speedPref = localStorage.getItem('wisecompanion_voice_speed') || 'slow';
    if (speedPref === 'slow') {
      utterance.rate = 0.75; // Slower rate for clear senior hearing
    } else if (speedPref === 'fast') {
      utterance.rate = 1.1;
    } else {
      utterance.rate = 0.95; // Slightly slower than default for clarity
    }

    // Attempt to pick a warm English female voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(voice => 
      voice.name.includes('Google US English') || 
      voice.name.includes('Microsoft Zira') || 
      voice.name.includes('Samantha')
    );
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (promptText: string) => {
    if (!promptText.trim()) return;

    setErrorText(null);
    setIsPremiumPrompt(false);
    
    const userMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-user-123'
        },
        body: JSON.stringify({ prompt: promptText })
      });

      if (response.status === 403) {
        // Daily rate limit exceeded on free tier
        setIsPremiumPrompt(true);
        const assistantMsg: ChatMessage = {
          id: 'msg-' + Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: 'You have reached your free daily chat limit of 10 messages. Please consider upgrading to our Premium tier for unlimited warm, round-the-clock supportive chats!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
        speakResponse(assistantMsg.content);
      } else if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: 'msg-' + Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
        speakResponse(assistantMsg.content);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error('Chat API error:', err);
      // Senior-friendly local offline/error fallback
      const fallbacks: { [key: string]: string } = {
        'scam': 'If you suspect a message is a scam, remember: Never send gift cards, never share bank details, and always hang up and verify independently. Use our Scam Detector card on your home screen to check any text or email!',
        'lonely': 'I hear you, and please know you are not alone. I am always right here to keep you company and listen. How about telling me about a favorite memory, or we can discuss a friendly recipe?',
        'stretch': 'A simple morning stretch is so good for the heart. Try: 1. Sitting in a chair, raise your heels up and down 10 times. 2. Gentle shoulder rolls backward. 3. Clasp your hands together and push them forward gently.',
        'pill': 'Taking pills consistently keeps you strong. Always check your Medication Reminders list and set clear alarms for morning and night doses.'
      };

      const matchedKey = Object.keys(fallbacks).find(k => promptText.toLowerCase().includes(k));
      const fallbackResponse = matchedKey 
        ? fallbacks[matchedKey] 
        : "I'm always here to listen and support you. Remember to take things one step at a time, and never hesitate to ask me anything about your wellness, travel plans, or scam safety!";

      const assistantMsg: ChatMessage = {
        id: 'msg-fallback-' + Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
      speakResponse(assistantMsg.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        setErrorText('Speech input is not supported in this browser. Try using Google Chrome!');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)] pb-4 px-4 text-slate-800">
      {/* Back Button and Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4 gap-4">
        <button
          onClick={() => {
            window.speechSynthesis.cancel();
            navigate('/dashboard');
          }}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-lg font-bold min-h-[48px] px-5 py-2.5 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all rounded-2xl shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={24} /> Back
        </button>

        <div className="flex items-center gap-3">
          <span className="text-3xl hidden sm:inline">💬</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Ask WiseCompanion</h1>
        </div>

        {/* Mute Button */}
        <button
          onClick={() => {
            if (!isMuted) window.speechSynthesis.cancel();
            setIsMuted(!isMuted);
          }}
          className={`p-3 rounded-2xl border-2 flex items-center justify-center min-h-[48px] min-w-[48px] transition-all hover:-translate-y-0.5 active:translate-y-0.5 border-b-4 ${
            isMuted 
              ? 'bg-red-50 border-red-200 border-b-red-300 text-red-600 hover:border-red-300' 
              : 'bg-teal-50 border-teal-200 border-b-teal-300 text-teal-700 hover:border-teal-300'
          }`}
          title={isMuted ? "Unmute Voice" : "Mute Voice"}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-4 space-y-6 shadow-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Speaker Name */}
            <span className="text-sm font-bold text-slate-500 mb-1 px-1">
              {msg.role === 'user' ? 'You' : 'WiseCompanion'} • {msg.timestamp}
            </span>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-6 shadow-sm border text-xl leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white border-transparent'
                  : 'bg-white text-slate-900 border-slate-200'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
              
              {/* Optional Speaker Trigger in Bubble */}
              {msg.role === 'assistant' && !isMuted && (
                <button
                  onClick={() => speakResponse(msg.content)}
                  className="mt-3 text-base font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 min-h-[44px] px-3 bg-teal-50 border-b-2 border-teal-200 hover:border-teal-300 rounded-xl"
                >
                  <Volume2 size={18} /> Repeat Voice
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-slate-500 mb-1">WiseCompanion is thinking...</span>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-teal-600 rounded-full animate-bounce" />
              <span className="w-3.5 h-3.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-3.5 h-3.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error and Alert Banners */}
      {errorText && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-4 flex items-center gap-3 mb-3 shadow-sm">
          <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
          <p className="text-lg font-bold">{errorText}</p>
        </div>
      )}

      {isPremiumPrompt && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 text-amber-900 rounded-2xl p-6 mb-3 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2.5 rounded-xl flex-shrink-0 text-amber-700">
              <Sparkles size={28} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-amber-950">Unlock Unlimited Supportive Chats!</h3>
              <p className="text-lg mt-1 opacity-90 leading-relaxed">
                As a free member, you get 10 high-quality chats daily. Upgrade to <strong>Premium</strong> for infinite friendly companion chats, faster voices, priority updates, and special holiday calls.
              </p>
              <button
                onClick={() => {
                  window.speechSynthesis.cancel();
                  navigate('/pricing');
                }}
                className="mt-4 bg-teal-600 hover:bg-teal-500 border-b-4 border-teal-800 hover:border-teal-700 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 text-white font-black px-6 py-3.5 rounded-2xl text-lg shadow-md active:shadow-sm min-h-[48px] transition-all"
              >
                View Premium Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions and Preset Questions when chat is relatively short */}
      {messages.length <= 2 && !isLoading && (
        <div className="mb-4">
          <p className="text-base font-bold text-slate-500 mb-2 flex items-center gap-1.5">
            <HelpCircle size={18} /> Tap any suggestion to ask instantly:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_QUESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => handleSendMessage(question.slice(2))}
                className="text-left text-lg font-bold px-5 py-4 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 border-b-4 border-b-slate-300 hover:border-b-teal-500 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 rounded-2xl shadow-sm text-slate-800 transition-all min-h-[48px]"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Text and Voice Input Controls */}
      <div className="flex items-center gap-3 pt-2">
        {/* Voice Dictation Microphone Button */}
        <button
          onClick={handleMicClick}
          className={`p-5 rounded-2xl border-2 border-b-4 flex items-center justify-center shadow-md min-h-[60px] min-w-[60px] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 ${
            isListening 
              ? 'bg-red-500 border-red-600 border-b-red-700 text-white animate-pulse' 
              : 'bg-teal-50 hover:bg-teal-100 border-teal-200 border-b-teal-300 text-teal-700'
          }`}
          title={isListening ? "Stop Listening" : "Speak to AI"}
        >
          {isListening ? <MicOff size={28} /> : <Mic size={28} />}
        </button>

        {/* Input box */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(input);
          }}
          placeholder={isListening ? "Listening closely... Speak now!" : "Type your message or ask a question..."}
          disabled={isLoading}
          className="flex-1 text-xl px-6 py-4.5 border-2 border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-2xl min-h-[60px] shadow-sm bg-white"
        />

        {/* Send text button */}
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || isLoading}
          className={`p-5 rounded-2xl border-b-4 shadow-md min-h-[60px] min-w-[60px] flex items-center justify-center transition-all ${
            !input.trim() || isLoading
              ? 'bg-slate-200 border-transparent text-slate-400 cursor-not-allowed border-b-0 shadow-none'
              : 'bg-teal-600 hover:bg-teal-500 border-teal-800 hover:border-teal-700 text-white hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2'
          }`}
        >
          <Send size={26} />
        </button>
      </div>
    </div>
  );
};

export default Ask;

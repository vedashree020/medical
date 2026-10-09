import { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Send, Trash2 } from 'lucide-react';
import PatientLayout from '@/layouts/PatientLayout';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Input } from '@/components/FormFields';
import { NAVIGATION_ROUTES, FLOOR_PLAN } from '@/data/hospitalData';
import { loadData } from '@/services/storageService';

export default function VoiceAssistant() {
  const appointment = loadData('patientAppointment', null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your QMedSync navigation assistant. Ask me where your appointment is, or where a department or room is located.',
    },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setRecognitionSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = (text) => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateResponse = (query) => {
    const q = query.toLowerCase().trim();

    // Appointment query
    if (q.includes('appointment') || q.includes('my doctor') || q.includes('my room')) {
      if (appointment) {
        return `Your appointment is with ${appointment.doctor} in the ${appointment.room} on the ${appointment.floor} at ${appointment.time}. Priority: ${appointment.priority}.`;
      }
      return 'You do not have an appointment yet. Please use the Find My Appointment feature to book one.';
    }

    // Department queries
    const departmentMap = {
      cardiology: 'Cardiology',
      neurology: 'Neurology',
      orthopedics: 'Orthopedics',
      emergency: 'Emergency',
    };

    for (const [key, dept] of Object.entries(departmentMap)) {
      if (q.includes(key)) {
        const route = NAVIGATION_ROUTES[dept] || NAVIGATION_ROUTES[dept + ' Room'];
        if (route && route.length > 0) {
          const steps = route.map((s) => s.step).join(', then ');
          const floor = FLOOR_PLAN.find((f) =>
            f.rooms.some((r) => r.name.toLowerCase().includes(key) || r.name === dept || r.name === dept + ' Room')
          );
          return `${dept} is on the ${floor?.floor || '1st Floor'}. Directions from Reception: ${steps}.`;
        }
      }
    }

    // Room queries — check room names
    for (const routeName of Object.keys(NAVIGATION_ROUTES)) {
      if (q.includes(routeName.toLowerCase()) && routeName !== 'Reception') {
        const route = NAVIGATION_ROUTES[routeName];
        const floor = FLOOR_PLAN.find((f) => f.rooms.some((r) => r.name === routeName));
        if (route && route.length > 0) {
          const steps = route.map((s) => s.step).join(', then ');
          return `${routeName} is on the ${floor?.floor || '1st Floor'}. Directions from Reception: ${steps}.`;
        }
      }
    }

    // Pharmacy
    if (q.includes('pharmacy')) {
      return 'Pharmacy is on the Ground Floor. From Reception, turn right into the right corridor. Pharmacy is on your right.';
    }

    // Reception
    if (q.includes('reception')) {
      return 'Reception is on the Ground Floor at the main entrance. It is the starting point for all directions.';
    }

    // Lift
    if (q.includes('lift') || q.includes('elevator')) {
      return 'The lift is on the Ground Floor near the Waiting Area. Use it to reach the 1st and 2nd floors.';
    }

    return 'I can help you find departments, rooms, and your appointment. Try asking "Where is Cardiology?", "Where is Room 12?", or "Where is my appointment?".';
  };

  const handleSend = (text) => {
    const query = text || input;
    if (!query.trim()) return;

    const response = generateResponse(query);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: query },
      { role: 'assistant', text: response },
    ]);
    setInput('');
    speak(response);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        text: 'Conversation cleared. How can I help you?',
      },
    ]);
    if (speechSupported) window.speechSynthesis.cancel();
  };

  return (
    <PatientLayout>
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-slate-800">Voice Assistant</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Indoor hospital navigation and appointment assistant. Ask about your appointment or how to find a room.
          </p>
        </div>

        <Card className="overflow-hidden">
          {/* Chat messages */}
          <div className="max-h-[50vh] min-h-[300px] overflow-y-auto scrollbar-thin bg-slate-50 p-4">
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {[
                'Where is my appointment?',
                'Where is Cardiology?',
                'Where is Room 12?',
                'Where is the pharmacy?',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-2 border-t border-slate-200 p-3">
            <button
              onClick={handleMicClick}
              disabled={!recognitionSupported}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                listening
                  ? 'bg-red-500 text-white animate-pulse-soft'
                  : recognitionSupported
                  ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
              title={recognitionSupported ? 'Click to speak' : 'Speech recognition not supported'}
            >
              <Mic size={18} />
            </button>
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              className="flex-1"
            />
            <button
              onClick={() => handleSend()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white transition-colors hover:bg-teal-700"
            >
              <Send size={18} />
            </button>
            <button
              onClick={handleClear}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </Card>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <Volume2 size={14} />
          {speechSupported
            ? 'Speech synthesis is supported. Responses will be spoken aloud.'
            : 'Speech synthesis is not supported in this browser. Text fallback is active.'}
          {!recognitionSupported && ' — Speech recognition is not available. Please type your questions.'}
        </div>

        <p className="mt-2 text-xs text-slate-400">
          This is an indoor hospital navigation and appointment assistant. It does not provide medical advice.
        </p>
      </div>
    </PatientLayout>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Phone, MessageSquare, Gift, Plus, Send, CheckCircle, Trash2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isEmergency: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'family';
  contactId: string;
  text: string;
  timestamp: string;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Sarah (Daughter)', relation: 'Daughter', phone: '(555) 019-2834', isEmergency: true },
  { id: '2', name: 'Emily (Granddaughter)', relation: 'Granddaughter', phone: '(555) 014-9988', isEmergency: false },
  { id: '3', name: 'Dr. Robert Miller', relation: 'Primary Doctor', phone: '(555) 012-3344', isEmergency: true },
  { id: '4', name: 'John (Son)', relation: 'Son', phone: '(555) 018-7711', isEmergency: false }
];

const PRESET_MESSAGES = [
  "❤️ Just checking in! I hope you are having a beautiful day.",
  "☀️ Good morning! Thinking of you today.",
  "📞 Are you free for a phone or video call later?",
  "🥗 I did my morning stretches and feel great!"
];

const CARD_THEMES = [
  { id: 'sun', label: '☀️ Warm Sun', bg: 'bg-amber-50 border-amber-200 text-amber-900 border-b-amber-300', emoji: '☀️', wish: 'Sending you sunshine and warm hugs today!' },
  { id: 'cake', label: '🎂 Birthday Cake', bg: 'bg-rose-50 border-rose-200 text-rose-900 border-b-rose-300', emoji: '🎂', wish: 'Wishing you the happiest of birthdays, filled with joy and laughter!' },
  { id: 'flower', label: '🌸 Calming Flowers', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900 border-b-emerald-300', emoji: '🌸', wish: 'Thinking of you and wishing you a peaceful, beautiful day!' },
  { id: 'heart', label: '❤️ Full of Love', bg: 'bg-red-50 border-red-200 text-red-900 border-b-red-300', emoji: '❤️', wish: 'Just a little card to remind you how much you are loved!' }
];

const Family = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(INITIAL_CONTACTS[0]);
  const [inputText, setInputText] = useState('');
  const [phoneToCall, setPhoneToCall] = useState<string | null>(null);
  
  // Greeting card generator states
  const [cardTheme, setCardTheme] = useState(CARD_THEMES[0]);
  const [cardRecipient, setCardRecipient] = useState(INITIAL_CONTACTS[0].name);
  const [cardCustomNote, setCardCustomNote] = useState('');
  const [isCardSent, setIsCardSent] = useState(false);

  // New Contact form states
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactIsEmergency, setNewContactIsEmergency] = useState(false);

  useEffect(() => {
    // Seed some mock conversation history
    setMessages([
      { id: 'm1', sender: 'family', contactId: '1', text: "Hi Mom! Just wanted to see how you are doing. Did you take your vitamins?", timestamp: "Yesterday, 4:15 PM" },
      { id: 'm2', sender: 'user', contactId: '1', text: "Yes dear! Took them with breakfast. Hope your day is going well.", timestamp: "Yesterday, 4:30 PM" },
      { id: 'm3', sender: 'family', contactId: '2', text: "Grandma! I got an A on my science project today! 🧪", timestamp: "Yesterday, 5:10 PM" }
    ]);
  }, []);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || !selectedContact) return;

    const newMsg: Message = {
      id: 'm-' + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      contactId: selectedContact.id,
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Trigger automatic grandson/daughter reply simulation after 1.5 seconds
    setTimeout(() => {
      let replyText = "Aww, thank you! I love you so much and will call you tonight! ❤️";
      if (selectedContact.relation === 'Primary Doctor') {
        replyText = "Thank you for your message. If this is a medical emergency, please call 911 immediately. Otherwise, our clinic will reach out soon.";
      } else if (selectedContact.relation === 'Daughter') {
        replyText = "So glad to hear from you, Mom! I'm in a meeting right now but I will check in on you around dinner time. Hugs!";
      } else if (selectedContact.relation === 'Son') {
        replyText = "Thanks Dad! Everything is good here. Let's catch up on the weekend!";
      }

      const replyMsg: Message = {
        id: 'm-' + Math.random().toString(36).substr(2, 9),
        sender: 'family',
        contactId: selectedContact.id,
        text: replyText,
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const created: Contact = {
      id: 'c-' + Math.random().toString(36).substr(2, 9),
      name: newContactName,
      relation: newContactRelation || 'Friend',
      phone: newContactPhone,
      isEmergency: newContactIsEmergency
    };

    setContacts([...contacts, created]);
    setSelectedContact(created);
    setIsAddingContact(false);
    setNewContactName('');
    setNewContactRelation('');
    setNewContactPhone('');
    setNewContactIsEmergency(false);
  };

  const handleDeleteContact = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    if (selectedContact?.id === id) {
      setSelectedContact(updated[0] || null);
    }
  };

  const handleSimulateCall = (contactName: string, phone: string) => {
    setPhoneToCall(`${contactName} (${phone})`);
    setTimeout(() => {
      setPhoneToCall(null);
    }, 4000);
  };

  const handleSendGreetingCard = () => {
    setIsCardSent(true);
    setTimeout(() => {
      setIsCardSent(false);
      setCardCustomNote('');
    }, 4000);
  };

  const filteredMessages = messages.filter(m => m.contactId === selectedContact?.id);

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-8 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-lg font-bold min-h-[48px] px-5 py-2.5 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all rounded-2xl shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={24} /> Back
        </button>

        <div className="flex items-center gap-3">
          <span className="text-4xl hidden sm:inline">👨‍👩‍👧‍👦</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Family Directory</h1>
        </div>
        <div className="w-[80px] hidden sm:block" />
      </div>

      <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
        Stay connected with loved ones, dial contacts immediately, and generate beautiful greeting cards.
      </p>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Contacts List */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3 gap-2">
              <h2 className="text-2xl font-black text-slate-900">Directory</h2>
              <button
                onClick={() => setIsAddingContact(!isAddingContact)}
                className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-2 border-teal-200 border-b-4 border-b-teal-300 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 font-black px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all min-h-[44px] text-base shadow-sm"
              >
                <Plus size={18} /> <span className="hidden sm:inline">Add</span> Contact
              </button>
            </div>

            {/* Add Contact Form Inline */}
            {isAddingContact && (
              <form onSubmit={handleCreateContact} className="bg-slate-50 p-5 rounded-2xl mb-6 border-2 border-slate-200 space-y-4 animate-slide-up shadow-inner">
                <h3 className="text-xl font-extrabold text-slate-900">New Contact</h3>
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">Name:</label>
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full text-lg px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">Relation:</label>
                  <input
                    type="text"
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    placeholder="e.g. Son, Cousin, Doctor"
                    className="w-full text-lg px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    required
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="e.g. (555) 123-4567"
                    className="w-full text-lg px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2.5 py-1">
                  <input
                    type="checkbox"
                    id="newIsEmergency"
                    checked={newContactIsEmergency}
                    onChange={(e) => setNewContactIsEmergency(e.target.checked)}
                    className="w-6 h-6 rounded border-slate-300 accent-teal-600 cursor-pointer"
                  />
                  <label htmlFor="newIsEmergency" className="text-base font-bold text-slate-700 cursor-pointer select-none">
                    🚨 Mark as Emergency Contact
                  </label>
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-500 border-b-4 border-teal-800 hover:border-teal-700 text-white font-bold py-2.5 rounded-xl hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingContact(false)}
                    className="bg-white text-slate-700 border-2 border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 rounded-xl font-bold px-4 py-2.5 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* List of contacts */}
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full text-left p-5 rounded-2xl border-2 border-b-4 transition-all flex flex-col justify-between min-h-[120px] cursor-pointer shadow-sm ${
                    selectedContact?.id === contact.id
                      ? 'bg-teal-50/50 border-teal-600 border-b-teal-700 text-teal-950 shadow-md'
                      : contact.isEmergency
                        ? 'border-amber-200 bg-amber-50/40 border-b-amber-300 hover:border-amber-300 text-amber-950'
                        : 'border-slate-200 border-b-slate-300 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xl font-black leading-snug">{contact.name}</span>
                        {contact.isEmergency && (
                          <span className="bg-red-500 text-white text-[11px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-base font-bold text-slate-500 capitalize">{contact.relation}</p>
                      <p className="text-lg font-bold text-slate-700 mt-1">{contact.phone}</p>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContact(contact.id, e);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition-all"
                      title="Remove Contact"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Immediate Quick Action row (min 48px height) */}
                  <div className="flex gap-2.5 mt-4 w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulateCall(contact.name, contact.phone);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 hover:border-emerald-700 text-white font-extrabold py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 text-base shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all min-h-[44px]"
                    >
                      <Phone size={16} /> Call Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedContact(contact)}
                      className="bg-white text-slate-700 border-2 border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300 hover:text-slate-900 font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-base min-h-[44px] hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all"
                    >
                      <MessageSquare size={16} /> Text
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Messaging Simulator */}
        <div className="lg:col-span-2 space-y-6">
          {selectedContact ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[540px] justify-between">
              <div>
                {/* Active Contact Banner */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">{selectedContact.name}</h2>
                    <span className="text-base text-slate-500 font-bold capitalize">{selectedContact.relation} • Online Connected</span>
                  </div>
                  
                  <button
                    onClick={() => handleSimulateCall(selectedContact.name, selectedContact.phone)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 border-b-4 border-b-emerald-300 font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all min-h-[48px] text-lg shadow-sm"
                  >
                    <Phone size={20} /> Call Line
                  </button>
                </div>

                {/* Messages Feed */}
                <div className="h-[280px] overflow-y-auto space-y-4 pr-1 scroll-smooth">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-sm font-semibold text-slate-400 mb-1 px-1">
                          {msg.sender === 'user' ? 'You' : selectedContact.name} • {msg.timestamp}
                        </span>
                        <div
                          className={`max-w-[80%] rounded-2xl p-4.5 text-lg shadow-sm border font-medium leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-teal-600 text-white border-transparent'
                              : 'bg-slate-100 text-slate-900 border-slate-200'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10">
                      <MessageSquare size={48} className="stroke-1 mb-2 text-slate-300" />
                      <p className="text-xl font-bold">No message history yet</p>
                      <p className="text-base font-bold text-slate-500 px-4 mt-1">Select one of our warm preset templates below to say hello!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Controls (presets & input) */}
              <div className="border-t border-slate-150 pt-4 mt-2">
                {/* Preset messages suggestions */}
                <div className="flex flex-wrap gap-2 mb-4 max-h-[85px] overflow-y-auto pr-1">
                  {PRESET_MESSAGES.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSendMessage(preset)}
                      className="bg-slate-50 hover:bg-teal-50 text-slate-800 border-2 border-slate-100 hover:border-teal-200 border-b-4 border-b-slate-200 hover:border-b-teal-300 text-base font-bold px-4 py-2 rounded-xl text-left transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 shadow-sm"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Direct Typing Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage(inputText);
                    }}
                    placeholder={`Write a nice message to ${selectedContact.name}...`}
                    className="flex-1 text-lg px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none bg-white font-medium"
                  />
                  <button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim()}
                    className={`px-6 rounded-xl border-b-4 flex items-center justify-center transition-all min-h-[48px] ${
                      !inputText.trim()
                        ? 'bg-slate-200 border-transparent text-slate-400 border-b-0 cursor-not-allowed shadow-none'
                        : 'bg-teal-600 hover:bg-teal-500 border-teal-800 hover:border-teal-700 text-white shadow-md hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2'
                    }`}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
              <Users size={64} className="mx-auto mb-4 stroke-1 text-slate-300" />
              <p className="text-2xl font-bold">Please select or add a contact to start messaging.</p>
            </div>
          )}
        </div>
      </div>

      {/* LOWER SECTION: Interactive Greeting Card Generator */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mt-10">
        <header className="mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
          <Gift size={28} className="text-rose-500" />
          <h2 className="text-2xl font-black text-slate-900">Greeting Card Generator</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls Form */}
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              Create a personalized digital holiday or birthday card. We will simulate sending it to your family member.
            </p>

            {/* Choose recipient */}
            <div className="space-y-2">
              <label className="block text-lg font-bold text-slate-800">Who is this card for?</label>
              <select
                value={cardRecipient}
                onChange={(e) => setCardRecipient(e.target.value)}
                className="w-full text-lg p-4 border-2 border-slate-200 rounded-2xl focus:border-teal-500 focus:outline-none bg-slate-50 font-bold"
              >
                {contacts.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Choose Theme */}
            <div className="space-y-3">
              <label className="block text-lg font-bold text-slate-800">Select Cheerful Theme:</label>
              <div className="grid grid-cols-2 gap-3">
                {CARD_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setCardTheme(theme);
                      setIsCardSent(false);
                    }}
                    className={`p-4 rounded-2xl border-2 border-b-4 transition-all flex items-center gap-2.5 text-base font-bold shadow-sm ${
                      cardTheme.id === theme.id
                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-md border-b-teal-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 border-b-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{theme.emoji}</span>
                    <span>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom note */}
            <div className="space-y-2">
              <label className="block text-lg font-bold text-slate-800">Add a custom note (Optional):</label>
              <textarea
                value={cardCustomNote}
                onChange={(e) => setCardCustomNote(e.target.value)}
                placeholder="e.g. Can't wait to see you soon! / Keep making me proud!"
                rows={3}
                className="w-full text-lg p-4 border-2 border-slate-200 rounded-2xl focus:border-teal-500 focus:outline-none bg-slate-50 resize-none font-medium"
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSendGreetingCard}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4.5 rounded-2xl border-b-4 border-rose-800 hover:border-rose-700 text-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all min-h-[52px] flex items-center justify-center gap-2"
            >
              <Gift size={24} /> Send Greeting Card
            </button>
          </div>

          {/* Real-time Preview Area */}
          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <span className="text-sm font-extrabold text-slate-400 mb-4 uppercase tracking-wider">Live Preview</span>
            
            {/* Greeting Card Card */}
            <div className={`w-full max-w-sm rounded-2xl p-8 border-2 border-b-4 shadow-xl transition-all aspect-[4/5] flex flex-col justify-between text-center bg-white ${cardTheme.bg}`}>
              <div className="text-5xl">{cardTheme.emoji}</div>
              
              <div className="space-y-4 my-auto">
                <h3 className="text-2xl font-black italic">Dear {cardRecipient},</h3>
                <p className="text-xl font-bold leading-relaxed">{cardTheme.wish}</p>
                {cardCustomNote.trim() && (
                  <p className="text-lg italic text-slate-600 border-t border-dashed border-slate-300 pt-3 leading-relaxed">
                    "{cardCustomNote}"
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-lg font-black border-t border-slate-100 pt-3">Love, Your WiseCompanion 👵</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Simulated Call Modal Banner */}
      {phoneToCall && (
        <div className="fixed inset-x-0 bottom-6 max-w-md mx-auto z-[9999] px-4 animate-bounce">
          <div className="bg-slate-900 border-2 border-slate-800 text-white rounded-2xl p-6 shadow-2xl flex items-center gap-4 border-b-4">
            <div className="bg-emerald-500 p-3 rounded-2xl animate-pulse">
              <Phone size={28} className="text-white" />
            </div>
            <div>
              <p className="text-md font-bold opacity-80 uppercase tracking-widest">Simulated Call Active</p>
              <h3 className="text-2xl font-black text-white">Calling line...</h3>
              <p className="text-lg font-bold opacity-90 mt-0.5">{phoneToCall}</p>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Card Sent Modal Banner */}
      {isCardSent && (
        <div className="fixed inset-x-0 bottom-6 max-w-md mx-auto z-[9999] px-4">
          <div className="bg-rose-950 border-2 border-rose-800 text-rose-50 rounded-2xl p-6 shadow-2xl flex items-center gap-4">
            <div className="bg-rose-500 p-3 rounded-2xl">
              <CheckCircle size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black">Card Sent!</h3>
              <p className="text-lg font-bold opacity-90 mt-0.5">
                Greeting card sent to <strong>{cardRecipient}</strong>. They will love it!
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Family;

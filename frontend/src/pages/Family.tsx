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
  { id: 'sun', label: '☀️ Warm Sun', bg: 'bg-amber-50 border-amber-200 text-amber-900', emoji: '☀️', wish: 'Sending you sunshine and warm hugs today!' },
  { id: 'cake', label: '🎂 Birthday Cake', bg: 'bg-rose-50 border-rose-200 text-rose-900', emoji: '🎂', wish: 'Wishing you the happiest of birthdays, filled with joy and laughter!' },
  { id: 'flower', label: '🌸 Calming Flowers', bg: 'bg-emerald-50 border-emerald-200 text-emerald-900', emoji: '🌸', wish: 'Thinking of you and wishing you a peaceful, beautiful day!' },
  { id: 'heart', label: '❤️ Full of Love', bg: 'bg-red-50 border-red-200 text-red-900', emoji: '❤️', wish: 'Just a little card to remind you how much you are loved!' }
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
    <div className="max-w-6xl mx-auto pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-5 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-lg font-bold min-h-[48px] min-w-[100px] transition-all"
        >
          <ArrowLeft size={24} /> Back
        </button>

        <div className="flex items-center gap-3">
          <span className="text-4xl">👨‍👩‍👧‍👦</span>
          <h1 className="text-3xl font-black text-slate-900">Family & Communication</h1>
        </div>
        <div className="w-[100px]" />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Contacts List */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b-2 border-slate-50 pb-3">
              <h2 className="text-2xl font-black text-slate-900">Directory</h2>
              <button
                onClick={() => setIsAddingContact(!isAddingContact)}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all min-h-[40px] text-md"
              >
                <Plus size={18} /> Add Contact
              </button>
            </div>

            {/* Add Contact Form Inline */}
            {isAddingContact && (
              <form onSubmit={handleCreateContact} className="bg-slate-50 p-4 rounded-2xl mb-4 border-2 border-slate-200 space-y-4">
                <h3 className="text-lg font-extrabold text-slate-800">New Family Contact</h3>
                <div>
                  <label className="block text-md font-bold text-slate-700 mb-1">Name:</label>
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full text-md px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-md font-bold text-slate-700 mb-1">Relation:</label>
                  <input
                    type="text"
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    placeholder="e.g. Son, Cousin, Doctor"
                    className="w-full text-md px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-md font-bold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    required
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    placeholder="e.g. (555) 123-4567"
                    className="w-full text-md px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="newIsEmergency"
                    checked={newContactIsEmergency}
                    onChange={(e) => setNewContactIsEmergency(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 accent-red-600"
                  />
                  <label htmlFor="newIsEmergency" className="text-md font-bold text-slate-700 cursor-pointer">
                    🚨 Mark as Emergency Contact
                  </label>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all"
                  >
                    Save Contact
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingContact(false)}
                    className="bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl hover:bg-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* List of contacts */}
            <div className="space-y-3.5">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[100px] ${
                    selectedContact?.id === contact.id
                      ? 'bg-blue-50/50 border-blue-600 text-blue-900 shadow-md'
                      : contact.isEmergency
                        ? 'border-amber-200 bg-amber-50 hover:border-amber-300 text-amber-950'
                        : 'border-slate-100 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-black">{contact.name}</span>
                        {contact.isEmergency && (
                          <span className="bg-red-500 text-white text-[11px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-md font-semibold text-slate-500 capitalize">{contact.relation}</p>
                      <p className="text-lg font-bold text-slate-700 mt-1">{contact.phone}</p>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteContact(contact.id, e)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-full transition-colors"
                      title="Remove Contact"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Immediate Quick Action row (min 48px height) */}
                  <div className="flex gap-2.5 mt-3 w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulateCall(contact.name, contact.phone);
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-md shadow-sm min-h-[44px]"
                    >
                      <Phone size={16} /> Call Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedContact(contact)}
                      className="bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300 font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-md min-h-[44px]"
                    >
                      <MessageSquare size={16} /> Text
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Messaging Simulator */}
        <div className="lg:col-span-2 space-y-6">
          {selectedContact ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-[520px] justify-between">
              <div>
                {/* Active Contact Banner */}
                <div className="flex items-center justify-between border-b-2 border-slate-50 pb-3 mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedContact.name}</h2>
                    <span className="text-md text-slate-500 capitalize">{selectedContact.relation} • Connected</span>
                  </div>
                  
                  <button
                    onClick={() => handleSimulateCall(selectedContact.name, selectedContact.phone)}
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold px-5 py-3 rounded-2xl flex items-center gap-2 transition-all min-h-[48px] text-lg"
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
                          className={`max-w-[80%] rounded-2xl p-4.5 text-lg shadow-sm border ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white border-transparent'
                              : 'bg-slate-100 text-slate-950 border-slate-200'
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
                      <p className="text-md px-4 mt-1">Select one of our warm preset templates below to say hello!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Controls (presets & input) */}
              <div className="border-t-2 border-slate-50 pt-4 mt-2">
                {/* Preset messages suggestions */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_MESSAGES.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSendMessage(preset)}
                      className="bg-slate-50 hover:bg-blue-50 text-slate-800 border-2 border-slate-100 hover:border-blue-200 text-md font-bold px-4 py-2.5 rounded-xl text-left transition-all min-h-[40px]"
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
                    className="flex-1 text-lg px-5 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage(inputText)}
                    disabled={!inputText.trim()}
                    className={`px-6 rounded-xl flex items-center justify-center transition-all min-h-[48px] ${
                      !inputText.trim()
                        ? 'bg-slate-200 text-slate-400'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    }`}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-100">
              <Users size={64} className="mx-auto mb-4 stroke-1" />
              <p className="text-2xl font-bold">Please select or add a contact to start messaging.</p>
            </div>
          )}
        </div>
      </div>

      {/* LOWER SECTION: Interactive Greeting Card Generator */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mt-10">
        <header className="mb-6 border-b-2 border-slate-50 pb-4 flex items-center gap-2">
          <Gift size={28} className="text-rose-500" />
          <h2 className="text-2xl font-black text-slate-900">Digital Greeting Card Generator</h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls Form */}
          <div className="space-y-6">
            <p className="text-lg text-slate-600 leading-relaxed">
              Create a personalized digital holiday or birthday card. We will simulate sending it to your family member.
            </p>

            {/* Choose recipient */}
            <div className="space-y-2">
              <label className="block text-lg font-bold text-slate-800">Who is this card for?</label>
              <select
                value={cardRecipient}
                onChange={(e) => setCardRecipient(e.target.value)}
                className="w-full text-lg p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none bg-slate-50"
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
                    className={`p-4.5 rounded-2xl border-2 transition-all flex items-center gap-2 text-md font-bold ${
                      cardTheme.id === theme.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                        : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200'
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
                className="w-full text-lg p-4 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none bg-slate-50 resize-none"
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSendGreetingCard}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4.5 rounded-2xl text-xl shadow-lg hover:shadow-xl transition-all min-h-[52px] flex items-center justify-center gap-2"
            >
              <Gift size={24} /> Send Greeting Card
            </button>
          </div>

          {/* Real-time Preview Area */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-md font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Live Preview</span>
            
            {/* Greeting Card Card */}
            <div className={`w-full max-w-sm rounded-3xl p-8 border-3 shadow-xl transition-all aspect-[4/5] flex flex-col justify-between text-center ${cardTheme.bg}`}>
              <div className="text-5xl">{cardTheme.emoji}</div>
              
              <div className="space-y-4 my-auto">
                <h3 className="text-2xl font-black italic">Dear {cardRecipient},</h3>
                <p className="text-xl font-bold leading-relaxed">{cardTheme.wish}</p>
                {cardCustomNote.trim() && (
                  <p className="text-lg italic text-slate-600 border-t border-dashed border-slate-300 pt-3">
                    "{cardCustomNote}"
                  </p>
                )}
              </div>
              
              <div>
                <p className="text-lg font-extrabold">Love, Your WiseCompanion 👵</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Simulated Call Modal Banner */}
      {phoneToCall && (
        <div className="fixed inset-x-0 bottom-6 max-w-md mx-auto z-[9999] px-4 animate-bounce">
          <div className="bg-slate-900 border-2 border-slate-800 text-white rounded-3xl p-6 shadow-2xl flex items-center gap-4">
            <div className="bg-emerald-500 p-3 rounded-2xl animate-pulse">
              <Phone size={28} className="text-white" />
            </div>
            <div>
              <p className="text-md font-bold opacity-80 uppercase tracking-widest">Simulated Call Active</p>
              <h3 className="text-2xl font-black">Calling line...</h3>
              <p className="text-lg font-bold opacity-90 mt-0.5">{phoneToCall}</p>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Card Sent Modal Banner */}
      {isCardSent && (
        <div className="fixed inset-x-0 bottom-6 max-w-md mx-auto z-[9999] px-4">
          <div className="bg-rose-950 border-2 border-rose-800 text-rose-50 rounded-3xl p-6 shadow-2xl flex items-center gap-4">
            <div className="bg-rose-500 p-3 rounded-2xl">
              <CheckCircle size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black">Card Sent!</h3>
              <p className="text-lg font-medium opacity-90 mt-0.5">
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

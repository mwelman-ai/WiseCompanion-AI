import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MessageSquare, Heart, Plus, Check, Send, PhoneCall, Sparkles, Smile, ShieldAlert } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  hasLiked: boolean;
  repliesCount: number;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  instructor: string;
  desc: string;
  isRegistered: boolean;
}

const Community = () => {
  const navigate = useNavigate();

  // Simulated Discussion Feed
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Margaret S.',
      avatar: '🌸',
      time: '2 hours ago',
      content: 'Hello everyone! Does anyone have advice on the best tomatoes to plant in late July? I am in Austin, Texas. Hope you all are having a lovely and cool morning!',
      likes: 8,
      hasLiked: false,
      repliesCount: 3
    },
    {
      id: '2',
      author: 'Robert D.',
      avatar: '☕',
      time: '4 hours ago',
      content: 'Just finished the Thursday morning virtual coffee hour. It was wonderful catching up with everyone. If you missed it, there is another one scheduled next week. Come join us!',
      likes: 12,
      hasLiked: true,
      repliesCount: 1
    },
    {
      id: '3',
      author: 'WiseCompanion Care',
      avatar: '🛡️',
      time: '1 day ago',
      content: '🚨 SAFETY ALERT: We received reports of scammers calling seniors pretending to be from the Social Security Administration asking to verify bank account numbers. Please remember, SSA will never call you to ask for this information over the phone! Stay safe!',
      likes: 24,
      hasLiked: false,
      repliesCount: 5
    }
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [authorName, setAuthorName] = useState('You (Anonymous)');

  // Simulated Events List
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 'ev1',
      title: 'Smartphones & Tablets 101',
      date: 'Thursday, July 23',
      time: '10:00 AM - 11:00 AM',
      location: 'Virtual Zoom Meeting',
      instructor: 'Coach Clara',
      desc: 'Learn how to easily adjust font sizes, send photos to your family, and block spam numbers on your phone.',
      isRegistered: false
    },
    {
      id: 'ev2',
      title: 'Gentle Morning Chair Yoga',
      date: 'Monday, July 27',
      time: '9:00 AM - 9:45 AM',
      location: 'Virtual Zoom Meeting',
      instructor: 'Yogi Michael',
      desc: 'A warm, relaxing session focusing on gentle joint flexibility, breathing, and stretching — all done safely from a chair.',
      isRegistered: true
    },
    {
      id: 'ev3',
      title: 'Online Safety Workshop',
      date: 'Wednesday, July 29',
      time: '2:00 PM - 3:00 PM',
      location: 'Virtual Zoom Meeting',
      instructor: 'Expert Steve',
      desc: 'An interactive session to learn how to identify fake emails, handle suspicious links, and protect your digital footprint.',
      isRegistered: false
    }
  ]);

  // Request Callback / Companion Form State
  const [buddyName, setBuddyName] = useState('');
  const [buddyPhone, setBuddyPhone] = useState('');
  const [buddySubmitted, setBuddySubmitted] = useState(false);

  const handleLike = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      author: authorName || 'Anonymous Friend',
      avatar: '🌟',
      time: 'Just now',
      content: newPostText,
      likes: 0,
      hasLiked: false,
      repliesCount: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const toggleEventRegistration = (eventId: string) => {
    setEvents(events.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          isRegistered: !ev.isRegistered
        };
      }
      return ev;
    }));
  };

  const handleBuddySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buddyName || !buddyPhone) return;
    setBuddySubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 text-slate-800 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-8 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-lg font-bold min-h-[48px] px-5 py-2.5 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all rounded-2xl shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={24} /> Back
        </button>

        <div className="flex items-center gap-3">
          <Users size={36} className="text-teal-600 hidden sm:inline" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Senior Connect</h1>
        </div>

        <div className="flex items-center">
          <span className="bg-teal-50 text-teal-700 font-extrabold px-4 py-2 rounded-xl border border-teal-150 text-md flex items-center gap-1.5 shadow-sm">
            <Smile size={20} className="text-teal-600" /> Community Hub
          </span>
        </div>
      </div>

      <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
        Stay connected, share knowledge, find friendly support, and participate in engaging virtual classes designed for seniors.
      </p>

      {/* Grid Layout: Left is Feed, Right is Calendar & Call Support */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Discussion Board (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="text-teal-600" size={26} />
              Community Bulletin Board
            </h2>
            <p className="text-lg text-slate-500 mb-6 font-bold leading-relaxed">
              Have a question, a lovely thought to share, or a local recommendation? Post it on our supportive member board.
            </p>

            {/* Write a New Post */}
            <form onSubmit={handleCreatePost} className="space-y-4 border-b-2 border-slate-100 pb-6 mb-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-slate-700 uppercase mb-1">Your Display Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Margaret S."
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-md focus:outline-none focus:border-teal-500 font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-slate-700 uppercase mb-1">Your Message</label>
                <textarea
                  rows={3}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share something friendly with the community..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-lg focus:outline-none focus:border-teal-500 font-medium"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl text-md font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0.5 border-b-4 border-teal-800 hover:border-teal-700 active:border-b-2 transition-all min-h-[48px] flex items-center gap-1.5"
                >
                  <Send size={18} /> Post Message
                </button>
              </div>
            </form>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-xl shadow-inner">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {post.author}
                        {post.author.includes('WiseCompanion') && (
                          <span className="bg-rose-100 text-rose-800 font-black text-xs uppercase px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            <ShieldAlert size={12} /> Official Alert
                          </span>
                        )}
                      </h4>
                      <p className="text-slate-400 text-sm font-bold">{post.time}</p>
                    </div>
                  </div>

                  <p className="text-lg text-slate-700 font-medium leading-relaxed mb-4 break-words whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-6 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-md font-extrabold min-h-[40px] px-3 rounded-lg transition-all ${
                        post.hasLiked 
                          ? 'text-rose-600 bg-rose-50' 
                          : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50/50'
                      }`}
                    >
                      <Heart size={18} className={post.hasLiked ? 'fill-rose-600' : ''} />
                      <span>{post.likes} Hearts</span>
                    </button>

                    <span className="text-slate-400 text-md font-bold">
                      {post.repliesCount} Replies
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-6">
          
          {/* Virtual Class Calendar */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="text-teal-600" size={24} />
              Virtual Calendar
            </h2>
            <p className="text-md text-slate-500 mb-4 font-bold leading-relaxed">
              Interactive video sessions on technology, safety, and exercise. Click to save your spot!
            </p>

            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev.id} className="border border-slate-150 rounded-xl p-4 hover:border-teal-200 transition-all bg-slate-50/50">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="bg-teal-50 text-teal-800 text-xs font-black uppercase px-2 py-0.5 rounded">
                      {ev.instructor}
                    </span>
                    <span className="text-slate-400 text-xs font-bold">{ev.date}</span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{ev.title}</h3>
                  <p className="text-slate-400 text-sm font-bold mb-2">{ev.time}</p>
                  <p className="text-slate-600 text-md font-medium leading-relaxed mb-3">{ev.desc}</p>
                  
                  <button
                    onClick={() => toggleEventRegistration(ev.id)}
                    className={`w-full py-2 px-4 rounded-xl font-bold text-md shadow-sm border-b-4 transition-all min-h-[44px] flex items-center justify-center gap-1.5 ${
                      ev.isRegistered
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 border-b-2 hover:bg-emerald-100'
                        : 'bg-teal-600 hover:bg-teal-500 text-white border-teal-800 hover:border-teal-700 active:border-b-2'
                    } hover:-translate-y-0.5 active:translate-y-0.5`}
                  >
                    {ev.isRegistered ? (
                      <>
                        <Check size={18} className="stroke-[3]" /> Registered
                      </>
                    ) : (
                      <>
                        <Plus size={18} /> Join Class
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Peer Buddy / Volunteer Call Center */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
              <PhoneCall className="text-teal-600" size={24} />
              Request a Friendly Call
            </h2>
            <p className="text-md text-slate-500 mb-4 font-bold leading-relaxed">
              Would you like a friendly, supportive volunteer to call and chat, or walk you through how to use WiseCompanion? Let us know.
            </p>

            {buddySubmitted ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 text-center">
                <Sparkles size={36} className="text-emerald-600 mx-auto mb-2" />
                <h3 className="text-lg font-black text-emerald-900 mb-1">Request Received!</h3>
                <p className="text-emerald-700 font-semibold leading-relaxed">
                  A warm, helpful WiseCompanion buddy will call you at <strong className="font-bold">{buddyPhone}</strong> within 24 hours. Keep a lookout!
                </p>
                <button
                  onClick={() => setBuddySubmitted(false)}
                  className="mt-4 text-emerald-800 underline font-black hover:text-emerald-900"
                >
                  Request another call
                </button>
              </div>
            ) : (
              <form onSubmit={handleBuddySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-0.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={buddyName}
                    onChange={(e) => setBuddyName(e.target.value)}
                    placeholder="e.g. Margaret Smith"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-md focus:outline-none focus:border-teal-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-0.5">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={buddyPhone}
                    onChange={(e) => setBuddyPhone(e.target.value)}
                    placeholder="e.g. (512) 555-0199"
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-md focus:outline-none focus:border-teal-500 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 px-4 rounded-xl font-bold text-md shadow-md hover:-translate-y-0.5 active:translate-y-0.5 border-b-4 border-teal-800 hover:border-teal-700 active:border-b-2 transition-all min-h-[48px]"
                >
                  Connect Me with a Buddy
                </button>
              </form>
            )}
          </section>

        </div>

      </div>
    </div>
  );
};

export default Community;

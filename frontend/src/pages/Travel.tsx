import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, MapPin, Calendar, CheckSquare, Square, Plus, Trash2, Briefcase, Hotel, Info } from 'lucide-react';

interface ItineraryDay {
  day: number;
  activities: string[];
}

interface PackingItem {
  id: string;
  item: string;
  checked: boolean;
}

const Travel = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('San Diego, California');
  const [startDate, setStartDate] = useState('2025-07-15');
  const [endDate, setEndDate] = useState('2025-07-20');
  
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { day: 1, activities: ['Arrive at airport', 'Check-in to hotel', 'Dinner by the pier'] },
    { day: 2, activities: ['Visit Zoo', 'Afternoon nap', 'Italian restaurant'] }
  ]);

  const [packingList, setPackingList] = useState<PackingItem[]>([
    { id: '1', item: 'Walking shoes', checked: true },
    { id: '2', item: 'Sunscreen', checked: false },
    { id: '3', item: 'Medications', checked: true },
    { id: '4', item: 'Phone charger', checked: false }
  ]);

  const [newItem, setNewItem] = useState('');

  const togglePacking = (id: string) => {
    setPackingList(packingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addPackingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem) return;
    setPackingList([...packingList, { id: Date.now().toString(), item: newItem, checked: false }]);
    setNewItem('');
  };

  const addDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([...itinerary, { day: nextDay, activities: ['New activity'] }]);
  };

  const addActivity = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push('New activity');
    setItinerary(newItinerary);
  };

  const deleteDay = (dayIndex: number) => {
    const newItinerary = itinerary.filter((_, i) => i !== dayIndex)
      .map((day, i) => ({ ...day, day: i + 1 }));
    setItinerary(newItinerary);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-8 gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 text-lg font-bold min-h-[48px] px-5 py-2.5 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all rounded-2xl shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={24} /> Back
        </button>

        <div className="flex items-center gap-3">
          <Plane size={36} className="text-teal-600 hidden sm:inline" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Travel Assistant</h1>
        </div>
        <div className="w-[80px] hidden sm:block" />
      </div>

      <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
        Plan your next friendly adventure with ease. Organize your activities and manage packing lists.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan Overview */}
        <div className="lg:col-span-2 space-y-8">
          {/* Destination Section */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-900">
              <MapPin className="text-rose-500" size={26} />
              Where are you going?
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xl font-bold text-slate-800 mb-2">Destination</label>
                <input 
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-4.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xl font-bold text-slate-800 mb-2">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-4.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-800 mb-2">End Date</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-4.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Itinerary Section */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-900">
              <Calendar className="text-teal-600" size={26} />
              Your Daily Itinerary
            </h2>
            <div className="space-y-8">
              {itinerary.map((day, idx) => (
                <div key={day.day} className="relative pl-8 border-l-4 border-slate-200 ml-4 group">
                  <div className="absolute -left-[18px] top-0 bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {day.day}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black text-slate-950">Day {day.day}</h3>
                    <button 
                      onClick={() => deleteDay(idx)}
                      className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-50 rounded-lg"
                      title="Delete Day"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <ul className="space-y-3">
                    {day.activities.map((act, i) => (
                      <li key={i} className="bg-slate-50 p-4 rounded-xl text-lg font-bold border border-slate-200 text-slate-700 flex justify-between items-center shadow-sm">
                        <span>{act}</span>
                      </li>
                    ))}
                    <li>
                      <button 
                        onClick={() => addActivity(idx)}
                        className="text-teal-700 hover:text-teal-800 font-black text-lg flex items-center gap-1.5 p-2 bg-teal-50 hover:bg-teal-100 rounded-xl transition-all"
                      >
                        <Plus size={18} /> Add Activity
                      </button>
                    </li>
                  </ul>
                </div>
              ))}
              <button 
                onClick={addDay}
                className="w-full py-4.5 bg-white border-2 border-dashed border-slate-300 border-b-4 hover:border-teal-400 hover:text-teal-700 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all rounded-2xl text-slate-500 font-black text-xl shadow-sm hover:shadow-md"
              >
                + Add Travel Day
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Tools */}
        <div className="space-y-8">
          {/* Packing List */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
              <Briefcase className="text-teal-600" size={26} />
              Packing List
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 mb-6">
              {packingList.map(item => (
                <button 
                  key={item.id}
                  onClick={() => togglePacking(item.id)}
                  className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border-2 border-b-4 transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 shadow-sm ${
                    item.checked 
                      ? 'bg-emerald-50/50 border-emerald-200 border-b-emerald-300 opacity-70' 
                      : 'bg-white border-slate-200 border-b-slate-300 hover:border-teal-300 text-slate-800'
                  }`}
                >
                  {item.checked ? <CheckSquare className="text-emerald-600 flex-shrink-0" size={22} /> : <Square className="text-slate-400 flex-shrink-0" size={22} />}
                  <span className={`text-lg font-black text-left leading-snug ${item.checked ? 'line-through text-emerald-800' : 'text-slate-800'}`}>
                    {item.item}
                  </span>
                </button>
              ))}
            </div>
            <form onSubmit={addPackingItem} className="flex gap-2">
              <input 
                type="text"
                placeholder="Add item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-grow p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg font-bold focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button 
                type="submit" 
                className="bg-teal-600 hover:bg-teal-500 text-white p-4.5 rounded-2xl border-b-4 border-teal-800 hover:border-teal-700 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all shadow-md flex items-center justify-center"
              >
                <Plus size={24} />
              </button>
            </form>
          </section>

          {/* Quick Tools */}
          <section className="space-y-4">
            <div 
              onClick={() => alert("Hotel Finder simulation: Search for accessible stays with zero steps, roll-in showers, and friendly ramps. Feature under active development!")}
              className="bg-teal-50 hover:bg-teal-100 border-2 border-teal-200 border-b-4 border-b-teal-300 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-md active:translate-y-0.5 active:border-b-2 transition-all shadow-sm"
            >
              <Hotel className="text-teal-700 flex-shrink-0" size={32} />
              <div>
                <h4 className="font-black text-lg text-teal-950">Hotel Finder</h4>
                <p className="text-teal-700 font-bold text-base mt-0.5">Accessible stays nearby</p>
              </div>
            </div>
            <div 
              onClick={() => alert("Baggage Rules lookup simulation: Easily view carry-on sizing and liquid exemptions for medical items. Feature under active development!")}
              className="bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 border-b-4 border-b-slate-300 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-md active:translate-y-0.5 active:border-b-2 transition-all shadow-sm"
            >
              <Info className="text-slate-600 flex-shrink-0" size={32} />
              <div>
                <h4 className="font-black text-lg text-slate-900">Baggage Rules</h4>
                <p className="text-slate-600 font-bold text-base mt-0.5">Airline lookup tool</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Travel;

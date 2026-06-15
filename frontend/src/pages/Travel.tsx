import React, { useState } from 'react';
import { Plane, MapPin, Calendar, CheckSquare, Square, Plus, Trash2, Briefcase, Hotel, Info } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto pb-20 text-slate-900">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-3">
          <Plane className="text-blue-600" size={40} />
          Travel Assistant
        </h1>
        <p className="text-xl text-slate-600 mt-2 font-medium">Plan your next adventure with ease.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Plan Overview */}
        <div className="lg:col-span-2 space-y-8">
          {/* Destination Section */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-rose-500" />
              Where are you going?
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-bold text-slate-700 mb-2">Destination</label>
                <input 
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl focus:border-blue-500 focus:outline-none font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-bold text-slate-700 mb-2">Start Date</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-slate-700 mb-2">End Date</label>
                  <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Itinerary Section */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-blue-500" />
              Your Itinerary
            </h2>
            <div className="space-y-8">
              {itinerary.map((day, idx) => (
                <div key={day.day} className="relative pl-8 border-l-4 border-slate-100 ml-4 group">
                  <div className="absolute -left-[18px] top-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {day.day}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Day {day.day}</h3>
                    <button 
                      onClick={() => deleteDay(idx)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <ul className="space-y-3">
                    {day.activities.map((act, i) => (
                      <li key={i} className="bg-slate-50 p-4 rounded-xl text-lg font-medium border border-slate-100 flex justify-between items-center">
                        <span>{act}</span>
                      </li>
                    ))}
                    <li>
                      <button 
                        onClick={() => addActivity(idx)}
                        className="text-blue-600 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Plus size={18} /> Add Activity
                      </button>
                    </li>
                  </ul>
                </div>
              ))}
              <button 
                onClick={addDay}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xl hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                + Add Day
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Tools */}
        <div className="space-y-8">
          {/* Packing List */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-700">
              <Briefcase size={24} />
              Packing List
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
              {packingList.map(item => (
                <button 
                  key={item.id}
                  onClick={() => togglePacking(item.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${item.checked ? 'bg-emerald-50 border-emerald-100 opacity-60' : 'bg-white border-slate-100'}`}
                >
                  {item.checked ? <CheckSquare className="text-emerald-600" /> : <Square className="text-slate-300" />}
                  <span className={`text-lg font-bold ${item.checked ? 'line-through text-emerald-800' : 'text-slate-700'}`}>
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
                className="flex-grow p-4 bg-slate-50 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                <Plus size={24} />
              </button>
            </form>
          </section>

          {/* Quick Tools */}
          <section className="space-y-4">
            <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-amber-100 transition-colors">
              <Hotel className="text-amber-600" size={32} />
              <div>
                <h4 className="font-bold text-lg text-amber-900">Hotel Finder</h4>
                <p className="text-amber-700 font-medium">Accessible stays nearby</p>
              </div>
            </div>
            <div className="bg-sky-50 border-2 border-sky-100 p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-sky-100 transition-colors">
              <Info className="text-sky-600" size={32} />
              <div>
                <h4 className="font-bold text-lg text-sky-900">Baggage Rules</h4>
                <p className="text-sky-700 font-medium">Airline lookup tool</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Travel;

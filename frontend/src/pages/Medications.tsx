import React, { useState } from 'react';
import { Plus, Check, X, Clock, Pill, Trash2 } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  takenToday: string[];
}

const Medications = () => {
  const [meds, setMeds] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      schedule: ['08:00'],
      takenToday: []
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      schedule: ['08:00', '20:00'],
      takenToday: ['08:00']
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('08:00');

  const addMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDosage) return;

    const newMed: Medication = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      dosage: newDosage,
      schedule: [newTime],
      takenToday: []
    };

    setMeds([...meds, newMed]);
    setNewName('');
    setNewDosage('');
    setIsAdding(false);
  };

  const deleteMedication = (id: string) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  const toggleTaken = (medId: string, time: string) => {
    setMeds(meds.map(m => {
      if (m.id === medId) {
        const isTaken = m.takenToday.includes(time);
        return {
          ...m,
          takenToday: isTaken 
            ? m.takenToday.filter(t => t !== time)
            : [...m.takenToday, time]
        };
      }
      return m;
    }));
  };

  const allScheduleItems = meds.flatMap(m => 
    m.schedule.map(time => ({ ...m, time }))
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Medication Reminders</h1>
          <p className="text-xl text-slate-600 mt-2">Track your daily doses and stay healthy.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-6 py-4 rounded-2xl flex items-center gap-2 text-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={28} />
          Add New
        </button>
      </header>

      {/* Daily Timeline */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="text-blue-500" />
          Today's Schedule
        </h2>
        
        <div className="space-y-6">
          {allScheduleItems.length === 0 ? (
            <p className="text-slate-500 text-center py-10 text-xl">No medications scheduled for today.</p>
          ) : (
            allScheduleItems.map((item) => {
              const isTaken = item.takenToday.includes(item.time);
              return (
                <div key={`${item.id}-${item.time}`} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isTaken ? 'bg-green-50 border-green-200 opacity-75' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="text-2xl font-bold text-slate-700 w-24">
                    {item.time}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-slate-900">{item.name}</h3>
                    <p className="text-lg text-slate-600 font-medium">{item.dosage}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => toggleTaken(item.id, item.time)}
                      className={`px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-2 transition-all ${isTaken ? 'bg-green-600 text-white' : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-green-500 hover:text-green-600'}`}
                    >
                      <Check size={24} />
                      {isTaken ? 'Taken' : 'Mark Taken'}
                    </button>
                    {!isTaken && (
                      <button className="px-6 py-4 rounded-xl font-bold text-xl text-slate-400 bg-white border-2 border-slate-200 hover:text-red-500 hover:border-red-200">
                        Skip
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Medication List */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Pill className="text-emerald-500" />
          Your Medications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meds.map(med => (
            <div key={med.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{med.name}</h3>
                <p className="text-lg text-slate-600 font-medium mt-1">Dosage: {med.dosage}</p>
                <div className="mt-4 flex items-center gap-2 text-slate-500">
                  <Clock size={18} />
                  <span className="font-semibold">Scheduled: {med.schedule.join(', ')}</span>
                </div>
              </div>
              <button 
                onClick={() => deleteMedication(med.id)}
                className="text-slate-400 hover:text-red-500 p-2"
                aria-label="Delete medication"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Add Medication Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-slate-900">Add Medication</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X size={32} />
              </button>
            </div>
            
            <form onSubmit={addMedication} className="space-y-6">
              <div>
                <label className="block text-xl font-bold text-slate-700 mb-2">Medication Name</label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Lisinopril"
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl focus:border-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-slate-700 mb-2">Dosage</label>
                <input 
                  type="text"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="e.g. 10mg"
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl focus:border-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-slate-700 mb-2">Daily Time</label>
                <input 
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl focus:border-blue-500 focus:outline-none transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-5 rounded-2xl text-2xl font-bold shadow-lg hover:bg-blue-700 transition-all mt-4"
              >
                Save Medication
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medications;

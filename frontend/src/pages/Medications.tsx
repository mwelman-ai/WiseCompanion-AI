import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, X, Clock, Pill, Trash2, Calendar } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  takenToday: string[];
}

const Medications = () => {
  const navigate = useNavigate();
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
          <Pill size={36} className="text-teal-600 hidden sm:inline" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Medication Reminders</h1>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-2xl flex items-center gap-1.5 text-lg font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0.5 border-b-4 border-teal-800 hover:border-teal-700 active:border-b-2 transition-all min-h-[48px]"
        >
          <Plus size={24} />
          <span className="hidden sm:inline">Add New</span>
        </button>
      </div>

      <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
        Easily manage and track your daily doses to stay healthy, strong, and consistent.
      </p>

      {/* Daily Timeline */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Clock className="text-teal-600" size={28} />
          Today's Schedule & Adherence
        </h2>
        
        <div className="space-y-6">
          {allScheduleItems.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Calendar size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-bold text-xl">No medications scheduled for today.</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="mt-4 bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-md border-b-4 border-teal-800 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all"
              >
                Add Your First Medication
              </button>
            </div>
          ) : (
            allScheduleItems.map((item) => {
              const isTaken = item.takenToday.includes(item.time);
              return (
                <div 
                  key={`${item.id}-${item.time}`} 
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all shadow-sm ${
                    isTaken 
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-80' 
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-black text-slate-800 bg-white px-4 py-2 rounded-xl border border-slate-200 min-w-[90px] text-center shadow-sm">
                      {item.time}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-950 leading-tight">{item.name}</h3>
                      <p className="text-lg text-slate-600 font-bold mt-0.5">Dosage: {item.dosage}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => toggleTaken(item.id, item.time)}
                      className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 border-b-4 transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 shadow-md ${
                        isTaken 
                          ? 'bg-emerald-600 border-emerald-800 text-white hover:bg-emerald-500 hover:border-emerald-700' 
                          : 'bg-white text-slate-800 border-2 border-slate-200 border-b-slate-300 hover:border-teal-500 hover:text-teal-700'
                      }`}
                    >
                      <Check size={20} />
                      {isTaken ? 'Taken' : 'Mark Taken'}
                    </button>
                    {!isTaken && (
                      <button 
                        onClick={() => alert(`Skipped dose of ${item.name} at ${item.time}. Remember to log it with your caretaker if needed!`)}
                        className="px-5 py-3.5 rounded-2xl font-bold text-lg text-slate-600 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 hover:text-rose-600 hover:border-rose-400 hover:border-b-rose-500 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all shadow-md"
                      >
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
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Pill className="text-teal-600" size={28} />
          Your Saved Medications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meds.map(med => (
            <div key={med.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-start hover:border-slate-300 transition-all">
              <div>
                <h3 className="text-2xl font-black text-slate-950 leading-tight">{med.name}</h3>
                <p className="text-lg text-slate-600 font-bold mt-1">Dosage: {med.dosage}</p>
                <div className="mt-4 flex items-center gap-2 text-teal-700 font-bold text-lg">
                  <Clock size={20} />
                  <span>Scheduled: {med.schedule.join(', ')}</span>
                </div>
              </div>
              <button 
                onClick={() => deleteMedication(med.id)}
                className="text-slate-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition-all"
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
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-200 animate-slide-up">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-2">
                <Pill size={28} className="text-teal-600" />
                Add Medication
              </h2>
              <button 
                onClick={() => setIsAdding(false)} 
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={32} />
              </button>
            </div>
            
            <form onSubmit={addMedication} className="space-y-6">
              <div>
                <label className="block text-xl font-bold text-slate-800 mb-2">Medication Name</label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Lisinopril"
                  className="w-full p-4.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-slate-800 mb-2">Dosage Amount</label>
                <input 
                  type="text"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  placeholder="e.g. 10mg"
                  className="w-full p-4.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-slate-800 mb-2">Schedule Time</label>
                <input 
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-4.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white py-5 rounded-2xl text-2xl font-black border-b-4 border-teal-800 hover:border-teal-700 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all shadow-lg active:shadow-md mt-6"
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
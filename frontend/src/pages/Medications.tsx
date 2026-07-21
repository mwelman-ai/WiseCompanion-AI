import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, X, Clock, Pill, Trash2, Calendar, Phone, Send } from 'lucide-react';
import { apiFetch } from '../lib/api';

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

  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('wc-reminder-phone') || '');
  const [smsSendingId, setSmsSendingId] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneNumber(val);
    localStorage.setItem('wc-reminder-phone', val);
  };

  const triggerSmsReminder = async (medName: string, dosage: string, time: string) => {
    if (!phoneNumber) {
      alert('Please enter a reminder phone number first!');
      return;
    }

    const key = `${medName}-${time}`;
    setSmsSendingId(key);
    try {
      const response = await apiFetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          message: `Hi! This is WiseCompanion. Just a warm, supportive reminder to take your medication: ${medName} (${dosage}) scheduled for ${time}. Stay healthy and consistent!`
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert(data.mocked 
          ? `SMS Sent (Mock Mode)! See console for details.\n\nTo: ${phoneNumber}\nMessage: "Hi! This is WiseCompanion..."` 
          : `SMS Reminder sent successfully to ${phoneNumber}!`
        );
      } else {
        alert(`Failed to send SMS reminder: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error sending SMS reminder: ${err.message}`);
    } finally {
      setSmsSendingId(null);
    }
  };

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

  // Check for auto-SMS reminders based on schedule time matching current hour:min
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHourMin = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      allScheduleItems.forEach(item => {
        const isTaken = item.takenToday.includes(item.time);
        if (item.time === currentHourMin && !isTaken) {
          const storageKey = `wc-reminded-${item.id}-${item.time}-${now.toDateString()}`;
          if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, 'true');
            if (phoneNumber) {
              console.log(`[Medication Reminders] Auto-triggering SMS reminder for ${item.name} at ${item.time}`);
              apiFetch('/api/notifications/sms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: phoneNumber,
                  message: `Hi! This is WiseCompanion. Warm, friendly reminder to take your medication: ${item.name} (${item.dosage}) scheduled for ${item.time}. Stay healthy and consistent!`
                })
              }).then(res => res.json()).then(data => {
                console.log('[Auto SMS Reminder Result]:', data);
              }).catch(err => {
                console.error('[Auto SMS Reminder Error]:', err);
              });
            }
          }
        }
      });
    }, 15000); // Check every 15 seconds
    
    return () => clearInterval(interval);
  }, [allScheduleItems, phoneNumber]);

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

      {/* SMS Reminder Configuration Section */}
      <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
          <Phone className="text-teal-600" size={28} />
          SMS Reminder Setup
        </h2>
        <p className="text-lg text-slate-600 mb-4 leading-relaxed font-bold">
          Enter your caretaker's or your own mobile phone number to receive warm, supportive text alerts when it's time for a dose.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="e.g. +1234567890 (International format)"
            className="w-full sm:flex-1 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg focus:border-teal-500 focus:outline-none font-bold"
          />
          {phoneNumber && (
            <div className="text-emerald-600 font-bold flex items-center gap-2 px-2 text-lg whitespace-nowrap">
              <Check size={20} /> Saved to Settings
            </div>
          )}
        </div>
      </section>

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
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border-2 transition-all shadow-sm ${
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

                  <div className="flex gap-3 w-full md:w-auto items-center flex-wrap sm:flex-nowrap">
                    {phoneNumber && !isTaken && (
                      <button 
                        onClick={() => triggerSmsReminder(item.name, item.dosage, item.time)}
                        disabled={smsSendingId === `${item.name}-${item.time}`}
                        className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl font-bold text-lg text-teal-700 bg-teal-50 border-2 border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-all flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0.5 min-h-[48px]"
                        title="Send manual reminder text"
                      >
                        <Send size={18} />
                        {smsSendingId === `${item.name}-${item.time}` ? 'Sending...' : 'Send SMS'}
                      </button>
                    )}
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
                        className="flex-1 sm:flex-none px-5 py-3.5 rounded-2xl font-bold text-lg text-slate-600 bg-white border-2 border-slate-200 border-b-4 border-b-slate-300 hover:text-rose-600 hover:border-rose-400 hover:border-b-rose-500 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 transition-all shadow-md"
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
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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

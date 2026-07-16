import { supabase } from '../config/supabase.js';

// Detect if we are in mock mode (default or missing Supabase keys)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const isMockMode = !(supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url' && supabaseKey !== 'your_supabase_key');

console.log(`[dbService] Mode: ${isMockMode ? 'MOCK DATABASE (In-Memory Fallback)' : 'LIVE DATABASE (Supabase PostgREST)'}`);

// In-memory data stores for mock mode
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  planTier: 'free' | 'premium';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ScamCheck {
  id: string;
  userId: string;
  textContent: string;
  status: 'safe' | 'caution' | 'dangerous';
  probability: number;
  reasons: string[];
  actions: string[];
  createdAt: string;
}

export interface HealthLog {
  id: string;
  userId: string;
  logType: 'walking' | 'water' | 'weight';
  value: number; // minutes for walking, ml for water, kg for weight
  createdAt: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  schedule: string[]; // e.g., ["08:00", "20:00"]
  takenToday: string[]; // times taken today, e.g., ["08:00"]
  createdAt: string;
}

export interface TravelPlan {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  itinerary: { day: number; activities: string[] }[];
  packingList: { id: string; item: string; checked: boolean }[];
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  createdAt: string;
}

// Memory Store State
const mockProfiles: Map<string, UserProfile> = new Map();
const mockChatHistory: ChatMessage[] = [];
const mockScamChecks: ScamCheck[] = [];
const mockHealthLogs: HealthLog[] = [];
const mockMedications: Medication[] = [];
const mockTravelPlans: TravelPlan[] = [];
const mockContacts: EmergencyContact[] = [];

// Initialize with nice, senior-friendly mock data for demoing/development purposes
const initMockData = () => {
  // Mock User
  const defaultUser: UserProfile = {
    id: 'mock-user-123',
    email: 'user@example.com',
    fullName: 'Jane Doe',
    planTier: 'free',
    createdAt: new Date().toISOString()
  };
  mockProfiles.set(defaultUser.id, defaultUser);

  // Chat history
  mockChatHistory.push(
    {
      id: 'chat-1',
      userId: defaultUser.id,
      role: 'user',
      content: 'Hi! What exercises do you recommend for adults over 50?',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'chat-2',
      userId: defaultUser.id,
      role: 'assistant',
      content: 'Hello! For adults over 50, a daily walk of 20-30 minutes is absolutely wonderful for heart health. Gentle stretching or chair yoga is also fantastic for keeping joints limber and improving balance. Remember to always listen to your body and stay hydrated!',
      createdAt: new Date(Date.now() - 3600000 * 2 + 10000).toISOString()
    }
  );

  // Scam checks
  mockScamChecks.push({
    id: 'scam-1',
    userId: defaultUser.id,
    textContent: 'URGENT: Your bank account has been suspended. Click here to verify your identity: http://fake-bank-login.com',
    status: 'dangerous',
    probability: 98,
    reasons: ['Contains urgent/threatening language', 'Requests sensitive identity verification', 'Uses an unofficial-looking web link'],
    actions: ['Do NOT click the link', 'Delete the message immediately', 'Call your bank using the phone number on your physical debit card to verify'],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  });

  // Health logs
  const todayStr = new Date().toISOString().split('T')[0];
  mockHealthLogs.push(
    { id: 'h-1', userId: defaultUser.id, logType: 'walking', value: 25, createdAt: `${todayStr}T09:30:00.000Z` },
    { id: 'h-2', userId: defaultUser.id, logType: 'water', value: 250, createdAt: `${todayStr}T10:00:00.000Z` },
    { id: 'h-3', userId: defaultUser.id, logType: 'water', value: 250, createdAt: `${todayStr}T14:15:00.000Z` },
    { id: 'h-4', userId: defaultUser.id, logType: 'weight', value: 68.5, createdAt: `${todayStr}T08:00:00.000Z` }
  );

  // Medications
  mockMedications.push(
    {
      id: 'med-1',
      userId: defaultUser.id,
      name: 'Lisinopril',
      dosage: '10mg',
      schedule: ['08:00'],
      takenToday: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 'med-2',
      userId: defaultUser.id,
      name: 'Metformin',
      dosage: '500mg',
      schedule: ['08:00', '20:00'],
      takenToday: ['08:00'],
      createdAt: new Date().toISOString()
    }
  );

  // Travel plans
  mockTravelPlans.push({
    id: 'travel-1',
    userId: defaultUser.id,
    destination: 'San Diego, California',
    startDate: '2025-07-15',
    endDate: '2025-07-20',
    itinerary: [
      { day: 1, activities: ['Arrive at airport', 'Check-in to hotel', 'Relaxing dinner by the pier'] },
      { day: 2, activities: ['Visit World-Famous Zoo', 'Afternoon nap in shade', 'Warm Italian restaurant'] }
    ],
    packingList: [
      { id: 'p1', item: 'Walking shoes', checked: true },
      { id: 'p2', item: 'Sunscreen', checked: false },
      { id: 'p3', item: 'Daily Medications', checked: true },
      { id: 'p4', item: 'Phone charger', checked: false }
    ],
    createdAt: new Date().toISOString()
  });

  // Emergency contacts
  mockContacts.push(
    {
      id: 'contact-1',
      userId: defaultUser.id,
      name: 'Sarah (Daughter)',
      relationship: 'Child',
      phone: '555-0199',
      createdAt: new Date().toISOString()
    },
    {
      id: 'contact-2',
      userId: defaultUser.id,
      name: 'Dr. James Smith',
      relationship: 'Primary Care Doctor',
      phone: '555-0144',
      createdAt: new Date().toISOString()
    }
  );
};

initMockData();

// Database Service operations
export const dbService = {
  // Profiles CRUD
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (isMockMode) {
      return mockProfiles.get(userId) || null;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      planTier: data.plan_tier,
      createdAt: data.created_at
    };
  },

  async createUserProfile(profile: UserProfile): Promise<UserProfile> {
    if (isMockMode) {
      mockProfiles.set(profile.id, profile);
      return profile;
    }
    await supabase.from('profiles').insert({
      id: profile.id,
      email: profile.email,
      full_name: profile.fullName,
      plan_tier: profile.planTier,
      created_at: profile.createdAt
    });
    return profile;
  },

  async updateUserPlan(userId: string, planTier: 'free' | 'premium'): Promise<boolean> {
    if (isMockMode) {
      const p = mockProfiles.get(userId);
      if (p) {
        p.planTier = planTier;
        mockProfiles.set(userId, p);
        return true;
      }
      return false;
    }
    const { error } = await supabase
      .from('profiles')
      .update({ plan_tier: planTier })
      .eq('id', userId);
    return !error;
  },

  // Chat Message CRUD
  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    if (isMockMode) {
      return mockChatHistory
        .filter(m => m.userId === userId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      userId: d.user_id,
      role: d.role,
      content: d.content,
      createdAt: d.created_at
    }));
  },

  async saveChatMessage(msg: ChatMessage): Promise<ChatMessage> {
    if (isMockMode) {
      mockChatHistory.push(msg);
      return msg;
    }
    await supabase.from('chat_history').insert({
      id: msg.id,
      user_id: msg.userId,
      role: msg.role,
      content: msg.content,
      created_at: msg.createdAt
    });
    return msg;
  },

  // Scam Check CRUD
  async saveScamCheck(check: ScamCheck): Promise<ScamCheck> {
    if (isMockMode) {
      mockScamChecks.push(check);
      return check;
    }
    await supabase.from('scam_checks').insert({
      id: check.id,
      user_id: check.userId,
      text_content: check.textContent,
      status: check.status,
      probability: check.probability,
      reasons: check.reasons,
      actions: check.actions,
      created_at: check.createdAt
    });
    return check;
  },

  // Health Log CRUD
  async getHealthLogs(userId: string): Promise<HealthLog[]> {
    if (isMockMode) {
      return mockHealthLogs.filter(h => h.userId === userId);
    }
    const { data, error } = await supabase
      .from('health_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      userId: d.user_id,
      logType: d.log_type,
      value: d.value,
      createdAt: d.created_at
    }));
  },

  async saveHealthLog(log: HealthLog): Promise<HealthLog> {
    if (isMockMode) {
      mockHealthLogs.push(log);
      return log;
    }
    await supabase.from('health_logs').insert({
      id: log.id,
      user_id: log.userId,
      log_type: log.logType,
      value: log.value,
      created_at: log.createdAt
    });
    return log;
  },

  // Medications CRUD
  async getMedications(userId: string): Promise<Medication[]> {
    if (isMockMode) {
      return mockMedications.filter(m => m.userId === userId);
    }
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      userId: d.user_id,
      name: d.name,
      dosage: d.dosage,
      schedule: d.schedule,
      takenToday: d.taken_today || [],
      createdAt: d.created_at
    }));
  },

  async saveMedication(med: Medication): Promise<Medication> {
    if (isMockMode) {
      mockMedications.push(med);
      return med;
    }
    await supabase.from('medications').insert({
      id: med.id,
      user_id: med.userId,
      name: med.name,
      dosage: med.dosage,
      schedule: med.schedule,
      taken_today: med.takenToday,
      created_at: med.createdAt
    });
    return med;
  },

  async updateMedication(medId: string, userId: string, updates: Partial<Medication>): Promise<Medication | null> {
    if (isMockMode) {
      const idx = mockMedications.findIndex(m => m.id === medId && m.userId === userId);
      if (idx === -1) return null;
      mockMedications[idx] = { ...mockMedications[idx], ...updates } as Medication;
      return mockMedications[idx] || null;
    }
    const { data, error } = await supabase
      .from('medications')
      .update({
        name: updates.name,
        dosage: updates.dosage,
        schedule: updates.schedule,
        taken_today: updates.takenToday
      })
      .eq('id', medId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      dosage: data.dosage,
      schedule: data.schedule,
      takenToday: data.taken_today || [],
      createdAt: data.created_at
    };
  },

  async deleteMedication(medId: string, userId: string): Promise<boolean> {
    if (isMockMode) {
      const idx = mockMedications.findIndex(m => m.id === medId && m.userId === userId);
      if (idx === -1) return false;
      mockMedications.splice(idx, 1);
      return true;
    }
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', medId)
      .eq('user_id', userId);
    return !error;
  },

  // Travel Plans CRUD
  async getTravelPlans(userId: string): Promise<TravelPlan[]> {
    if (isMockMode) {
      return mockTravelPlans.filter(t => t.userId === userId);
    }
    const { data, error } = await supabase
      .from('travel_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      userId: d.user_id,
      destination: d.destination,
      startDate: d.start_date,
      endDate: d.end_date,
      itinerary: d.itinerary,
      packingList: d.packing_list,
      createdAt: d.created_at
    }));
  },

  async saveTravelPlan(plan: TravelPlan): Promise<TravelPlan> {
    if (isMockMode) {
      mockTravelPlans.push(plan);
      return plan;
    }
    await supabase.from('travel_plans').insert({
      id: plan.id,
      user_id: plan.userId,
      destination: plan.destination,
      start_date: plan.startDate,
      end_date: plan.endDate,
      itinerary: plan.itinerary,
      packing_list: plan.packingList,
      created_at: plan.createdAt
    });
    return plan;
  },

  async updateTravelPlan(planId: string, userId: string, updates: Partial<TravelPlan>): Promise<TravelPlan | null> {
    if (isMockMode) {
      const idx = mockTravelPlans.findIndex(t => t.id === planId && t.userId === userId);
      if (idx === -1) return null;
      mockTravelPlans[idx] = { ...mockTravelPlans[idx], ...updates } as TravelPlan;
      return mockTravelPlans[idx] || null;
    }
    const { data, error } = await supabase
      .from('travel_plans')
      .update({
        destination: updates.destination,
        start_date: updates.startDate,
        end_date: updates.endDate,
        itinerary: updates.itinerary,
        packing_list: updates.packingList
      })
      .eq('id', planId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      destination: data.destination,
      startDate: data.start_date,
      endDate: data.end_date,
      itinerary: data.itinerary,
      packingList: data.packing_list,
      createdAt: data.created_at
    };
  },

  async deleteTravelPlan(planId: string, userId: string): Promise<boolean> {
    if (isMockMode) {
      const idx = mockTravelPlans.findIndex(t => t.id === planId && t.userId === userId);
      if (idx === -1) return false;
      mockTravelPlans.splice(idx, 1);
      return true;
    }
    const { error } = await supabase
      .from('travel_plans')
      .delete()
      .eq('id', planId)
      .eq('user_id', userId);
    return !error;
  },

  // Emergency Contacts CRUD
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    if (isMockMode) {
      return mockContacts.filter(c => c.userId === userId);
    }
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      userId: d.user_id,
      name: d.name,
      relationship: d.relationship,
      phone: d.phone,
      createdAt: d.created_at
    }));
  },

  async saveEmergencyContact(contact: EmergencyContact): Promise<EmergencyContact> {
    if (isMockMode) {
      mockContacts.push(contact);
      return contact;
    }
    await supabase.from('emergency_contacts').insert({
      id: contact.id,
      user_id: contact.userId,
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      created_at: contact.createdAt
    });
    return contact;
  },

  async updateEmergencyContact(contactId: string, userId: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact | null> {
    if (isMockMode) {
      const idx = mockContacts.findIndex(c => c.id === contactId && c.userId === userId);
      if (idx === -1) return null;
      mockContacts[idx] = { ...mockContacts[idx], ...updates } as EmergencyContact;
      return mockContacts[idx] || null;
    }
    const { data, error } = await supabase
      .from('emergency_contacts')
      .update({
        name: updates.name,
        relationship: updates.relationship,
        phone: updates.phone
      })
      .eq('id', contactId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      relationship: data.relationship,
      phone: data.phone,
      createdAt: data.created_at
    };
  },

  async deleteEmergencyContact(contactId: string, userId: string): Promise<boolean> {
    if (isMockMode) {
      const idx = mockContacts.findIndex(c => c.id === contactId && c.userId === userId);
      if (idx === -1) return false;
      mockContacts.splice(idx, 1);
      return true;
    }
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', userId);
    return !error;
  }
};

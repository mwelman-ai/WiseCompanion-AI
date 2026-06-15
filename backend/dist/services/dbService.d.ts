export declare const isMockMode = true;
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
    value: number;
    createdAt: string;
}
export interface Medication {
    id: string;
    userId: string;
    name: string;
    dosage: string;
    schedule: string[];
    takenToday: string[];
    createdAt: string;
}
export interface TravelPlan {
    id: string;
    userId: string;
    destination: string;
    startDate: string;
    endDate: string;
    itinerary: {
        day: number;
        activities: string[];
    }[];
    packingList: {
        id: string;
        item: string;
        checked: boolean;
    }[];
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
export declare const dbService: {
    getUserProfile(userId: string): Promise<UserProfile | null>;
    createUserProfile(profile: UserProfile): Promise<UserProfile>;
    updateUserPlan(userId: string, planTier: "free" | "premium"): Promise<boolean>;
    getChatHistory(userId: string): Promise<ChatMessage[]>;
    saveChatMessage(msg: ChatMessage): Promise<ChatMessage>;
    saveScamCheck(check: ScamCheck): Promise<ScamCheck>;
    getHealthLogs(userId: string): Promise<HealthLog[]>;
    saveHealthLog(log: HealthLog): Promise<HealthLog>;
    getMedications(userId: string): Promise<Medication[]>;
    saveMedication(med: Medication): Promise<Medication>;
    updateMedication(medId: string, userId: string, updates: Partial<Medication>): Promise<Medication | null>;
    deleteMedication(medId: string, userId: string): Promise<boolean>;
    getTravelPlans(userId: string): Promise<TravelPlan[]>;
    saveTravelPlan(plan: TravelPlan): Promise<TravelPlan>;
    updateTravelPlan(planId: string, userId: string, updates: Partial<TravelPlan>): Promise<TravelPlan | null>;
    deleteTravelPlan(planId: string, userId: string): Promise<boolean>;
    getEmergencyContacts(userId: string): Promise<EmergencyContact[]>;
    saveEmergencyContact(contact: EmergencyContact): Promise<EmergencyContact>;
    updateEmergencyContact(contactId: string, userId: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact | null>;
    deleteEmergencyContact(contactId: string, userId: string): Promise<boolean>;
};
//# sourceMappingURL=dbService.d.ts.map
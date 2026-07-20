import axios from 'axios';

// Support standard PostHog environment variables
const posthogKey = process.env.POSTHOG_KEY || 
                   process.env.POSTHOG_API_KEY || 
                   process.env.NEXT_PUBLIC_POSTHOG_KEY || '';

const posthogHost = process.env.POSTHOG_HOST || 
                    process.env.POSTHOG_API_HOST || 
                    process.env.NEXT_PUBLIC_POSTHOG_HOST || 
                    'https://us.i.posthog.com';

export const isPostHogConfigured = !!posthogKey;

console.log(`[Analytics Service] Mode: ${isPostHogConfigured ? 'LIVE POSTHOG' : 'MOCK CONSOLE LOG (Fallback)'}`);

export const analyticsService = {
  /**
   * Capture a generic event in PostHog or fallback to console log.
   * @param distinctId The unique ID of the user (or anonymous ID)
   * @param eventName The name of the event (e.g. 'user_signup', 'tier_upgrade')
   * @param properties Optional key-value pairs for additional context
   */
  async trackEvent(distinctId: string, eventName: string, properties: Record<string, any> = {}): Promise<void> {
    const timestamp = new Date().toISOString();
    
    if (isPostHogConfigured) {
      try {
        console.log(`[Analytics Service] Live tracking event '${eventName}' for user: ${distinctId}`);
        const endpoint = `${posthogHost.replace(/\/$/, '')}/capture/`;
        
        await axios.post(endpoint, {
          api_key: posthogKey,
          event: eventName,
          properties: {
            distinct_id: distinctId,
            timestamp,
            ...properties
          }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error: any) {
        console.error('[Analytics Service] PostHog tracking failed, falling back to log:', error?.message);
        // Fall back to log if live posthog fails
        this.logFallback(distinctId, eventName, properties, timestamp);
      }
    } else {
      this.logFallback(distinctId, eventName, properties, timestamp);
    }
  },

  /**
   * Record a page view event.
   * @param distinctId The unique ID of the user
   * @param url The page URL visited
   * @param properties Optional additional page properties
   */
  async trackPageView(distinctId: string, url: string, properties: Record<string, any> = {}): Promise<void> {
    await this.trackEvent(distinctId, '$pageview', {
      $current_url: url,
      ...properties
    });
  },

  /**
   * Record a user signing up.
   * @param distinctId The unique ID of the user
   * @param email The user email
   * @param source How they found us or waitlist source
   */
  async trackSignup(distinctId: string, email: string, source?: string): Promise<void> {
    await this.trackEvent(distinctId, 'user_signup', {
      email,
      source: source || 'direct',
      $set: { email } // Tell PostHog to set this property on the user profile
    });
  },

  /**
   * Record a subscription tier upgrade.
   * @param distinctId The unique ID of the user
   * @param newTier The new tier ('free' | 'premium')
   * @param stripeSessionId The associated Stripe checkout session ID
   */
  async trackUpgrade(distinctId: string, newTier: 'free' | 'premium', stripeSessionId?: string): Promise<void> {
    await this.trackEvent(distinctId, 'tier_upgrade', {
      new_tier: newTier,
      stripe_session_id: stripeSessionId,
      $set: { plan_tier: newTier }
    });
  },

  /**
   * Record feature usage.
   * @param distinctId The unique ID of the user
   * @param featureName The name of the feature used (e.g., 'scam_check', 'medication_added', 'chat')
   * @param details Optional feature details
   */
  async trackFeatureUsage(distinctId: string, featureName: string, details: Record<string, any> = {}): Promise<void> {
    await this.trackEvent(distinctId, 'feature_usage', {
      feature: featureName,
      ...details
    });
  },

  // Log helper for fallback
  logFallback(distinctId: string, eventName: string, properties: Record<string, any>, timestamp: string): void {
    console.log(`📊 [Analytics Mock] ${timestamp} | DistinctID: ${distinctId} | Event: ${eventName} | Properties:`, JSON.stringify(properties, null, 2));
  }
};

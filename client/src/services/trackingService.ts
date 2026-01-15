interface TrackingEvent {
  event: string;
  userId?: string;
  timestamp: string;
  data?: any;
}

class TrackingService {
  private events: TrackingEvent[] = [];

  track(event: string, userId?: string, data?: any) {
    const trackingEvent: TrackingEvent = {
      event,
      userId,
      timestamp: new Date().toISOString(),
      data
    };

    this.events.push(trackingEvent);
    
    // In production, you would send this to an analytics service
    if (process.env.NODE_ENV !== 'test') {
      console.log('📊 Tracking Event:', trackingEvent);
    }
    
    // Store in localStorage for demo purposes
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('tracking_events');
        const existingEvents = stored ? JSON.parse(stored) : [];
        existingEvents.push(trackingEvent);
        
        // Keep only last 100 events
        if (existingEvents.length > 100) {
          existingEvents.shift();
        }
        
        localStorage.setItem('tracking_events', JSON.stringify(existingEvents));
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Failed to store tracking event:', error);
      }
    }
  }

  // Common tracking methods
  trackLogin(userId: string, provider: string) {
    this.track('user_login', userId, { provider });
  }

  trackLogout(userId: string) {
    this.track('user_logout', userId);
  }

  trackBookBorrow(userId: string, bookId: string, bookTitle: string) {
    this.track('book_borrowed', userId, { bookId, bookTitle });
  }

  trackBookReturn(userId: string, bookId: string, bookTitle: string) {
    this.track('book_returned', userId, { bookId, bookTitle });
  }

  trackBookAdd(userId: string, bookTitle: string) {
    this.track('book_added', userId, { bookTitle });
  }

  trackStockUpdate(userId: string, bookId: string, oldStock: number, newStock: number) {
    this.track('stock_updated', userId, { bookId, oldStock, newStock });
  }

  trackSearch(userId: string, query: string) {
    this.track('search', userId, { query });
  }

  trackPageView(userId: string, page: string) {
    this.track('page_view', userId, { page });
  }

  getEvents(): TrackingEvent[] {
    return this.events;
  }

  getStoredEvents(): TrackingEvent[] {
    try {
      const stored = localStorage.getItem('tracking_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve tracking events:', error);
      return [];
    }
  }

  clearEvents() {
    this.events = [];
    localStorage.removeItem('tracking_events');
  }
}

export const trackingService = new TrackingService();

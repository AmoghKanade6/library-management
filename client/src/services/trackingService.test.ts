import { trackingService } from './trackingService';

describe('TrackingService', () => {
  beforeEach(() => {
    trackingService.clearEvents();
    localStorage.clear();
  });

  it('should track login events', () => {
    trackingService.trackLogin('user123', 'google');
    
    const events = trackingService.getEvents();
    expect(events.length).toBe(1);
    expect(events[0].event).toBe('user_login');
    expect(events[0].userId).toBe('user123');
    expect(events[0].data.provider).toBe('google');
  });

  it('should track logout events', () => {
    trackingService.trackLogout('user123');
    
    const events = trackingService.getEvents();
    expect(events[0].event).toBe('user_logout');
  });

  it('should track book borrow events', () => {
    trackingService.trackBookBorrow('user123', 'book456', 'Test Book');
    
    const events = trackingService.getEvents();
    expect(events[0].event).toBe('book_borrowed');
    expect(events[0].data.bookId).toBe('book456');
    expect(events[0].data.bookTitle).toBe('Test Book');
  });

  it('should track book return events', () => {
    trackingService.trackBookReturn('user123', 'book456', 'Test Book');
    
    const events = trackingService.getEvents();
    expect(events[0].event).toBe('book_returned');
  });

  it('should store events in localStorage', () => {
    trackingService.trackLogin('user123', 'google');
    
    const stored = localStorage.getItem('tracking_events');
    expect(stored).not.toBeNull();
    
    const parsedEvents = JSON.parse(stored!);
    expect(parsedEvents.length).toBe(1);
  });

  it('should retrieve stored events', () => {
    trackingService.trackLogin('user123', 'google');
    trackingService.trackBookBorrow('user123', 'book1', 'Book 1');
    
    const storedEvents = trackingService.getStoredEvents();
    expect(storedEvents.length).toBe(2);
  });

  it('should limit stored events to 100', () => {
    // Add 150 events
    for (let i = 0; i < 150; i++) {
      trackingService.track(`event_${i}`, 'user123');
    }
    
    const storedEvents = trackingService.getStoredEvents();
    expect(storedEvents.length).toBeLessThanOrEqual(100);
  });

  it('should clear all events', () => {
    trackingService.trackLogin('user123', 'google');
    trackingService.clearEvents();
    
    expect(trackingService.getEvents().length).toBe(0);
    expect(trackingService.getStoredEvents().length).toBe(0);
  });

  it('should include timestamp in events', () => {
    trackingService.trackLogin('user123', 'google');
    
    const events = trackingService.getEvents();
    expect(events[0].timestamp).toBeDefined();
    expect(new Date(events[0].timestamp)).toBeInstanceOf(Date);
  });
});

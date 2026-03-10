import { useState } from 'react';
import { events, CommunityEvent } from '../data/events';
import { EventCard } from './EventCard';
import { EventFilter } from './EventFilter';
import { RegistrationForm } from './RegistrationForm';

/*
 * ⚠️ THIS COMPONENT HAS INTENTIONAL ACCESSIBILITY ISSUES
 */
export function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [registeringFor, setRegisteringFor] = useState<CommunityEvent | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const handleRegister = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setRegisteringFor(event);
    }
  };

  const handleSubmitRegistration = (data: { name: string; email: string }) => {
    setSuccessMessage(`Thanks ${data.name}! You are registered for ${registeringFor?.title}.`);
    setRegisteringFor(null);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ marginBottom: '8px' }}>Community Events</h1>
      <p style={{ color: '#4a4a4a', marginBottom: '24px' }}>
        Find events happening in your neighborhood
      </p>

      {/* Issue: success message has no role="status" or aria-live */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            background: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
          }}
        >
          {successMessage}
        </div>
      )}

      <EventFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Issue: no semantic list structure for event cards */}
      <section aria-label="Event listings">
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredEvents.map((event) => (
        <li key={event.id}>  
        <EventCard key={event.id} event={event} onRegister={handleRegister} />
        </li>
        ))}
      </ul>
  </section>

      {filteredEvents.length === 0 && (
        <p>No events found for this category.</p>
      )}

      {registeringFor && (
        <RegistrationForm
          eventTitle={registeringFor.title}
          onSubmit={handleSubmitRegistration}
          onCancel={() => setRegisteringFor(null)}
        />
      )}
    </main>
  );
}
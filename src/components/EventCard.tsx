import { CommunityEvent } from '../data/events';

export interface EventCardProps {
  event: CommunityEvent;
  onRegister: (eventId: string) => void;
}

export function EventCard({ event, onRegister }: EventCardProps) {
  const isFull = event.spotsRemaining === 0;

  return (
    <article
      aria-label={`Event: ${event.title}`}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '400px',
      }}
    >
      <img
        src={event.imageUrl}
        alt={`${event.title} — ${event.category} event`}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />

      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>
          {event.title}
        </h3>
        <span style={{ color: '#4a4a4a', fontSize: '14px' }}>
        <span style={{ color: '#f7f7f7', fontSize: '14px' }}>
          {event.date} | {event.time}
        </span>

        <p style={{ marginTop: '8px' }}>{event.description}</p>

        <span style={{ color: 'blue', fontSize: '14px' }}>
          <strong>Location:</strong> {event.location}
        </span>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              color: isFull ? 'red' : 'green',
              fontWeight: 'bold',
            }}
          >
            {isFull ? 'Status: Full' : `Spots remaining: ${event.spotsRemaining} spots`}
          </span>

          <button
            type="button"
            disabled={isFull}
            aria-label={isFull ? 'Register' : `Register for ${event.title}`}
            onClick={() => {
              if (!isFull) onRegister(event.id);
            }}
            style={{
              background: isFull ? '#ccc' : '#007bff',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: isFull ? 'not-allowed' : 'pointer',
            }}
          >
            Register
          </button>
        </div>
      </div>
    </article>
  );
}
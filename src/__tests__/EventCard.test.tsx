import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCard } from '../components/EventCard';
import { CommunityEvent } from '../data/events';

const createEvent = (overrides: Partial<CommunityEvent> = {}): CommunityEvent => ({
  id: 'evt-test',
  title: 'Test Event',
  date: '2026-03-01',
  time: '6:00 PM',
  location: 'Test Location',
  description: 'A test event description.',
  category: 'workshop',
  imageUrl: '/images/test.jpg',
  spotsRemaining: 10,
  ...overrides,
});

describe('EventCard', () => {
  describe('accessibility', () => {
    it('renders the event image with descriptive alt text', () => {
      render(<EventCard event={createEvent()} onRegister={vi.fn()} />);

      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt');
      expect(img.getAttribute('alt')).not.toBe('');
    });

    it('uses a heading element for the event title', () => {
      render(<EventCard event={createEvent({ title: 'My Workshop' })} onRegister={vi.fn()} />);

      // getByRole('heading') will fail if <b> is used instead of <h2>/<h3>
      expect(screen.getByRole('heading', { name: /my workshop/i })).toBeInTheDocument();
    });

    it('renders the register action as a real button', () => {
      render(<EventCard event={createEvent()} onRegister={vi.fn()} />);

      // getByRole('button') will fail if a <div> is used
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('disables the register button when event is full', () => {
      render(
        <EventCard event={createEvent({ spotsRemaining: 0 })} onRegister={vi.fn()} />
      );

      const button = screen.getByRole('button', { name: /register/i });
      expect(button).toBeDisabled();
    });

    it('register button has an accessible name that includes the event title', () => {
      render(
        <EventCard event={createEvent({ title: 'React Workshop' })} onRegister={vi.fn()} />
      );

      expect(
        screen.getByRole('button', { name: /register.*react workshop/i })
      ).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onRegister with event id when register button is clicked', async () => {
      const user = userEvent.setup();
      const onRegister = vi.fn();
      render(<EventCard event={createEvent({ id: 'evt-42' })} onRegister={onRegister} />);

      await user.click(screen.getByRole('button', { name: /register/i }));
      expect(onRegister).toHaveBeenCalledWith('evt-42');
    });

    it('does not call onRegister when event is full', async () => {
      const user = userEvent.setup();
      const onRegister = vi.fn();
      render(
        <EventCard event={createEvent({ spotsRemaining: 0 })} onRegister={onRegister} />
      );

      const button = screen.getByRole('button', { name: /register/i });
      await user.click(button);
      expect(onRegister).not.toHaveBeenCalled();
    });
  });

  it('shows spots remaining text so status is not color-only', () => {
    render(<EventCard event={createEvent({ spotsRemaining: 3 })} onRegister={vi.fn()} />);
    expect(screen.getByText(/spots remaining: 3 spots/i)).toBeInTheDocument();
  });

  it('uses an article container for the card', () => {
    const { container } = render(<EventCard event={createEvent()} onRegister={vi.fn()} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });
});
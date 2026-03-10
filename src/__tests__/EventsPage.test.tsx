import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventsPage } from '../components/EventsPage';

describe('EventsPage', () => {
  describe('accessibility', () => {
    it('uses an h1 heading for the page title', () => {
      render(<EventsPage />);

      expect(screen.getByRole('heading', { level: 1, name: /community events/i })).toBeInTheDocument();
    });

    it('uses a main landmark', () => {
      render(<EventsPage />);

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders event cards for all events', () => {
      render(<EventsPage />);

      // Should have heading elements for each event
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('filtering', () => {
    it('filters events by category', async () => {
      const user = userEvent.setup();
      render(<EventsPage />);

      await user.click(screen.getByRole('button', { name: /volunteer/i }));

      expect(
        screen.getByRole('heading', { level: 3, name: /community garden volunteer day/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { level: 3, name: /friday game night/i })
      ).not.toBeInTheDocument();
    });

    it('shows all events when "All Events" is selected', async () => {
      const user = userEvent.setup();
      render(<EventsPage />);

      // First filter to a category
      await user.click(screen.getByRole('button', { name: /volunteer/i }));
      // Then back to all
      await user.click(screen.getByRole('button', { name: /all events/i }));

      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('shows status message after successful registration', async () => {
    const user = userEvent.setup();
    render(<EventsPage />);

    await user.click(screen.getAllByRole('button', { name: /register for/i })[0]);
    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventFilter } from '../components/EventFilter';

describe('EventFilter', () => {
  describe('accessibility', () => {
    it('renders filter options as buttons, not divs', () => {
      render(<EventFilter selectedCategory="all" onCategoryChange={vi.fn()} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(5);
    });

    it('indicates the selected filter with aria-pressed', () => {
      render(<EventFilter selectedCategory="workshop" onCategoryChange={vi.fn()} />);

      expect(screen.getByRole('button', { name: /workshops/i })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByRole('button', { name: /social/i })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    });

    it('has a visible label or group label for the filters', () => {
      render(<EventFilter selectedCategory="all" onCategoryChange={vi.fn()} />);

      // Check for a visible label — this could be a <legend>, <label>, or heading
      expect(
        screen.getByText(/filter/i) || screen.getByText(/category/i)
      ).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onCategoryChange when a filter button is clicked', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<EventFilter selectedCategory="all" onCategoryChange={onChange} />);

      await user.click(screen.getByRole('button', { name: /volunteer/i }));
      expect(onChange).toHaveBeenCalledWith('volunteer');
    });
  });

  it('marks selected and unselected states with aria-pressed', () => {
    render(<EventFilter selectedCategory="meeting" onCategoryChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /meetings/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /all events/i })).toHaveAttribute('aria-pressed', 'false');
  });
});
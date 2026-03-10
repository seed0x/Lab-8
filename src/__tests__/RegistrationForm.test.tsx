import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from '../components/RegistrationForm';

describe('RegistrationForm', () => {
  const defaultProps = {
    eventTitle: 'Test Event',
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  describe('accessibility', () => {
    it('renders a dialog with proper role', () => {
      render(<RegistrationForm {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('uses a heading for the form title', () => {
      render(<RegistrationForm {...defaultProps} />);

      expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    });

    it('has visible labels for form inputs', () => {
      render(<RegistrationForm {...defaultProps} />);

      // getByLabelText will fail if <label> elements are missing
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('renders cancel and submit as real buttons', () => {
      render(<RegistrationForm {...defaultProps} />);

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('shows accessible error messages on invalid submission', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Error messages should use role="alert"
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThanOrEqual(1);
    });

    it('marks inputs as invalid when errors exist', async () => {
      const user = userEvent.setup();
      render(<RegistrationForm {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByLabelText(/name/i)).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('form submission', () => {
    it('submits valid data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<RegistrationForm {...defaultProps} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/name/i), 'Jane Doe');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
    });

    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<RegistrationForm {...defaultProps} onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('shows invalid email message and does not submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegistrationForm {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'bad-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears name required error when typing', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/name/i), 'A');
    expect(screen.queryByText(/^required$/i)).not.toBeInTheDocument();
  });
});
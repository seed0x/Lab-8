import { useState } from 'react';

export interface RegistrationFormProps {
  eventTitle: string;
  onSubmit: (data: { name: string; email: string }) => void;
  onCancel: () => void;
}

/*
 * ⚠️ THIS COMPONENT HAS INTENTIONAL ACCESSIBILITY ISSUES
 */
export function RegistrationForm({ eventTitle, onSubmit, onCancel }: RegistrationFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Required';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ name: name.trim(), email: email.trim() });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '400px',
          maxWidth: '90%',
        }}
      >
        {/* Issue: no heading hierarchy — goes straight to styled text */}
        <h2 id="registration-title" style={{ margin: '0 0 4px 0' }}>
          Register for Event
        </h2>
        
        <p style={{ color: '#aaa', fontSize: '14px' }}>{eventTitle}</p>
        
  <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        <div style={{ marginTop: '16px' }}>
          {/* Issue: placeholder used instead of visible label */}
        <label htmlFor="name-input">Name</label> 
          <input
            id="name-input"
            type="text"
            value={name}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '4px',
              border: errors.name ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {/* Issue: error message not associated with field, no role="alert" */}
          {errors.name && (
            <span id="name-error" role="alert" style={{ color: '#b00020', fontSize: '12px' }}>
                {errors.name}</span>
           )}
        </div>

        <div style={{ marginTop: '12px' }}>
          {/* Issue: placeholder used instead of visible label */}
          <label htmlFor="email-input">Email</label>
            <input
            id="email-input"
            type="email"
            value={email}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '4px',
              border: errors.email ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {errors.email && (
            <span id="email-error" role="alert" style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>
          )}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}>Cancel</button>
            <button type="button" onClick={handleSubmit}>Submit</button>
        </div>
      </form>
      </div>
    </div>
  );
}
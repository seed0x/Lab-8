# Lab 8: Accessibility Audit & Fixes

### Week 9 | UI Design II — Accessibility

## Overview

In this lab, you'll perform an accessibility audit on a pre-built React application and fix the issues you discover. The application — a community events page — contains **intentional accessibility violations** spanning WCAG's four principles: Perceivable, Operable, Understandable, and Robust (POUR). Your job is to find them, document them, and fix them.

This is the kind of work that accessibility consultants and frontend engineers do regularly. You'll use both automated tools (axe DevTools) and manual testing techniques (keyboard navigation, semantic HTML review) to identify barriers that would prevent users with disabilities from accessing the content.

#### Prerequisites:
- Completed Labs 1–4
- Week 5 readings completed (WebAIM Intro, WCAG Overview, WebAIM Checklist)
- Node.js 20+ installed
- A Chromium-based browser (Chrome or Edge) for [axe DevTools](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?pli=1)

---

> [!IMPORTANT]
> **Windows Users:** We recommend using PowerShell rather than Command Prompt. Where commands differ between operating systems, both versions are provided. PowerShell commands are compatible with the Linux/macOS versions in most cases.

---

## Learning Objectives

By the end of this lab, you will be able to:

1. **Conduct** an accessibility audit using both automated tools and manual techniques
2. **Identify** WCAG 2.2 violations and classify them by the POUR principles
3. **Fix** common accessibility issues including missing alt text, insufficient color contrast, improper heading hierarchy, missing form labels, and keyboard traps
4. **Test** accessibility fixes using keyboard navigation and semantic HTML verification
5. **Write** tests that verify accessible markup using Testing Library's accessibility-first queries
6. **Document** accessibility findings in a structured audit report

---

## Connection to Readings

This lab revisits concepts from your Week 5 readings:

### From "Introduction to Web Accessibility" (WebAIM)
- **Why accessibility matters:** WebAIM explains that accessibility means "people with disabilities can equally perceive, understand, navigate, and interact with websites." In this lab, you'll discover firsthand how inaccessible code creates barriers — missing alt text means screen reader users get no information about images, missing labels mean form fields are unusable without a mouse.
- **Types of disabilities:** The reading covers visual, auditory, motor, and cognitive disabilities. The bugs you'll fix span all of these — from color contrast (visual) to keyboard navigation (motor) to clear error messages (cognitive).

### From "WCAG Overview" (WebAIM)
- **POUR principles:** Every issue you find maps to one of the four WCAG principles — Perceivable, Operable, Understandable, or Robust. Your audit report must classify each finding by its POUR category.
- **Conformance levels:** You'll see issues at Level A (critical baseline), Level AA (standard target for most organizations), and Level AAA (enhanced). Most of your fixes will target Level A and AA compliance.

### From "WebAIM WCAG 2 Checklist"
- **Practical checklist:** You'll use this checklist as your audit guide. Each item maps to a specific WCAG success criterion. When you document findings, you'll reference the specific checklist items and success criteria (e.g., "1.1.1 Non-text Content" for missing alt text).

---

## Part 1: The Inaccessible Application (20 minutes)

### Step 1.1: Clone Your Repository

After accepting the GitHub Classroom assignment, clone your repository and install dependencies:

```bash
git clone https://github.com/ClarkCollege-CSE-SoftwareEngineering/lab-8-accessibility-audit-YOURUSERNAME.git
cd lab-8-accessibility-audit-YOURUSERNAME
npm install
```

Your repository comes pre-configured with TypeScript, Vitest, React Testing Library, and all necessary dependencies.

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and npm scripts (`test`, `test:run`, `test:coverage`, `typecheck`) |
| `tsconfig.json` | TypeScript compiler options (strict mode, JSX, DOM types) |
| `vitest.config.ts` | Test runner config (jsdom environment, 90% coverage thresholds) |
| `src/setupTests.ts` | Imports `@testing-library/jest-dom` matchers |

✅ **Checkpoint:** Run `npm run typecheck` — it should complete with no errors (or "no input files found," which is fine since we haven't created source files yet).

You'll now create the "broken" version of the application. **Read through each file carefully** — the accessibility issues are intentional and you'll need to find and fix them.

### Step 1.2: Create Event Data

Create `src/data/events.ts`:

```typescript
export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'workshop' | 'social' | 'volunteer' | 'meeting';
  imageUrl: string;
  spotsRemaining: number;
}

export const events: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'React Workshop: Building Accessible Components',
    date: '2026-02-20',
    time: '6:00 PM - 8:00 PM',
    location: 'Clark College, Room 204',
    description:
      'Learn how to build React components that work for everyone. We will cover ARIA attributes, keyboard navigation, and screen reader testing.',
    category: 'workshop',
    imageUrl: '/images/react-workshop.jpg',
    spotsRemaining: 12,
  },
  {
    id: 'evt-2',
    title: 'Community Garden Volunteer Day',
    date: '2026-02-22',
    time: '9:00 AM - 12:00 PM',
    location: 'Esther Short Park',
    description:
      'Help us plant spring vegetables and maintain the community garden beds. Bring gloves and water. All experience levels welcome.',
    category: 'volunteer',
    imageUrl: '/images/garden-day.jpg',
    spotsRemaining: 0,
  },
  {
    id: 'evt-3',
    title: 'Friday Game Night',
    date: '2026-02-27',
    time: '7:00 PM - 10:00 PM',
    location: 'Student Union, Main Hall',
    description:
      'Board games, card games, and video games. Snacks provided. Bring your favorite game to share!',
    category: 'social',
    imageUrl: '/images/game-night.jpg',
    spotsRemaining: 30,
  },
  {
    id: 'evt-4',
    title: 'Neighborhood Watch Meeting',
    date: '2026-03-01',
    time: '5:30 PM - 6:30 PM',
    location: 'Community Center, Room B',
    description:
      'Monthly meeting to discuss neighborhood safety, upcoming events, and community concerns. Open to all residents.',
    category: 'meeting',
    imageUrl: '/images/meeting.jpg',
    spotsRemaining: 50,
  },
];
```

### Step 1.3: Create the EventCard Component (WITH ACCESSIBILITY ISSUES)

Create `src/components/EventCard.tsx`:

```tsx
import React from 'react';
import { CommunityEvent } from '../data/events';

export interface EventCardProps {
  event: CommunityEvent;
  onRegister: (eventId: string) => void;
}

/*
 * ⚠️ THIS COMPONENT HAS INTENTIONAL ACCESSIBILITY ISSUES
 * Your job is to find and fix them. Do NOT fix them yet —
 * first complete Part 2 (the audit), then fix in Part 3.
 */
export function EventCard({ event, onRegister }: EventCardProps) {
  const isFull = event.spotsRemaining === 0;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '400px',
      }}
    >
      {/* Issue: image has no alt text */}
      <img
        src={event.imageUrl}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />

      <div style={{ padding: '16px' }}>
        {/* Issue: using <b> for visual styling instead of proper heading */}
        <b style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>
          {event.title}
        </b>

        {/* Issue: color contrast — light gray on white fails WCAG AA */}
        <span style={{ color: '#bbb', fontSize: '14px' }}>
          {event.date} | {event.time}
        </span>

        <p style={{ marginTop: '8px' }}>{event.description}</p>

        {/* Issue: location uses color alone to convey meaning */}
        <span style={{ color: 'blue', fontSize: '14px' }}>
          {event.location}
        </span>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Issue: spots remaining communicated only by color */}
          <span
            style={{
              color: isFull ? 'red' : 'green',
              fontWeight: 'bold',
            }}
          >
            {isFull ? 'FULL' : `${event.spotsRemaining} spots`}
          </span>

          {/* Issue: div used as button, no keyboard support, no accessible name */}
          <div
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
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 1.4: Create the EventFilter Component (WITH ACCESSIBILITY ISSUES)

Create `src/components/EventFilter.tsx`:

```tsx
import React from 'react';

export interface EventFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

/*
 * ⚠️ THIS COMPONENT HAS INTENTIONAL ACCESSIBILITY ISSUES
 */
export function EventFilter({ selectedCategory, onCategoryChange }: EventFilterProps) {
  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'social', label: 'Social' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'meeting', label: 'Meetings' },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Issue: no visible label for the filter, and no <label> element */}
      {/* Issue: using divs as interactive elements instead of proper inputs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <div
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              cursor: 'pointer',
              /* Issue: selected state communicated only by background color */
              background: selectedCategory === cat.value ? '#007bff' : 'white',
              color: selectedCategory === cat.value ? 'white' : '#333',
              fontSize: '14px',
            }}
          >
            {cat.label}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 1.5: Create the RegistrationForm Component (WITH ACCESSIBILITY ISSUES)

Create `src/components/RegistrationForm.tsx`:

```tsx
import React, { useState } from 'react';

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
      newErrors.email = 'Required';
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
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          width: '400px',
          maxWidth: '90%',
        }}
      >
        {/* Issue: no heading hierarchy — goes straight to styled text */}
        <b style={{ fontSize: '18px', display: 'block', marginBottom: '4px' }}>
          Register for Event
        </b>
        <span style={{ color: '#aaa', fontSize: '14px' }}>{eventTitle}</span>

        <div style={{ marginTop: '16px' }}>
          {/* Issue: placeholder used instead of visible label */}
          <input
            type="text"
            placeholder="Your name"
            value={name}
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
            <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>
          )}
        </div>

        <div style={{ marginTop: '12px' }}>
          {/* Issue: placeholder used instead of visible label */}
          <input
            type="text"
            placeholder="Your email"
            value={email}
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
            <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>
          )}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          {/* Issue: no visible focus indicator, no keyboard handling */}
          <span
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            Cancel
          </span>

          <div
            onClick={handleSubmit}
            style={{
              background: '#007bff',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 1.6: Create the EventsPage Component (WITH ACCESSIBILITY ISSUES)

Create `src/components/EventsPage.tsx`:

```tsx
import React, { useState } from 'react';
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Issue: no <main> landmark, no skip navigation */}
      {/* Issue: page title uses <b> instead of <h1> */}
      <b style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>
        Community Events
      </b>
      <span style={{ color: '#aaa', marginBottom: '24px', display: 'block' }}>
        Find events happening in your neighborhood
      </span>

      {/* Issue: success message has no role="status" or aria-live */}
      {successMessage && (
        <div
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} onRegister={handleRegister} />
        ))}
      </div>

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
    </div>
  );
}
```

✅ **Checkpoint:** Run `npm run typecheck` — it should complete with no errors. Take a moment to read through every component. You'll notice comments marking each intentional issue.

🤔 **Reflection Question:** Before you begin the formal audit, scan the code and list three issues you can spot just from reading it. Which POUR principle does each one violate? (Refer to your WebAIM WCAG Overview reading.)

---

## Part 2: Conduct the Accessibility Audit (25 minutes)

Now you'll systematically audit the application. You'll document findings in a structured report.

### Step 2.1: Install axe DevTools (Browser Extension)

If you haven't already:

1. Open Chrome or Edge
2. Go to the Extensions store
3. Search for **"axe DevTools"** by Deque Systems
4. Install the free version



> [!NOTE]
> Since we're not running a dev server, you'll perform the axe audit on code review rather than a live page. Focus on manual code-level auditing for this lab. If you want to also run axe against a rendered page, see the Stretch Goals section.

### Step 2.2: Create Your Audit Report

Create `src/AUDIT_REPORT.md`:

```markdown
# Accessibility Audit Report

**Auditor:** [Your Name]
**Date:** [Today's Date]
**Application:** Community Events Page

## Summary

Total issues found: [NUMBER]
- Critical (Level A): [NUMBER]
- Major (Level AA): [NUMBER]
- Minor (Level AAA / Best Practice): [NUMBER]

## Findings

### Finding 1: [Title]

- **Component:** [Which component file]
- **WCAG Criterion:** [e.g., 1.1.1 Non-text Content]
- **Level:** [A / AA / AAA]
- **POUR Principle:** [Perceivable / Operable / Understandable / Robust]
- **Description:** [What the issue is]
- **Impact:** [Who is affected and how]
- **Fix:** [What you did to fix it]

### Finding 2: [Title]
...

<!-- Continue for ALL issues found. You should find at least 12. -->
```

### Step 2.3: Systematic Audit Checklist

Work through the application using this checklist, referencing the **WebAIM WCAG 2 Checklist** from your readings:

**Perceivable:**
- [ ] All images have appropriate alt text (WCAG 1.1.1)
- [ ] Color is not used as the only way to convey information (WCAG 1.4.1)
- [ ] Text has sufficient contrast against backgrounds (WCAG 1.4.3 — minimum 4.5:1 for normal text)
- [ ] Form inputs have visible labels (WCAG 1.3.1)

**Operable:**
- [ ] All interactive elements are reachable via keyboard (WCAG 2.1.1)
- [ ] Interactive elements have visible focus indicators (WCAG 2.4.7)
- [ ] No keyboard traps exist (WCAG 2.1.2)
- [ ] Page has a clear heading hierarchy (WCAG 2.4.6)

**Understandable:**
- [ ] Form errors are clearly identified and described (WCAG 3.3.1)
- [ ] Error messages are associated with their fields (WCAG 3.3.1)
- [ ] Labels and instructions are provided for user input (WCAG 3.3.2)

**Robust:**
- [ ] Interactive elements use appropriate semantic HTML (WCAG 4.1.2)
- [ ] Custom widgets have proper ARIA roles and states (WCAG 4.1.2)
- [ ] Dialogs/modals manage focus correctly (WCAG 4.1.2)

🤔 **Reflection Question:** The WebAIM checklist distinguishes between Level A (essential), AA (standard), and AAA (enhanced) conformance. For a community events page, which conformance level would you target? Why? What might make AAA impractical for some requirements?

---

## Part 3: Fix the Accessibility Issues (30 minutes)

Now fix all the issues you identified. Create **new, fixed versions** of each component.

### Step 3.1: Fix EventCard

Replace the contents of `src/components/EventCard.tsx` with your fixed version. Here is a guide for what needs fixing — **you must write the actual fix code yourself:**

**Issues to fix:**
1. Add meaningful `alt` text to the image
2. Use a proper heading element (`<h2>` or `<h3>`) instead of `<b>` for the event title
3. Fix color contrast on the date/time text (use a color with at least 4.5:1 contrast ratio against white)
4. Ensure location is not conveyed by color alone (add an icon prefix, underline, or other visual indicator)
5. Add text alongside the color for spots remaining (not just color alone)
6. Replace the `<div>` "button" with a real `<button>` element
7. Add proper `disabled` attribute when the event is full
8. Add an accessible label for the button that includes the event title (e.g., `aria-label={`Register for ${event.title}`}`)

Here's a **starter** showing the first two fixes. Complete the rest:

```tsx
import React from 'react';
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
      {/* FIX 1: Descriptive alt text */}
      <img
        src={event.imageUrl}
        alt={`${event.title} — ${event.category} event`}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />

      <div style={{ padding: '16px' }}>
        {/* FIX 2: Proper heading element */}
        <h3 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>
          {event.title}
        </h3>

        {/* TODO: Fix the remaining issues (3-8) */}
        {/* Replace the code below with your accessible versions */}

        <span style={{ color: '#bbb', fontSize: '14px' }}>
          {event.date} | {event.time}
        </span>

        <p style={{ marginTop: '8px' }}>{event.description}</p>

        <span style={{ color: 'blue', fontSize: '14px' }}>
          {event.location}
        </span>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              color: isFull ? 'red' : 'green',
              fontWeight: 'bold',
            }}
          >
            {isFull ? 'FULL' : `${event.spotsRemaining} spots`}
          </span>

          <div
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
          </div>
        </div>
      </div>
    </article>
  );
}
```

### Step 3.2: Fix EventFilter

Replace `src/components/EventFilter.tsx`. Issues to fix:

1. Add a visible label for the filter group (e.g., "Filter by category")
2. Use proper `<button>` elements instead of `<div>`s for each filter option
3. Add `aria-pressed` to indicate the selected state (not just color)
4. Ensure keyboard operability (buttons get this for free)

```tsx
// TODO: Write the complete fixed EventFilter component
// Use <fieldset> or a labeled group with <button> elements
// Each button should have aria-pressed="true" or "false"
```

### Step 3.3: Fix RegistrationForm

Replace `src/components/RegistrationForm.tsx`. Issues to fix:

1. Add a proper heading (`<h2>`) instead of `<b>` for "Register for Event"
2. Add visible `<label>` elements for both form inputs
3. Use `type="email"` for the email field
4. Add `aria-describedby` linking each input to its error message
5. Add `aria-invalid` to inputs with errors
6. Add `role="alert"` to error messages
7. Replace `<div>` and `<span>` buttons with real `<button>` elements
8. Use a `<form>` element with `onSubmit` instead of a `<div>` with `onClick`
9. Add `role="dialog"` and `aria-modal="true"` to the modal container
10. Add `aria-labelledby` to the dialog referencing the heading

```tsx
// TODO: Write the complete fixed RegistrationForm component
// This is the most complex fix — reference the WebAIM checklist for form guidance
```

### Step 3.4: Fix EventsPage

Replace `src/components/EventsPage.tsx`. Issues to fix:

1. Use a `<main>` landmark element
2. Use `<h1>` for the page title
3. Add `role="status"` and `aria-live="polite"` to the success message
4. Fix subtitle contrast (same issue as EventCard date/time)

```tsx
// TODO: Write the complete fixed EventsPage component
```

✅ **Checkpoint:** Run `npm run typecheck` — it should still compile with no errors after your fixes.

---

## Part 4: Write Accessibility-Focused Tests (20 minutes)

Now write tests that **verify your fixes work**. These tests ensure accessibility won't regress.

### Step 4.1: Create EventCard Tests

Create `src/__tests__/EventCard.test.tsx`:

```tsx
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

  // TODO: Add at least 2 more tests verifying accessibility fixes
  // Ideas:
  // - Verify spots remaining text is visible (not color-only)
  // - Verify the card uses an <article> element
  // - Verify date/time text has sufficient contrast (check style)
});
```

### Step 4.2: Create EventFilter Tests

Create `src/__tests__/EventFilter.test.tsx`:

```tsx
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

  // TODO: Add at least 1 more accessibility test
});
```

### Step 4.3: Create RegistrationForm Tests

Create `src/__tests__/RegistrationForm.test.tsx`:

```tsx
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

  // TODO: Add at least 2 more tests
  // Ideas:
  // - Verify email validation error message content
  // - Verify errors clear when user starts typing
  // - Test form submission via Enter key
});
```

### Step 4.4: Create EventsPage Tests

Create `src/__tests__/EventsPage.test.tsx`:

```tsx
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

      expect(screen.getByText(/community garden/i)).toBeInTheDocument();
      expect(screen.queryByText(/game night/i)).not.toBeInTheDocument();
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

  // TODO: Add at least 1 more test
  // Ideas:
  // - Verify success message has aria-live or role="status"
  // - Test the registration flow end-to-end
});
```

✅ **Checkpoint:** Run `npm test` — all tests should pass against your fixed components. If a test fails, it likely means an accessibility fix is incomplete.

🤔 **Reflection Question:** Notice how every test uses `getByRole`, `getByLabelText`, or other semantic queries — never `getByTestId` or DOM class selectors. How does this testing approach naturally enforce accessibility? What would happen if a future developer changed a `<button>` back to a `<div>`?

---

## Deliverables

Your submission should include:

```
lab-8-accessibility-audit-YOURUSERNAME/
├── src/
│   ├── components/
│   │   ├── EventCard.tsx          (fixed version)
│   │   ├── EventFilter.tsx        (fixed version)
│   │   ├── RegistrationForm.tsx   (fixed version)
│   │   └── EventsPage.tsx         (fixed version)
│   ├── data/
│   │   └── events.ts
│   ├── __tests__/
│   │   ├── EventCard.test.tsx
│   │   ├── EventFilter.test.tsx
│   │   ├── RegistrationForm.test.tsx
│   │   └── EventsPage.test.tsx
│   ├── AUDIT_REPORT.md
│   └── setupTests.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md (your reflection)
```

### `AUDIT_REPORT.md` Requirements

Your audit report must include:
- At least **12 documented findings**
- Each finding classified by WCAG criterion, conformance level, and POUR principle
- A description of the issue, who it affects, and what you did to fix it

### `README.md` Requirements

Your `README.md` must include:

1. **Your Name and Date**

2. **Reflection Section** (minimum 200 words) answering:
   - What was the most surprising accessibility issue you found? Why?
   - How does the POUR framework help organize accessibility work?
   - Describe how Testing Library's query hierarchy (`getByRole` > `getByLabelText` > `getByText`) naturally promotes accessible markup.

3. **Key Concepts** section listing 3–5 concepts you learned

### Requirements Summary

- [ ] Minimum **20 passing tests**
- [ ] Minimum **90% code coverage**
- [ ] All TODOs completed (additional tests in each test file)
- [ ] All 4 components fixed (no remaining accessibility issues from original)
- [ ] AUDIT_REPORT.md with at least 12 findings
- [ ] README.md with reflection and key concepts
- [ ] TypeScript compiles without errors

---

## Grading Rubric

| Criteria | Points |
|----------|--------|
| Accessibility fixes correct (all 4 components properly fixed) | 30 |
| Audit report complete (12+ findings, properly classified by POUR/WCAG) | 20 |
| Tests pass with proper accessibility queries | 20 |
| Student-added tests complete (all TODOs + edge cases) | 10 |
| README complete with reflection (200+ words) and key concepts | 10 |
| Code quality (90%+ coverage, clean code, proper TypeScript) | 10 |
| **Total** | **100** |

---

## Stretch Goals

If you finish early, try these challenges:

1. **Run axe DevTools on a Live Page**: Set up a simple dev server (e.g., with Vite), render the fixed page, and run the axe browser extension. Compare automated findings against your manual audit.

2. **Add Skip Navigation**: Implement a "Skip to main content" link that appears on keyboard focus, following the [WebAIM skip navigation guide](https://webaim.org/techniques/skipnav/).

3. **Focus Management in the Modal**: When the registration modal opens, move focus to the heading. When it closes, return focus to the button that triggered it. Trap Tab/Shift+Tab inside the modal while it's open.

4. **Add Automated axe Testing**: Install `vitest-axe` and add automated accessibility checks in your test files:
   ```bash
   npm install -D vitest-axe
   ```
   ```tsx
   import { axe, toHaveNoViolations } from 'vitest-axe';
   expect.extend(toHaveNoViolations);
   
   it('has no accessibility violations', async () => {
     const { container } = render(<EventCard event={event} onRegister={vi.fn()} />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

---

## Troubleshooting

### `"Cannot find module '@testing-library/react'"`

```bash
npm install -D @testing-library/react @testing-library/jest-dom
```

### Tests fail with `"Found multiple elements"` errors

Make sure your components don't accidentally duplicate elements. Check that you're using specific queries (e.g., `getByRole('button', { name: /submit/i })` rather than just `getByRole('button')`).

### Coverage not meeting threshold

Run `npm run test:coverage` and check `coverage/index.html` in your browser. Common uncovered paths:
- Error handling branches in RegistrationForm
- The "event is full" path in EventCard
- The "no events found" empty state in EventsPage

### TypeScript errors after fixing components

- Make sure `<form>` has `onSubmit` with `e.preventDefault()`
- Button `disabled` attribute expects a boolean, not a string
- `aria-pressed` expects `"true"` or `"false"` as strings, not booleans

---

## Submission

1. Push your code to your GitHub repository
2. Verify GitHub Actions passes all checks
3. Submit your repository URL via Canvas

**Due:** Monday, February 16, 2026 at 11:59 PM

---

## Resources

- 🔗 [WebAIM Introduction to Web Accessibility](https://webaim.org/intro/)
- 🔗 [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
- 🔗 [MDN ARIA Roles Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- 🔗 [Testing Library Query Priority](https://testing-library.com/docs/queries/about#priority)
- 🔗 [axe DevTools (Chrome Extension)](https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd)
- 🔗 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

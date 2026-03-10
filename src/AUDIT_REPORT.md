# Accessibility Audit Report

**Auditor:** Vlad Kolesnik
**Date:** 3/9/2026
**Application:** Community Events Page

## Summary

Total issues found: 12
- Critical (Level A): 9
- Major (Level AA): 3
- Minor (Level AAA / Best Practice): 0

## Findings

### Finding 1: Event image missing alternative text

- **Component:** EventCard.tsx
- **WCAG Criterion:** 1.1.1 Non-text Content
- **Level:** A
- **POUR Principle:** Perceivable
- **Description:** Event image had no alt attribute
- **Impact:** Screen reader users receive no image context
- **Fix:** Added descriptive alt text

### Finding 2: Event title used <b> instead of heading
- **Component:** EventCard.tsx
- **WCAG Criterion:** 1.3.1 Info and Relationships
- **Level:** A
- **POUR Principle:** Robust
- **Description:** Title styling used non-semantic <b>
- **Impact:** Screen readers could not use heading navigation correctly
- **Fix:** I replaced the b tag with an h3 heading

### Finding 3: Low contrast date/time text
- **Component:** EventCard.tsx
- **WCAG Criterion:** 1.4.3 Contrast
- **Level:** AA
- **POUR Principle:** Perceivable
- **Description:** Light gray text failed contrast on white
- **Impact:** Low-vision users struggle to read metadata
- **Fix:** Changed to darker text color with sufficient contrast

### Finding 4: Location originally relied on color cue
- **Component:** EventCard.tsx
- **WCAG Criterion:** 1.4.1 Use of Color
- **Level:** A
- **POUR Principle:** Perceivable
- **Description:** Blue color alone implied location meaning
- **Impact:** Color-blind users may miss contextual cue
- **Fix:** Added explicit “Location:" text

### Finding 5: Availability communicated by color
- **Component:** EventCard.tsx
- **WCAG Criterion:** 1.4.1 Use of Color
- **Level:** A
- **POUR Principle:** Perceivable
- **Description:** Red/green color state used for availability
- **Impact:** Users with color vision issues may not understand status 
- **Fix:** I added status text, like Status: Full and Spots remaining

### Finding 6: Register action used non-semantic clickable <div>
- **Component:** EventCard.tsx
- **WCAG Criterion:** 2.1.1 Keyboard 
- **Level:** A
- **POUR Principle:** Operable & Robust
- **Description:** Clickable <div> lacked keyboard behavior
- **Impact:** Keyboard-only and assistive tech users lose reliable interaction
- **Fix:** Replaced with <button type="button">

### Finding 7: Filter options used clickable <div> elements
- **Component:** EventFilter.tsx
- **WCAG Criterion:** 2.1.1 Keyboard
- **Level:** A
- **POUR Principle:** Operable & Robust
- **Description:** Filter chips were not semantic controls
- **Impact:** Inconsistent keyboard 
- **Fix:** I changed filter options to buttons

### Finding 8: Filter group missing label and state info
- **Component:** EventFilter.tsx
- **WCAG Criterion:** 1.3.1 Info and Relationships 
- **Level:** A
- **POUR Principle:** Understandable and Robust
- **Description:** Filter controls needed clear group labeling and selected state
- **Impact:** Screen reader users lack context 
- **Fix:** I used fieldset and legend and added aria-pressed on filter buttons.

### Finding 9: Form fields needed real visible labels
- **Component:** RegistrationForm.tsx
- **WCAG Criterion:** 1.3.1 Info and Relationships and 3.3.2 Labels or Instructions
- **Level:** A
- **POUR Principle:** Understandable
- **Description:** Inputs had placeholders but no visible label
- **Impact:** Labels can disappear and make forms harder to understand
- **Fix:** I added visible Name and Email labels tied to inputs

### Finding 10: Form errors needed screen reader support
- **Component:** RegistrationForm.tsx
- **WCAG Criterion:** 3.3.1 Error Identification and 4.1.3 Status Messages
- **Level:** A
- **POUR Principle:** Understandable and Robust
- **Description:** Errors needed connection to fields and alert roles
- **Impact:** Users may miss validation messages or not know which field failed
- **Fix:** I added aria-invalid, aria-describedby, and role=alert for errors

### Finding 11: Modal needed dialog semantics
- **Component:** RegistrationForm.tsx
- **WCAG Criterion:** 4.1.2 Name, Role, Value
- **Level:** A
- **POUR Principle:** Robust
- **Description:** Modal needs clear role and labeling for assistive tech
- **Impact:** Screen readers may not identify it as a modal dialog
- **Fix:** I added role=dialog, aria-modal=true, and aria-labelledby

### Finding 12: Page structure and status messaging needed semantics
- **Component:** EventsPage.tsx
- **WCAG Criterion:** 1.3.1 Info and Relationships
- **Level:** A
- **POUR Principle:** Robust and Understandable
- **Description:** No <main> landmark and success message not announced
- **Impact:** Landmark navigation and feedback announcement are reduced
- **Fix:** Switched to <main> & added role="status" and aria-live="polite" on success

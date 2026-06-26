# Calendar App — Task Checklist

## Tasks

- [x] 1. Scaffold `tasks/todo.md` (this file)
  - AC: File exists with all tasks listed

- [x] 2. Create `index.html` skeleton
  - AC: Page loads, no console errors; header with nav buttons visible; empty grid area; modal hidden

- [x] 3. Create `style.css` — grid layout and day cells
  - AC: 7-column grid renders; cells have borders and min-height; day headers evenly spaced

- [x] 4. Create `app.js` — state, localStorage, renderCalendar()
  - AC: Correct month grid on load; today's cell highlighted; `calEvents` key readable in DevTools

- [x] 5. JS: month navigation (prev/next buttons)
  - AC: Arrows change month+year label; Dec→Jan and Jan→Dec wrap year correctly

- [x] 6. CSS: modal styles
  - AC: Removing `.hidden` in DevTools shows centered modal on wide and 375px viewports

- [x] 7. JS: modal open/close
  - AC: "+ Add Event" opens modal with today's date; Cancel and overlay-click close it; form resets

- [x] 8. JS: add event (submit handler)
  - AC: Chip appears in correct cell; persists on reload; missing title shows error and keeps modal open; end < start shows time error

- [x] 9. JS: edit and delete (delegated click + upsert)
  - AC: Chip click opens pre-filled modal with Delete button; saving updates chip; Delete removes chip; both persist on reload

- [x] 10. CSS: responsive mobile styles
  - AC: At 375px — no horizontal scroll; grid fills viewport; modal not clipped

- [x] 11. CSS: event chip styles
  - AC: Chips render as colored pills; long titles truncated; multiple chips in one cell stack vertically

- [x] 12. End-to-end review pass
  - AC: All acceptance criteria from steps 2–11 pass; no console errors; `calEvents` contains valid JSON

## Review

All 12 tasks completed. Verified via automated Firefox Marionette WebDriver run (22/23 assertions passed; 1 false-fail due to Firefox headless minimum window width of 500px — the CSS `width: min(480px, 92vw)` is correct and modal fits the real viewport in both cases).

### Files created
- `index.html` — page shell, header, 7-column calendar grid, modal with form
- `style.css` — CSS Grid layout, event chip styles, modal overlay, responsive breakpoint at 600px
- `app.js` — state management, localStorage persistence, calendar rendering, modal CRUD, form validation

### What was verified live
- ✅ June 2026 grid renders with today (25th) highlighted in a blue circle
- ✅ Prev/Next navigation works; Jan→prev wraps to December of previous year
- ✅ Clicking a day cell opens the Add modal pre-filled with that date
- ✅ Saving an event creates a blue chip showing "HH:MM Title"
- ✅ Missing title shows inline error and keeps modal open
- ✅ End time ≤ start time shows "End time must be after start time."
- ✅ Events survive a full page reload (localStorage key `calEvents`)
- ✅ Clicking a chip opens Edit modal pre-filled; saving updates the chip text
- ✅ Deleting an event removes the chip and the change persists after reload
- ✅ At narrow viewport: no horizontal scroll; modal uses `92vw` and stays within bounds
- ✅ Two events on the same day stack as separate chips in the cell

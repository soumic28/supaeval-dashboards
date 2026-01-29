# Keyboard Shortcuts Test Page

This is a simple test to verify keyboard shortcuts work correctly.

## Test Instructions:

1. Make sure you're NOT in any input field
2. Try these shortcuts:

### Test 1: Press 'N'

- Expected: Console log "N pressed"
- Should navigate to /evaluations/new

### Test 2: Press 'R'

- Expected: Console log "R pressed"
- Should refresh the page

### Test 3: Press Shift + '/' (which types '?')

- Expected: Console log "? pressed"
- Should show keyboard shortcuts help dialog

### Test 4: Type in this input field and press 'N':

<input type="text" placeholder="Type 'N' here - should NOT trigger shortcut" />

- Expected: Letter 'n' appears in input, NO navigation

---

## Debug Console

Open browser DevTools (F12) and watch the Console tab for the log messages.

If shortcuts still don't work, check:

1. Are console logs appearing?
2. Are there any JavaScript errors?
3. Is the event listener attached?

You can test in console:

```javascript
// Check if shortcuts are registered
console.log("Shortcuts hook loaded");
```

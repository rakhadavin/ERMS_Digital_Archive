# Feature Spec — AI Keyword Suggestion

## Purpose

Provide real-time keyword suggestions while the user is typing in the homepage search bar. Helps users discover the correct classification terms without needing to know the vocabulary structure — including informal, slang, or ambiguous terms.

---

## Route

Triggered from the search bar on:

```
/ (Home / Dashboard)
```

---

## How It Works

### Core Flow (Hybrid: Fuzzy + LLM)

```
User types in search bar (min. 2 characters)
   ↓
Level 1: Fuzzy match against cached vocabulary
   ↓
Strong match found? → show suggestions instantly
   ↓
Weak or no match? → trigger LLM call
   ↓
LLM returns synonym/intent-based suggestions
   ↓
Suggestions shown with "AI suggested" badge
   ↓
User selects suggestion → search executes
```

---

## Two-Level Architecture

### Level 1 — Fuzzy Match (Always runs first)

- Matches user input against cached category vocabulary
- Instant, no API cost, no delay
- Handles: known terms, partial codes, abbreviations

### Level 2 — LLM Suggestion (Fallback)

- Triggered only when Level 1 returns weak or no results
- LLM receives: user input + full category vocabulary list
- LLM returns: best matching category codes with reasoning
- Handles: slang, synonyms, informal Bahasa Indonesia, ambiguous terms

### LLM Prompt (Level 2)

```
You are an archive classification assistant.
Given a user's search input, suggest the most relevant 
categories from the vocabulary below.

Vocabulary:
[injected list of code_MC, name_MC, code_SC, name_SC]

User input: "{user_input}"

Return ONLY a JSON array, max 3 items:
[
  { "code": "KU", "name": "Keuangan", "type": "MC", "reason": "duit = uang = keuangan" },
  ...
]
```

---

## Matching Source

Suggestions are matched against:

- `name_MC` — Main category names
- `name_SC` — Sub-category names
- `code_MC` — Main category codes
- `code_SC` — Sub-category codes

---

## Suggestion Output Format

Each suggestion item shows:

```
[Badge] Suggestion Label    (code)
```

Badge types:
- `Kategori Utama` — from name_MC match
- `Sub-Kategori` — from name_SC match
- `✨ AI` — from LLM suggestion (Level 2)

### Example — Level 1 (Fuzzy)
```
User types: "keuan"
   ↓
┌──────────────────────────────────────────┐
│ [Kategori Utama] Keuangan          (KU)  │
│ [Sub-Kategori]   Keuangan Rutin  (KU.01) │
│ [Sub-Kategori]   Keuangan Negara (KU.02) │
└──────────────────────────────────────────┘
```

### Example — Level 2 (LLM)
```
User types: "duit negara"
   ↓ Level 1: no match
   ↓ Level 2: LLM triggered
┌──────────────────────────────────────────┐
│ [✨ AI] Keuangan                    (KU) │
│ [✨ AI] Keuangan Negara           (KU.02)│
└──────────────────────────────────────────┘
```

---

## Suggestion Rules

| Rule | Detail |
|---|---|
| Minimum trigger | 2 characters typed |
| Max suggestions shown | 6 items (Level 1) / 3 items (Level 2) |
| Level 1 match type | Fuzzy / contains match (case insensitive) |
| Level 1 priority | Exact → starts-with → contains |
| Level 2 trigger condition | Level 1 returns 0 or 1 weak results |
| Debounce | 300ms after user stops typing |
| LLM call debounce | Additional 500ms (to avoid excessive API calls) |
| Main category priority | Show name_MC matches above name_SC |

---

## UI Behavior

- Dropdown appears below search bar while typing
- Each item shows: badge (Utama / Sub / ✨ AI), name, code
- Level 2 suggestions visually distinct (AI badge, subtle different styling)
- Loading indicator shown only during LLM call (Level 2)
- Keyboard navigable (arrow keys + enter)
- Click or enter on suggestion → executes search with that term
- Dropdown closes on: selection, click outside, Escape key

---

## Data Source

Category vocabulary is loaded once on page load and cached client-side.

```
On page load:
GET /api/categories/vocabulary
→ returns flat list of { code_MC, name_MC, code_SC, name_SC }
→ cached in memory for Level 1 matching
→ also injected into LLM prompt for Level 2
```

---

## Example Scenarios

### Known Term (Level 1)
```
User types: "hukum"
Suggests: [Kategori Utama] Hukum (HK), [Sub-Kategori] Hukum dan Perundangan (HK.01)
```

### Partial / Abbreviated (Level 1)
```
User types: "ku"
Suggests: [Kategori Utama] Keuangan (KU), [Sub-Kategori] Keuangan Rutin (KU.01)...
```

### Code Input (Level 1)
```
User types: "KU.0"
Suggests: KU.01, KU.02, KU.03...
```

### Slang / Informal (Level 2 — LLM)
```
User types: "duit"
Level 1: no match
Level 2: [✨ AI] Keuangan (KU), [✨ AI] Keuangan Rutin (KU.01)
```

### Synonym (Level 2 — LLM)
```
User types: "anggaran negara"
Level 1: no match
Level 2: [✨ AI] Keuangan Negara (KU.02)
```

### Completely Unknown (Both fail)
```
User types: "xyz"
Dropdown: "Tidak ada saran. Coba kata lain atau gunakan chatbot."
```

---

## Relationship to Chatbot Feature

| | AI Suggestion | Chatbot |
|---|---|---|
| When triggered | While typing | After submitting |
| Interaction | Passive, instant | Active, conversational |
| User state | Still thinking | Ready to search |
| Output | Suggested keywords | Full document results |
| LLM involved | Level 2 fallback only | Yes, always |
| Graceful degradation | Redirect to chatbot | Built-in |

Both features work together. When suggestion fails completely, the fallback message guides user to the chatbot.

---

## Scope Boundary

- Keyword/category suggestions only
- No document title suggestions (future enhancement)
- LLM only called as fallback, not on every keystroke
- Expert/user always selects and validates the suggestion

---

## Future Enhancement (Out of Scope for Now)

- Document title suggestions from METADATA table
- Personalized suggestions based on user search history
- Suggestion analytics (track which suggestions users select)

# Feature Spec — Archive Retrieval Chatbot

## Purpose

Allow users to find documents using natural language queries instead of manually setting filters. The chatbot acts as a conversational bridge between informal user language and the structured metadata system.

---

## Route

Accessible from any page as a floating widget or sidebar panel.

---

## How It Works

### Core Flow

```
User types natural query
   ↓
LLM extracts structured filters (JSON)
   ↓
Backend runs SQL query on METADATA table
   ↓
Chatbot displays matched documents conversationally
```

### LLM Role

The LLM does **one job only** — translate natural language into a structured filter JSON. It does not access the database directly.

### System Prompt Content

The system prompt must include:

- METADATA schema field names and descriptions
- Full category vocabulary (code_MC, name_MC, code_SC, name_SC)
- Current date (for retention-related queries)
- Instruction to return ONLY a JSON object

### Filter Schema Output

```json
{
  "code_MC": "KU",
  "code_SC": null,
  "unit_pengolah": "pengadaan",
  "year": 2022,
  "sifat_dokumen": null,
  "retention_soon": false
}
```

---

## Graceful Degradation Pattern

The chatbot must never return a dead end. Follow this priority chain:

| Situation | Chatbot Response |
|---|---|
| Exact match found | Return results directly |
| Partial / best guess match | Return results with explanation: "Menampilkan hasil untuk Keuangan (KU), apakah ini yang kamu cari?" |
| Ambiguous input | Ask clarification: "Maksud kamu dokumen Keuangan atau Anggaran (APBN)?" |
| Completely unknown | Honest fallback: "Tidak ditemukan. Coba kata lain atau gunakan filter manual." |

---

## Example Interactions

### Normal Query
```
User: "cari dokumen keuangan 2022 dari unit pengadaan"
Bot:  Ditemukan 5 dokumen. [list of results]
```

### Slang / Informal
```
User: "duit negara"
Bot:  Tidak ditemukan kategori "duit negara" secara langsung.
      Menampilkan hasil untuk Keuangan (KU). Apakah ini yang kamu cari?
```

### Retention Query
```
User: "dokumen yang mau habis bulan depan"
Bot:  Ditemukan 3 dokumen dengan retensi dalam 6 bulan ke depan. [list]
```

### Ambiguous Query
```
User: "surat penting"
Bot:  Apakah maksud kamu dokumen dengan sifat Rahasia atau Terbatas?
```

---

## Mappable Fields

| User says | Maps to field |
|---|---|
| "keuangan", "duit", "anggaran" | code_MC |
| "unit pengadaan", "bagian SDM" | unit_pengolah |
| "2022", "tahun lalu" | year (tanggal_dokumen) |
| "rahasia", "terbatas", "biasa" | sifat_dokumen |
| "mau expired", "hampir habis" | tahun_retensi within 6 months |
| "KU.01", "HK.02" | code_SC |

---

## UI Behavior

- Floating chat button accessible from all pages
- Chat panel slides in from right side
- Message input at bottom
- Results displayed as document cards inside chat (title, nomor_dokumen, tanggal, category)
- Each result card is clickable → opens document detail
- Conversation history preserved within session

---

## Maintenance Note

When new categories are added to the vocabulary, the system prompt must be updated to reflect the new codes and names. This is the only sync required between the AI layer and the database.

---

## Scope Boundary

- Metadata-only retrieval (no document content search)
- No vector database or semantic embedding required
- LLM used only as natural language → filter translator
- Expert/user always sees and validates results

---

## Future Enhancement (Out of Scope for Now)

- Document content search (semantic search with vector DB)
- Multi-turn memory across sessions
- Personalized suggestions based on user history

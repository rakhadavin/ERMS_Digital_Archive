import { mockKategoriUtama, mockSubKategori } from '../data/mockKategori'

// ─── Synonym map for Level 2 (simulated LLM) ─────────────────────────────────
// Maps informal / slang / synonym input → category codes

const SYNONYM_MAP = [
  { keywords: ['duit', 'uang', 'finansial', 'keuangan moneter'], codes: ['MR'] },
  { keywords: ['bunga', 'suku bunga', 'inflasi', 'rate', 'bi rate'], codes: ['MR.01.01.01'] },
  { keywords: ['riset', 'penelitian', 'analisis', 'paper', 'studi'], codes: ['MR.01.02', 'MR.01.02.01', 'MR.01.02.05'] },
  { keywords: ['pidato', 'speech', 'pernyataan', 'gubernur', 'siaran pers'], codes: ['MR.01.03', 'MR.01.03.02'] },
  { keywords: ['devisa', 'dollar', 'valas', 'forex', 'dolar', 'cadangan'], codes: ['MR.03', 'MR.03.01.01'] },
  { keywords: ['instrumen', 'operasi pasar', 'opt', 'sbi', 'sbdk'], codes: ['MR.02.02', 'MR.02.02.01'] },
  { keywords: ['bank', 'perbankan', 'sistemik', 'too big to fail'], codes: ['MP.01.02.06'] },
  { keywords: ['krisis', 'darurat', 'emergency', 'protokol'], codes: ['MP.01.06', 'MP.01.06.01'] },
  { keywords: ['stabilitas', 'asesmen', 'assessment', 'fsap', 'ssk'], codes: ['MP.01.02', 'MP.01.02.01'] },
  { keywords: ['makro', 'makroprudensial', 'prudensial', 'ltv', 'dsr'], codes: ['MP', 'MP.01.01.01'] },
  { keywords: ['surveillance', 'monitoring', 'pengawasan sistem keuangan'], codes: ['MP.02', 'MP.02.01.01'] },
]

// ─── Vocabulary flat list (cached once) ──────────────────────────────────────

function buildVocab() {
  const mc = mockKategoriUtama.map((c) => ({
    code: c.code_MC,
    name: c.name_MC,
    type: 'MC',
  }))
  const sc = mockSubKategori.map((c) => ({
    code: c.code_SC,
    name: c.name_SC,
    type: 'SC',
  }))
  return [...mc, ...sc]
}

const VOCAB = buildVocab()

// ─── Level 1: Fuzzy match ─────────────────────────────────────────────────────

function score(item, q) {
  const name = item.name.toLowerCase()
  const code = item.code.toLowerCase()
  if (name === q || code === q) return 3
  if (name.startsWith(q) || code.startsWith(q)) return 2
  if (name.includes(q) || code.includes(q)) return 1
  return 0
}

export function fuzzyMatch(input, max = 6) {
  if (!input || input.trim().length < 2) return []
  const q = input.trim().toLowerCase()

  return VOCAB
    .map((item) => ({ ...item, _score: score(item, q) }))
    .filter((item) => item._score > 0)
    .sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score
      if (a.type === 'MC' && b.type !== 'MC') return -1
      if (b.type === 'MC' && a.type !== 'MC') return 1
      return 0
    })
    .slice(0, max)
    .map(({ _score, ...item }) => item)
}

// ─── Level 2: Simulated LLM (synonym map + fake delay) ───────────────────────

function resolveAI(input) {
  const q = input.trim().toLowerCase()

  const matched = new Set()
  for (const entry of SYNONYM_MAP) {
    if (entry.keywords.some((kw) => q.includes(kw) || kw.includes(q))) {
      entry.codes.forEach((c) => matched.add(c))
    }
  }

  return [...matched]
    .map((code) => VOCAB.find((v) => v.code === code))
    .filter(Boolean)
    .slice(0, 3)
    .map((item) => ({ ...item, type: 'AI' }))
}

export function simulateLLM(input) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(resolveAI(input)), 850)
  })
}

// ─── Main entry: returns { level1, triggerLLM } ───────────────────────────────

export function getSuggestions(input) {
  const level1 = fuzzyMatch(input)
  const triggerLLM = level1.length < 2
  return { level1, triggerLLM }
}

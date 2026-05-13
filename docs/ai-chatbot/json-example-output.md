# THIS LAYER IS NOT IN THE PROMPT
After LLM returns the filter JSON, your backend runs:

SELECT m.*, mc.name_MC, sc.name_SC
FROM METADATA m
JOIN MAIN_CATEGORY mc ON m.code_MC = mc.code_MC
JOIN SUB_CATEGORIES sc ON m.code_SC = sc.code_SC
WHERE
  (m.code_MC = :code_MC        OR :code_MC IS NULL)
  AND (m.code_SC = :code_SC    OR :code_SC IS NULL)
  AND (m.unit_pengolah ILIKE   :unit_pengolah OR :unit_pengolah IS NULL)
  AND (YEAR(m.tanggal_dokumen) = :year OR :year IS NULL)
  AND (m.sifat_dokumen = :sifat OR :sifat IS NULL)
  AND (
    :retention_soon IS NULL OR
    (m.tahun_retensi - YEAR(NOW()) <= 0.5)
  )

Results are returned to the chatbot UI as document cards.
# CATEGORY VOCABULARY (fetched from /api/categories/vocabulary)
Use this to map user terms to correct codes.

Main Categories:
- KU  : Keuangan
- HK  : Hukum dan Perundangan
- UM  : Umum dan Administrasi
- KP  : Kepegawaian
- ... (all from DB)

Sub-Categories:
- KU.01 : Keuangan Rutin          (retention: 5 years)
- KU.02 : Keuangan Negara / APBN  (retention: 10 years)
- HK.01 : Peraturan dan Perundangan (retention: permanent)
- HK.02 : Perjanjian dan Kontrak   (retention: 7 years)
- UM.01 : Surat Masuk              (retention: 3 years)
- ... (all from DB)

# CURRENT DATE (injected at runtime)
Today is: {{ CURRENT_DATE }}
Use this to evaluate retention_soon queries like
"hampir expired" or "mau habis bulan depan".
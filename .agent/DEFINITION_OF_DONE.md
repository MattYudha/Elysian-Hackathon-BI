# Definition of Done - Elysian Rebirth

Strict Verification Checklist sebelum menyebut task selesai:

1. **JANGAN PERNAH** melaporkan task selesai kepada USER sebelum Anda memverifikasi tidak ada error ketat pada kode yang baru Anda modifikasi. Anda **WAJIB** mengecek output dari compiler/linter.
2. Jika Anda memiliki akses untuk menjalankan script pada shell lokal, Anda **WAJIB** memberikan output dari `npm run typecheck` dan `npm run lint` secara lokal pada file yang diubah.
3. **PENCEGAHAN INFINITE LOOP**: Jika Anda terjebak dalam masalah lint/type errors pada file yang sama lebih dari 3 kali percobaan perbaikan (terutama yang berkaitan dengan _useCallback_, _Server Component_, atau _Dependency Array_), segera BERHENTI dan minta bantuan review manual dari pengembang manusia.
4. Pre-commit code harus siap untuk lolos verifikasi dari script `.husky/pre-commit` tanpa perlu `--no-verify`.

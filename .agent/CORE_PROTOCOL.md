# Core AI Protocol - Elysian Rebirth

Gabungan arsitektur, state management, dan security yang sangat ketat (Biner: Benar/Salah).

## Arsitektur & State

- **JANGAN PERNAH** simpan data server di Zustand. Zustand HANYA untuk UI state (seperti sidebar config, active theme).
- Data server **WAJIB** menggunakan TanStack Query (`useQuery`, `useMutation`).

## Security & Multi-tenancy

- Setiap kali membuat/mengedit API service di `src/services/`, **WAJIB** menyertakan header `x-tenant-id` dari `TenantContext.tsx`.
- Jika tidak ada header `x-tenant-id`, kode dianggap **GAGAL**.

## Middleware/Auth

- Setiap fitur baru **WAJIB** mendaftarkan Permission Key di `src/types/admin.ts`.
- Setiap rute/komponen admin/protected **WAJIB** di-wrap dengan `AdminGuard`.

## Source of Truth

- TypeScript strict (termasuk return type dan parameter type).
- `.eslintrc.cjs` dan `.prettierrc` adalah aturan absolut. Jangan melanggarnya.
- Zod schema di `src/lib/schemas/` adalah kebenaran mutlak. Jangan buat asumsi validasi baru jika sudah ada.

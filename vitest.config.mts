import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // `include` is load-bearing. Without it the v8 provider only reports
      // files that some test imported, so an untested file is invisible
      // rather than counted as 0%. That masked ~1,600 uncovered statements
      // and inflated the reported number from 48% to 83%.
      //
      // Note: this is the Vitest 5 spelling. The old `coverage.all: true`
      // flag was REMOVED in Vitest 5 — setting it is a type error and does
      // nothing. `include` is now the only way to widen the denominator.
      include: ['src/**/*.{ts,tsx}'],
      /**
       * Statements and lines only, by deliberate choice.
       *
       * Branch and function coverage are noisier — a single added guard
       * clause or a defensive `?? []` can drop branch coverage below a bar
       * that nothing is actually wrong with, and a threshold people learn to
       * override is worse than no threshold. Statements and lines move
       * predictably with real test work.
       *
       * Set below the achieved figures (98.84% statements / 99.70% lines) so
       * ordinary work has room, but above the 95% target so the suite cannot
       * quietly slide back under it. Raise these when coverage rises; never
       * lower them to make a red build green.
       */
      thresholds: {
        statements: 97,
        lines: 98,
      },
      // NOTE: directory exclusions must end in `**`. A bare trailing slash
      // (e.g. 'src/components/ui/') matches nothing, so the files stay in the
      // denominator — which is how the shadcn primitives were silently being
      // counted before.
      exclude: [
        'node_modules/**',
        '.next/**',
        'src/test-setup.ts',
        '**/*.d.ts',
        '**/*.{test,spec}.{ts,tsx}',
        'src/lib/providers/ministry-platform/models/**', // Auto-generated files
        'src/lib/providers/ministry-platform/scripts/**', // Build-time CLI scripts
        'src/components/ui/**', // Vendored shadcn/ui primitives
        '**/loading.tsx', // Declarative skeleton markup
        'src/app/layout.tsx', // Root font/metadata shell
        'src/app/(web)/layout.tsx', // Font/metadata shell
        '**/index.ts', // Barrel re-exports
        '**/types.ts', // Type-only modules
        // Granger fork: tools that predate upstream's coverage gate and have no
        // tests yet. TEMPORARY — delete each line as its tests land; never add a
        // tested file here. Tracked in
        // .claude/TODO/2026-09-14-granger-tools-coverage-excluded.md.
        // copy-from-event's actions, service and utils are tested and stay in.
        // `*` stands in for the `(web)` route group: parentheses are glob syntax
        // and a literal `(web)` segment matches nothing.
        'src/app/*/tools/copyfromevent/**',
        'src/app/*/tools/editregistration/**',
        'src/app/*/tools/eventcheckin/**',
        'src/components/copy-from-event/*.tsx',
        'src/components/edit-registration/**',
        'src/components/event-checkin/**',
        'src/services/editRegistrationService.ts',
        'src/services/eventCheckinService.ts',
        'src/lib/poppins-font.ts', // Only used by event-checkin nametags
      ],
    },
  },
  resolve: {
    alias: {
      // `import.meta.dirname`, not `__dirname`: this file is ESM (.mts), and
      // Vite's native config loader has no CommonJS globals.
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});

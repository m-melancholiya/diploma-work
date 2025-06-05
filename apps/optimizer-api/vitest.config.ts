// apps/optimizer-api/vitest.config.ts
import { defineConfig } from 'vitest/config'
import * as path from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@libs/shared': path.resolve(__dirname, '../../libs/shared'),
        },
    },
    test: {
        environment: 'node',
        globals:      true,
        include: [
            'src/routes/**/*.spec.ts',
        ],
        exclude: [
            'node_modules',
            'dist',
        ],
    },
})

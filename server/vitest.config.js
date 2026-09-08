import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        env: {
            NODE_ENV: 'test',
        },
        setupFiles: './test/setup.js',
        exclude: ['node_modules', 'dist', 'build'],

        fileParallelism: false,

        coverage: {
            provider: 'v8', // fastest
            reporter: ['text', 'html', 'json'],
            reportsDirectory: './coverage',

            include: ['src/**/*.js'], // what to measure
            exclude: [
                'node_modules/',
                'test/',
                '**/*.test.js',
                '**/index.js', // optional
            ],

            lines: 80,
            functions: 80,
            branches: 70,
            statements: 80,
        },
    },
})

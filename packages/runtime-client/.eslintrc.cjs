module.exports = {
    root: true,
    extends: [require.resolve('@superadmin/eslint/vue')],
    parserOptions: {
        project: [
            `${__dirname}/tsconfig.json`,
            // TS config for tests
            `${__dirname}/tsconfig.tests.json`,
        ],
    },
};

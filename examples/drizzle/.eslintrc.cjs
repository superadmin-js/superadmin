module.exports = {
    root: true,
    extends: [require.resolve('@nzyme/eslint/vue')],
    parserOptions: {
        project: [`${__dirname}/tsconfig.json`],
    },
};

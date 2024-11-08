module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [require.resolve('@superadmin/eslint/typescript')],
    parserOptions: {
        project: `${__dirname}/tsconfig.json`,
    },
};

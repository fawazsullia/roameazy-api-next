module.exports = {
    '*.{js,ts,tsx,jsx}': [
        'eslint --fix',
        'prettier --write',
        //'jest --findRelatedTests'
    ],
    '*.{md,css,sass,yml,yaml,scss,json,html}': [
        'prettier --write'
    ]
}
module.exports = {
    parser: 'postcss-scss',
    plugins: [
        require('autoprefixer')({
            'browsers': ['> 1%', 'last 2 versions']
        })
    ]
};
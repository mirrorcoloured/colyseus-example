const path = require('path');

module.exports = {
    // Entry file is the starting point for your application
    entry: path.resolve(__dirname, 'src/static/towel_page.js'),
    
    // Output defines where the bundled JavaScript will be placed
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    
    // Module rules define how various file types are processed
    module: {
        rules: [
        {
            test: /\.tsx?$/,       // Matches .ts and .tsx files
            use: 'ts-loader',      // Use ts-loader for transpiling TypeScript
            exclude: /node_modules/,
        },
        // If you have CSS, you can use css-loader and style-loader
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        // Add rules for other file types (images, etc.) as needed
        ],
    },
    
    // Resolve extensions for TypeScript and JavaScript
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    // Specify the mode - development or production
    mode: 'development', // or 'production'

    // Optional: Configure a dev server for development
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
};
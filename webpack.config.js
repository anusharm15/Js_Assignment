var webpack = require('webpack');
const path = require('path')

module.exports = {
	entry: ['./src/script.js'],
	output: {
		path: path.resolve(__dirname, 'dist'),
    	publicPath: '/dist/',
    	filename: 'bundle.js'
	},
	devtool: 'sourcemap',
	module: {
		rules: [
			{
			  test: /\.js?/, 
			  loader: 'babel-loader', 
			  exclude: /node_modules/,
			  query: {
			  	presets: ['env']
			  }
			},
			{
	          test: /\.scss$/,
	          exclude: /node_modules/,
	          use: [
	              "style-loader",
	              "css-loader",
	              "sass-loader"
	          ]
	      },
	      	{
	      	test: /\.(png|jpg|gif)$/i,
	        use: [
	          {
	            loader: 'url-loader',
	            options: {
	              limit: 8192
	            }
	          }
	        ]
	    	}
		]
	}
};
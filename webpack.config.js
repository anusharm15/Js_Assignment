var webpack = require('webpack');

module.exports = {
	entry: ['./script.js','./scss/styles.scss'],
	output: {
		filename: 'bundle.js',
		publicPath: "./dist/"
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
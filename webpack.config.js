var path = require('path');
var buildPath = path.resolve('dist');

module.exports = (env) => ({
	mode: (() => {
		return env && env.production ? 'production' : 'development';
	})(),

	entry: './index.ts',
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.json'],
		symlinks: false,
		alias: {
			'fs': 'memfs',
			'readline': 'fakereadline'
        }
	},
	module: {
		rules: [
			// all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
			{ test: /\.tsx?$/, use: ['ts-loader'], exclude: /node_modules/ },
		],
	},
	performance: {
		// change the default size warnings
		maxEntrypointSize: 1.5e6,
		maxAssetSize: 1.5e6,
	},
	entry: {
		bundle: './src/index.ts',
		protocol: './src/lib/helpers/protocol.ts',
		inflate: './src/lib/helpers/worldInflate.ts',
		server: './src/lib/singleplayer/server.ts',

	},
	output: {
		filename: '[name].js',
	},
	devServer: {
		contentBase: buildPath,
		inline: true,
		host: '0.0.0.0',
		stats: 'minimal',
	},
	watchOptions: {
		aggregateTimeout: 500,
		poll: 1000,
		ignored: ['node_modules'],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				babylon: {
					chunks: 'initial',
					test: /babylonjs/,
					filename: 'babylon.js',
				},
			},
		},
	},
	plugins: [],
});

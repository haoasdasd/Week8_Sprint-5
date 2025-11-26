const path = require('path')
const dotenv = require('dotenv')

const desp = require('./package.json').dependencies
//const modeEnv = process.env.NODE_ENV
//dotenv.config({ path: path.resolve(__dirname, `.env.${modeEnv}`) })
const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
try {
  dotenv.config({ path: envPath });
  console.log(`Loaded env file: ${envPath}`);
} catch (err) {
  console.warn(`No env file found for ${process.env.NODE_ENV}, skipping...`);
}
module.exports = {
  publicPath: '/',
  moduleExposes: {},
  moduleRemotes: {},
  shared: {
    react: { singleton: true, requiredVersion: '^18.3.1' },
    "react-dom": { singleton: true, requiredVersion: '^18.3.1' },
    "react-dropzone": { singleton: true, requiredVersion: '14.3.8' },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'), 
      '@': path.resolve(__dirname, 'src') 
    },
    extensions: ['.js', '.ts', '.tsx', '.json']
  }
}

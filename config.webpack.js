const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  const envPath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
  dotenv.config({ path: envPath });
  console.log(`Loaded env file: ${envPath}`);
} else {
  console.log(`Skipping dotenv load on ${process.env.NODE_ENV}`);
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
};

let env = process.env.APP_ENV || 'development';

let config = {
  development: require('./development.config'),
  production: require('./production.config'),
  staging: require('./staging.config'),
};

export default config[env];

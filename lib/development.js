module.exports = {
  redis: {
    url: 'redis://127.0.0.1:6379'
  },
  github: {
    clientId: 'a9f50e631bc7bd2f8f7c',
    clientSecret: 'd0315b0f9dd644318c852cdf1d384f35ecb3766b',
    callbackURL: 'http://localhost:3000/auth/callback'
  },
  search: {
    language: 'javascript',
    no_of_users: 30,
    n_of_repos: 5,
    n_of_files: 5
  }
};

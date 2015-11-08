module.exports = {
  port: 8080,
  redis: {
    url: 'redis://x:1f9846ff17b44925bd0f177c401e54a2@crafty-willow-8972.redisgreen.net:11042/'
  },
  search: {
    language: 'javascript',
    no_of_users: 30,
    n_of_repos: 5,
    n_of_files: 5
  },
  github: {
    clientId: 'ad1b460b66d6a007904c',
    clientSecret: '4558e0dea2bb576a7cbc007001cae3dae3cbd52e',
    callbackURL: 'http://barcelonajs.2015.nodeknockout.com/auth/callback'
  }
};

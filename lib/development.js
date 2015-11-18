var credentials = require('../credentials');

module.exports = {
  port: 3000,
  redis: {
    url: 'redis://127.0.0.1:6379'
  },
  github: credentials.github,
  requirements: {
    minimum_git_issues: 5
  },
  search: {
    language: 'javascript',
    no_of_users: 30,
    n_of_repos: 5,
    n_of_files: 5
  }
};

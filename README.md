
# GitMatch
With GitMatch we wanted to provide an easy way for maintainers to find developers to contribute in open source.

We created a matching algorithm that compares the repository's package usage, code style via jscs/jshint/etc to the developers on GitHub.

The results are then displayed in a tinder-like interface. "Liked" developers are notified via GitHub @mention in an issue to contribute to the project.

Before the matching process can begin, we check the repository if it's contribution friendly. There are a few good practices around: CONTRIBUTING.md files, issues to work on etc. If those requirements are not met, we provide information on how to fix it, or even to a commit to the repository with the files.

In the matching process, we wanted to get all gender/race/identification characteristics out, only the match scores and geo distance matter.

Once matched, we create an issue in the maintainers repo that friendly asks the developer for contribution.

# Quick start

```
$ git clone https://github.com/nko5/gitmatch.git
```
Create your own credentials file (credentials.js), based on the existing credentials.tmpl.js. Login to your github account and create an application to get your app clientId and clientSecret.

```
$ npm install
$ npm start
```


# NPM scripts

`npm run dev`
> Run in development mode

`npm run start`
> Run in production mode

`npm run test`
> Runs tests

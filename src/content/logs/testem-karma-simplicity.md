---
title: 'Karma, Testem, Non-Simplicity'
date: 2017-03-30
---

The other night I was introducing a [Dom module in Forto](https://github.com/jasonkuhrt/forto/commit/d272ebde8070897e908954b45571280bbb646523) and wanted to start some tests around this. The existing tests were using [jest](https://github.com/facebook/jest) which relies on [jsdom](https://github.com/tmpvar/jsdom) for in-memory in-javascript testing against the dom and so I was hoping I would be able to repurpose this existing code. But I quickly discovered that jsdom [does not actually simulate dom layout](https://github.com/tmpvar/jsdom/issues/1322) making the tests I was interested in making impossible.

That meant I would have to:

- install more test framework dependencies
- run my existing jest tests apart from this new set of Dom integration tests
- refresh my memory on another test system

Not ideal.

I tried to think of the most lightweight solution: headless testing. That is, I didn't want to manually open a browser, write an HTML entrypoint, or anything like that. Enter [phantomjs](https://github.com/ariya/phantomjs). At least it would allow me to drive tests from node thereby integrating somewhat easily with the project insofar as npm script tasks and automatic process start/stop goes. I checked its [headless testing information page](http://phantomjs.org/headless-testing.html) which pointed out [a mocha integration](https://github.com/nathanboktae/mocha-phantomjs) among other things. Alas it quickly unraveled when it became clear I would have to manually manage HTML files with script tags pointing to JS bundles yatta yatta. Nope.

Next I decided to return to [testem](https://github.com/testem/testem) and [karma](https://github.com/karma-runner/karma) both of which I have [used](https://github.com/jasonkuhrt/oauth2-implicit) [before](https://github.com/jasonkuhrt/purry). I remember that testem had proven to be considerably simpler but I thought with so much time past since using either I would give each a fresh try.

#### Karma

- Installed a bunch of dependencies. The Babel 6 effect all over again.
- Configured a bunch of things
- Discovered that `console.log` output did not show up in the terminal during test time
- Discovered that `console.error` did but as hard-to-read unformatted string (e.g. forget logging a large complex object)
- Discovered that the webpack integration required me to redo a webpack config (the prior one being the regular config in project root) inside the karma config.
- Ugly and hard to read docs/website

#### Testem

- poor docs
- great console output as you'd expect (e.g. node pretty formatting)
- was able to integrate with phantomjs without having to install another dep
- was able to integrate with webpack without having to install another dep
- was able to reuse my webpack configs in project root
- generally [minimal config](https://github.com/jasonkuhrt/forto/blob/master/testem.json):

```
{
  "framework": "mocha",
  "src_files": [
    "./source/**/*.js",
    "./test/**/*.js"
  ],
  "serve_files": [
    "./build/**/*.js"
  ],
  "before_tests": "webpack",
  "launch_in_dev": ["PhantomJS", "Chrome"]
}
```

Confusingly `src_files` above is just a watch set that triggers a run of `before_tests`. Based on the above points its no surprise I chose to work with testem.

Along the way I had a few more surprises:

- Testem [does not support configuration inside `package.json`](https://github.com/testem/testem/issues/519). Why oh why. I've offered to help given a bit of guidance.
- I had to introduce [mocha](https://github.com/mochajs/mocha) because [jest does not run well in browsers apparently](http://stackoverflow.com/questions/30070905/how-to-use-jest-on-karma)
- That meant introducing an assertion library, I chose [chai](http://chaijs.com/api/assert/) because its fairly complete and I've used it many times in the past.
- But it turns out... that babel with `es-2015` compiles with `use-strict` globally and that chai library was relying on `callee` which is illegal in strict mode... So I wasted some time [googling this topic](http://stackoverflow.com/questions/33821312/how-to-remove-global-use-strict-added-by-babel) only to find out that if you [leave out the module part](http://stackoverflow.com/a/39225403/499537) there will be no global `use-strict` in the resulting Babel build.
- Using [webpack 2](https://webpack.js.org/) which now [supports native modules](https://medium.com/webpack/webpack-2-and-beyond-40520af9067f) in order to support [tree shaking](https://medium.freecodecamp.com/tree-shaking-es6-modules-in-webpack-2-1add6672f31b) but only if you disable babel module compiling. It just so happens this fact works great with the previous point. But wow, this tooling alignment is starting to feel pretty ad-hoc and flukey.
- It turns out that [phantomjs does not support `Object.assign`](https://www.google.ca/webhp?sourceid=chrome-instant&rlz=1C5CHFA_enCA715CA715&ion=1&espv=2&ie=UTF-8#q=phantomjs+Object.assign&*) (a fact I forgot during my hiatus from it) so I had to add yet another (dev) dep or change my source for the sake of the test environment. I chose a [dep to polyfill](https://github.com/ljharb/object.assign) the functionality.

Overall, I got a healthy does of [JavaScript fatigue](https://www.google.ca/webhp?sourceid=chrome-instant&rlz=1C5CHFA_enCA715CA715&ion=1&espv=2&ie=UTF-8#q=javascript+fatigue&*). Regardless, thanks to all the people that have made it even possible to do any of this.

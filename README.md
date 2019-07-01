
Simple React-starter
--------------------
----------
- install node
- npm install
- copy env.template.json to env.json, and update vars appropriately,
  -  SERVER_URL if not preset will use the url from where its being served.
- npm start -> to start dev server (fetches changes in source code), leave it running while coding
- make code changes & test in dev server
- npm run build -> generates bundled code & css to be served by the server
- npm run start:prod -> to start server testing the prod version
- commit & push

### Recommendations

Use Visual studio code and install the following extensions:

- Code Spell Checker
- EditorConfig for VS Code
- ESLint

*The last 2 are necessary to ensure line breaks are LF, and eslint lets you compile*

## Features
  * Cache bursting
  * Css extraction
  * Production (css & js minification with babili)
  * Hot reload
  * React,
  * Redux,
  * React-Router
  * Babel
  * Eslint
  * Webpack 3,
  * Editorconfig
  * npm 5 witch package-lock.json
  * Hooks
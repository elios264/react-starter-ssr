const _ = require('lodash');

const renderHtml = _.template(`
<!doctype html>
  <html>
    <head <%= helmet.htmlAttributes.toString() %> >
      <meta charset="utf-8" />
      <%= helmet.title.toString() %>
      <%= helmet.meta.toString() %>
      <%= helmet.link.toString() %>
      <% _.map(css, (item) => { %><link href="<%= item %>" rel="stylesheet"><% }) %>
    </head>
  <body <%= helmet.bodyAttributes.toString() %>>
    <div id="root"><%= body %></div>
      <script>window.__PRELOADED_STATE__ = <%= JSON.stringify(state).replace(/</g,'\\u003c') %></script>
      <% _.map(js, (item) => { %><script src="<%= item %>"></script><% }) %>
  </body>
</html>
`);

module.exports = ({ body, helmet, state, css, js }) => renderHtml({ body, helmet, state, css, js });
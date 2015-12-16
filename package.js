Package.describe({
  name: 'lmachens:google-maps-inverted-circle',
  version: '0.0.4',
  // Brief, one-line summary of the package.
  summary: 'Draws a inverted circle',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/lmachens/google-maps-inverted-circle',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('google-maps-inverted-circle.js');
  api.export('InitInvertedCircle');
});

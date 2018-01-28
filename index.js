const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const solr = require('solr-client');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({
    stdTTL: 600
});

var client = solr.createClient({
    host: 'ec2-6-1-usa-va.opensolr.com',
    port: '443',
    secure : 'true',
    core: 'putinemoji',
    path: '/solr/'
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/docs/rest', (req, res) => res.render('pages/rest-api'))
  .get('/q', function (req, res) {
      var queryString = req.query.s;
      if(queryString) {
          var value = myCache.get(queryString);
          if ( value == undefined ){
              var query = client.query()
                  .q(queryString)
                  .qf({tag: 1})
                  .edismax()
                  .start(0)
                  .rows(1);
              client.search(query, function (err, result) {
                  if (err) {
                      console.log(err);
                      res.send({});
                      return;
                  }
                  value = result.response.docs;
                  myCache.set(queryString, value);
                  res.send(value);
              });
          } else {
              res.send(value);
          }
      } else {
          res.send({});
      }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

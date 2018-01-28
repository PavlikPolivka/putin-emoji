const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const solr = require('solr-client');

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
    var query = client.query()
        .q(req.query.s)
        .qf({tag : 1})
        .edismax()
        .start(0)
        .rows(1);
    client.search(query, function (err, result) {
        if (err) {
            console.log(err);
            res.send({});
            return;
        }
        res.send(result.response.docs)
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

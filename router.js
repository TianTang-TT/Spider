const spider = require('./crawlers/zhihu');
const analysis = require('./crawlers/analysis');

const router = (app, req, res) => {
  app.get('/', (req, res) => {
    console.log('get root dir ........');
    res.status(200).sendFile(process.cwd() + '/index.html');
  });
  app.get('/profile', (req, res) => {
    console.log('get profile ..........');
    spider.getProfile(profile => {
      app.render('profile', profile, (err, html) => {
        if (err) {
          res.send(err);
          console.log('profile is wrong')
          return;
        }
        res.send(html);
      })
    });
  });
  app.get('/actions', (req, res) => {
    console.log('get actions ..........');
    spider.getActions(actions => {
      console.log(actions.length);
      // 先对数据作分析，然后返回
      app.render('actions', analysis(actions), (err, html) => {
        if (err) {
          console.log('actions is wrong')
          return;
        }
        res.send(html);
      })
    });
  })
}

module.exports = router;
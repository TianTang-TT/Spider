const url = require('url');
const superagent = require('superagent');
const spider = require('./crawlers/zhihu');
const analysis = require('./crawlers/analysis');

const router = (app, req, res) => {
  app.get('/', (req, res) => {
    console.log('get root dir ........');
    res.status(200).sendFile(process.cwd() + '/index.html');
  });
  // 图片验证码
  app.get('/captcha', (req, res) => {
    superagent.get('https://www.zhihu.com/captcha.gif?type=login&r=' + Date.now())
    .end((err, img) => {
      console.log('验证码请求成功');
      let capCookie = img.header['set-cookie']
      capCookie.forEach(item => {
        if (item.indexOf('l_cap_id') == 0) {
          app.set('l_cap_id', item.substring(0, item.indexOf(';')));
        }
      })
      let type = img.headers["content-type"];
      let prefix = `data:${type};base64,`;
      let base64 = new Buffer(img.body, 'binary').toString('base64');
      let imgData = prefix + base64;
      res.send(imgData);
    })
  });
  // 登陆
  app.get('/login', (req, res) => {
    let query = url.parse(req.url, true).query;
    console.log('query:' + JSON.stringify(query));
    spider.authorize(Object.assign(query, {capId: app.get('l_cap_id')}), isSuccess => {
      res.json({isSuccess})
    })
  })
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
const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
console.log('开始抓取网页...');
// 知乎个人中心地址
const profileUrl = 'https://www.zhihu.com/people/yu-xin-96-75/activities';
const actionsUrl = 'https://www.zhihu.com/api/v4/members/yu-xin-96-75/activities?limit=20&after_id=1482121573&desktop=True';
const authorization = 'Bearer Mi4wQUlDQ3J5bGNCUXNBWUFKOHQ0X3JDaGNBQUFCaEFsVk5MUGwtV0FEYzQwb3M1eWFVOFVtSGU2NENPcjVkdFZpSWNR|1482124369|c376e2676fa779e747533a5ea8afa27f327c2683'; 
const cookie = 'd_c0="AGACfLeP6wqPTjk6zoRY9xy0IjgZZx0opqE=|1480386949"; q_c1=f60013e56c084a24b0dd80ae793f7e76|1480386949000|1480386949000; _zap=fa71034a-810c-4829-9393-e27eeeedafdb; _xsrf=cfe19cb2d335d834399975f082005e21; l_cap_id="ODM2MDY5YmI2MmIzNGM2YzkyNDJhZGQ4NDgxYWQwZWM=|1482123957|92e79d6b60974c29e0e963d5ef47275e5bade3be"; cap_id="ZTIwZDRlODBkYzEyNGFmZGExYWEzYjExZWVhMzVmNjk=|1482123957|bb5fafe8f490bd4d2d565787c325d28e725c37e2"; r_cap_id="YjllYzlmYzEzNmRkNGFhNDkxNTM1MDBjOGQ4ODJjZjk=|1482123958|952c436989606c919be25140d4c38f63c7ef5bdb"; login="MWVhZDZhMjhkZDZiNDU3YzhiZWJkNTI1NTdlYjk4YTg=|1482123970|9f06c6fa7213255ad72ada8d6b3bb3615950a5ef"; l_n_c=1; z_c0=Mi4wQUlDQ3J5bGNCUXNBWUFKOHQ0X3JDaGNBQUFCaEFsVk5MUGwtV0FEYzQwb3M1eWFVOFVtSGU2NENPcjVkdFZpSWNR|1482124369|c376e2676fa779e747533a5ea8afa27f327c2683';

const profile = {}; // 用户基本资料
const actions = []; // 最近动态，取两百条，然后分析

// 知乎渲染方式为首屏直出（前五条数据），下拉加载时每次请求新数据
// 先抓取首屏页面，从中筛选出前面几条数据
superagent
  .get(profileUrl)
  .set('Cookie', cookie)
  .end((err, res) => {
    if (err) {
      return err;
    } else {
      let $ = cheerio.load(res.text, {decodeEntities: false});
      let $profile = $('#ProfileHeader');
      let $actions = $('#ProfileMain');
      // 解析用户资料
      let avatar = $profile.find('img.Avatar').attr('src');
      let nickName = $profile.find('span.ProfileHeader-name').text();
      let headline = $profile.find('span.ProfileHeader-headline').text();
      let field = $profile.find('div.ProfileHeader-infoItem').eq(0).text();
      let sex = $profile.find('div.ProfileHeader-infoItem').eq(1)
                .find('svg').eq(0).hasClass('Icon Icon--male') ? 'M' : 'F';
      
      Object.assign(profile, {
        avatar,
        nickName,
        headline,
        field,
        sex
      })
      console.log('用户基本资料:' + JSON.stringify(profile));

      // 解析前五条数据
      let firstFiveItems = $actions.find('.list .List-item');
      Array.from(firstFiveItems).forEach((item, index) => {
        // TODO 先放着吧，写不动了，这里有点复杂
      })

      // 抓取最近的动态，取最近两个月的数据
      getActionDatas(actionsUrl);
    }
  });

// 抓取动态，每次20条
function getActionDatas (url) {
  console.log('动态抓取中。。。');
  superagent
  .get(url)
  .set('authorization', authorization)
  .end((err, res) => {
    if (err) {
      console.log(err);
    } else {
      let actionArr = JSON.parse(res.text).data;
      actionArr.forEach((item) => actions.push(item));
      console.log(actions.length);
    }
  })
}


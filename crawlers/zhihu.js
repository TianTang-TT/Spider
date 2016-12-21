const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');

const profile = {}; // 用户基本资料
const actions = []; // 最近动态，取两百条，然后分析

const actionSize = 20;   // 每次请求的数目
const actionCount = 200; // 需要的数据总数
// 知乎个人中心地址
const profileUrl = 'https://www.zhihu.com/people/yu-xin/activities';
// 此接口请求的最大条数为 20

// 授权
const authorization = ''; 
// cookie
const cookie = '';

let firstId = '';

// 知乎渲染方式为首屏直出（前五条数据），下拉加载时每次请求新数据
// 先抓取首屏页面，从中筛选出前面几条数据
const getProfile = (callback) => {
  superagent
  .get(profileUrl)
  .set('Cookie', cookie)
  .set('Connection', 'keep-alive')
  .end((err, res) => {
    if (err) {
      console.log(`profile出错：${err}`);
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
                .find('svg').eq(0).hasClass('Icon Icon--male') ? 'Mame' : 'Female';
      
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
      callback(profile);      
    }
  });
}

// 抓取动态，每次20条
const getActions = (callback) => {
  fetchAction();
  function fetchAction (afterId = firstId) {
  let targetUrl = `https://www.zhihu.com/api/v4/members/tiantang/activities?limit=${actionSize}&after_id=${afterId}&desktop=True`;
  console.log('抓取目标：' + targetUrl);
  superagent
  .get(targetUrl)
  .set('authorization', authorization)
  .end((err, res) => {
    if (err) {
      console.log(err);
      return;
    } 
    console.log('...................................................');
    let result = JSON.parse(res.text);
    let actionArr = result.data;
    if (actionArr.length) {
      actionArr.forEach((item) => actions.push(item));
      // 如果有不够 200 条则接着请求
      if (actions.length < actionCount) {
        console.log('才' + actions.length + ', 继续');
        let url = result.paging.next;
        let after_id = url.match(/after_id=(\d+)/)[1];
        fetchAction(after_id);
      } else {
        // 只要200条，多余的裁减掉
        console.log('数据收集完毕，多余的干掉');
        actions.splice(actionCount, actionSize);
        callback(actions);
      }     
    } else {
      console.log('没数据了我擦');
      callback(actions);
    }
  });
  }
  
}

exports.getProfile = getProfile;
exports.getActions = getActions;

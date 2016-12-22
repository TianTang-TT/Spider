const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');

const profile = {}; // 用户基本资料
const actions = []; // 最近动态，取两百条，然后分析

const actionSize = 20;   // 每次请求的数目
const actionCount = 200; // 需要的数据总数
// 知乎个人中心地址

let userId = 'yu-xin-96-75';
const profileUrl = `https://www.zhihu.com/people/${userId}/activities`;

const firstUrl = `https://www.zhihu.com/api/v4/members/${userId}/activities?include=data%5B%3F(target.type%3Danswer)%5D.target.is_normal%2Csuggest_edit%2Ccontent%2Cvoteup_count%2Ccomment_count%2Ccollapsed_counts%2Creviewing_comments_count%2Ccan_comment%2Cmark_infos%2Ccreated_time%2Cupdated_time%2Crelationship.voting%2Cis_author%2Cis_thanked%2Cis_nothelp%2Cupvoted_followees%3Bdata%5B%3F(target.type%3Danswer)%5D.target.badge%5B%3F(type%3Dbest_answerer)%5D.topics%3Bdata%5B%3F(target.type%3Darticle)%5D.target.column%2Ccontent%2Cvoteup_count%2Ccomment_count%2Ccollapsed_counts%2Creviewing_comments_count%2Ccan_comment%2Ccomment_permission%2Ccreated%2Cupdated%2Cupvoted_followees%2Cvoting%2Cauthor.badge%5B%3F(type%3Dbest_answerer)%5D.topics%3Bdata%5B%3F(target.type%3Dcolumn)%5D.target.title%2Cintro%2Cdescription%2Carticles_count%2Cfollowers%3Bdata%5B%3F(target.type%3Dtopic)%5D.target.introduction%3Bdata%5B%3F(verb%3DMEMBER_COLLECT_ANSWER)%5D.extra_object%3Bdata%5B%3F(verb%3DMEMBER_COLLECT_ARTICLE)%5D.extra_object&limit=20`;

// 授权
const authorization = 'Bearer Mi4wQUlDQ3J5bGNCUXNBWUFKOHQ0X3JDaGNBQUFCaEFsVk5EZFNDV0FBUFd0d0pseUpMYnRUTW8zTXFfWHB2UWEzNWJ3|1482377186|03bd216e3224470158e93217d56077e47a5092fc'; 
// cookie
const cookie = 'd_c0="AGACfLeP6wqPTjk6zoRY9xy0IjgZZx0opqE=|1480386949"; q_c1=f60013e56c084a24b0dd80ae793f7e76|1480386949000|1480386949000; _zap=fa71034a-810c-4829-9393-e27eeeedafdb; _xsrf=cfe19cb2d335d834399975f082005e21; l_n_c=1; l_cap_id="M2FjNDllMTQ3M2I2NGU0MWJkZjY5ZDQ1MmU0N2Q3MTI=|1482376701|a233e4b843ccd01d851d70efc238a6b31510706c"; cap_id="NzJhMDNjNDg1NzNkNGZjN2FkYTY4YTI3NjBlYjdkZmI=|1482376701|c23b16f0deb7f9fc8de6af302c141d009e50cb38"; r_cap_id="MzViMTg1Zjc4OGM5NDYzZWFkOTI1Y2UwM2ZmNDE3ZTI=|1482376703|be49b63b3e6b21e371199c3c472d9dddb9ece277"; login="ZTQ2NzA5MmE1MDA1NDgxMmE2NDMwYTFlOTRkNDE5YWI=|1482376754|32a8b6e27e68c5b1f93dfbb6155bba7281cffbc1"; z_c0=Mi4wQUlDQ3J5bGNCUXNBWUFKOHQ0X3JDaGNBQUFCaEFsVk5EZFNDV0FBUFd0d0pseUpMYnRUTW8zTXFfWHB2UWEzNWJ3|1482377186|03bd216e3224470158e93217d56077e47a5092fc';

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
  function fetchAction (afterId) {
  let targetUrl;
  if (afterId) {
    targetUrl = `https://www.zhihu.com/api/v4/members/${userId}/activities?limit=${actionSize}&after_id=${afterId}&desktop=True`;
  } else {
    targetUrl = firstUrl;
  }
  
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
        // 所有动态已请求完毕
        if (result.paging.is_end) {
          callback(actions);
          return;
        }

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

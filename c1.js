var superagent = require('superagent'); 
var cheerio = require('cheerio');
var async = require('async');
console.log('爬虫程序开始运行......');
// 第一步，发起getData请求，获取所有4星角色的列表
superagent
  .post('http://wcatproject.com/charSearch/function/getData.php')
  .send({ 
    // 请求的表单信息Form data
    info: 'isempty', 
    star : [0,0,0,1,0], 
    job : [0,0,0,0,0,0,0,0], 
    type : [0,0,0,0,0,0,0], 
    phase : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    cate : [0,0,0,0,0,0,0,0,0,0], 
    phases : ['初代', '第一期','第二期','第三期','第四期','第五期','第六期', '第七期','第八期','第九期','第十期','第十一期','第十二期','第十三期','第十四期', '第十五期', '第十六期'],
    cates : ['活動限定','限定角色','聖誕限定','正月限定','黑貓限定','中川限定','茶熊限定','夏日限定'] })
    // Http请求的Header信息
   .set('Accept', 'application/json, text/javascript, */*; q=0.01')
   .set('Content-Type','application/x-www-form-urlencoded; charset=UTF-8')
   .end(function(err, res){       
      // 请求返回后的处理
      // 将response中返回的结果转换成JSON对象
        var heroes = JSON.parse(res.text);    
        // 并发遍历heroes对象
    async.mapLimit(heroes, 1, 
      function (hero, callback) {
      // 对每个角色对象的处理逻辑
        var heroId = hero[0]; // 获取角色数据第一位的数据，即：角色id
          fetchInfo(heroId, callback);
      }, 
      function (err, result) {
        console.log('抓取的角色数：' + heroes.length);
      }
    );
    }); 
// 获取角色信息
var concurrencyCount = 0; // 当前并发数记录
var fetchInfo = function(heroId, callback){
  concurrencyCount++;
  console.log("...正在抓取"+ heroId + "...当前并发数记录：" + concurrencyCount);
    // 根据角色ID，进行详细页面的爬取和解析
  superagent
      .get('http://wcatproject.com/char/' + heroId)
      .end(function(err, res){  
        // 获取爬到的角色详细页面内容
        var $ = cheerio.load(res.text,{decodeEntities: false});             
        // 对页面内容进行解析，以收集队长技能为例
        console.log(heroId + '\t' + $('.leader-skill span').last().text())
        concurrencyCount--;
        callback(null, heroId);
      });
  
};
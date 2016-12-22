## node爬虫
> 爬取个人知乎动态，抓取两百条信息，统计最近的动态

### 使用模块

##### superagent
> 发起http请求，请求知乎接口来获取数据

##### cheerio
> 抓取页面后操作dom来提取页面中的数据，api及用法跟jquery类似

##### express
> 用来起简单的服务，以便于在浏览器中查看爬虫抓取的的数据

##### jade
> 页面模板引擎

### 使用方法
1. 克隆该仓库到本地，然后安装相应的模块
2. 执行`node app`来启动服务
3. 打开浏览器，输入`localhost:3000`便可查看效果

### 爬虫说明

##### 基本配置
```js
let userId = 'yu-xin-96-75';
const profileUrl = `https://www.zhihu.com/people/${userId}/activities`;

const firstUrl = `https://www.zhihu.com/api/v4/members/${userId}/activities?include=data%5B%3F(target.type%3Danswer)%5D.target.is_normal%2Csuggest_edit%2Ccontent%2Cvoteup_count%2Ccomment_count%2Ccollapsed_counts%2Creviewing_comments_count%2Ccan_comment%2Cmark_infos%2Ccreated_time%2Cupdated_time%2Crelationship.voting%2Cis_author%2Cis_thanked%2Cis_nothelp%2Cupvoted_followees%3Bdata%5B%3F(target.type%3Danswer)%5D.target.badge%5B%3F(type%3Dbest_answerer)%5D.topics%3Bdata%5B%3F(target.type%3Darticle)%5D.target.column%2Ccontent%2Cvoteup_count%2Ccomment_count%2Ccollapsed_counts%2Creviewing_comments_count%2Ccan_comment%2Ccomment_permission%2Ccreated%2Cupdated%2Cupvoted_followees%2Cvoting%2Cauthor.badge%5B%3F(type%3Dbest_answerer)%5D.topics%3Bdata%5B%3F(target.type%3Dcolumn)%5D.target.title%2Cintro%2Cdescription%2Carticles_count%2Cfollowers%3Bdata%5B%3F(target.type%3Dtopic)%5D.target.introduction%3Bdata%5B%3F(verb%3DMEMBER_COLLECT_ANSWER)%5D.extra_object%3Bdata%5B%3F(verb%3DMEMBER_COLLECT_ARTICLE)%5D.extra_object&limit=20`;

// 授权
const authorization = ''; 
// cookie
const cookie = '';
```

##### userId
> userId为用户的用户id，进入知乎个人中心，比如地址为`https://www.zhihu.com/people/yu-xin-96-75/activities`,那么'yu-xin-96-75'便为userId

##### cookie &  authorization
> 这两项可以在请求的request中抓取到


### demo test 效果
![](http://7xt6mo.com1.z0.glb.clouddn.com/L$R01XSEN%7D1TMRZM%28V98~XI.png)
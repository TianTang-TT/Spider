## node爬虫
> 使用邮箱密码登陆，爬取个人知乎动态，抓取两百条信息，统计最近的动态

### 使用模块

##### superagent
> 发起http请求，请求知乎接口来获取数据

##### cheerio
> 抓取页面后操作dom来提取页面中的数据，api及用法跟jquery类似

##### express
> 用来起简单的服务，以便于在浏览器中查看爬虫抓取的的数据，用户登陆

##### jade
> 页面模板引擎

### 使用方法
1. 克隆该仓库到本地，然后安装相应的模块
2. 执行`node app`来启动服务
3. 打开浏览器，输入`localhost:3000`便可查看效果

### 目录说明
![](http://7xt6mo.com1.z0.glb.clouddn.com/1482825152%281%29.jpg)

### 主要步骤
* 1. 通过邮箱密码验证码登陆获取授权，获取cookie以及authorization
* 2. 通过请求`zhihu.com`来获取用户id，然后用cheerio抓取出来进行后续的操作
* 3. 拿到userid之后就可以进行用户基本资料以及最近动态的请求

> 登陆和获取授权的过程有点麻烦，而且有验证码，所以只能通过express来做一个转发。有兴趣的可以直接看github代码，此处不详细讲代码


### demo test 效果
![](http://7xt6mo.com1.z0.glb.clouddn.com/L$R01XSEN%7D1TMRZM%28V98~XI.png)

### github地址
[带登陆功能的知乎爬虫](https://github.com/TianTang-TT/Spider)
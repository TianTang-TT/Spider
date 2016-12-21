const express = require('express');
const router = require('./router');

const app = express();
app.set('view engine', 'jade'); // 设置模板引擎
app.set('views', __dirname + '/static/tpls');  // 设置模板相对路径(相对当前目录)
//app.use(express.static(__dirname));
// 记录请求时间
app.use((req, res, next) => {
  console.log('request time : ' + new Date() )
  next();
});

router(app);

app.listen(3000, () => {console.log('server is started!')});

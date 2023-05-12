const bodyParser = require("body-parser");

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // 获取用户名
  app.use("/user/name", (req, res) => {
    const result = { code: 200, data: { name: 'maotingfeng' }, msg: 'ok' };
    const { delay } = req.query;
    if (
      delay
    ) {
      const interval = parseInt(delay, 10)
      setTimeout(() => {
        res.json(result);
      }, interval);
    } else {
      res.json(result);
    }
  });

  // 登录
  app.use("/user/login", (req, res) => {
    const { status, message } = req.query;
    const code = parseInt(status, 10);
    res
      .status(code)
      .json({
        code,
        message,
      });
  });
};

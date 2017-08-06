var express = require('express');
var app = express();
var controller = require("./controller");
var bodyParser = require("body-parser");
var mysql = require("mysql");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//静态页面设置
app.use("/public", express.static("./public"));

//检查check页面的输入ID
app.post("/api/checkId", controller.checkId);
//提交考勤和加班记录
app.post("/api/upWorkStatus", controller.upWorkStatus);
//设定基本工资
app.post("/api/setBaseMoney", controller.setBaseMoney);
//查看check页面中所选的月份有没有记录
app.get("/api/checkMonth", controller.checkMonth);
//展示部门
app.get("/api/showDepartment", controller.showDepartment);
//展示个人
app.get("/api/searchById", controller.searchById);
//前面各中间件失败，则使用404页面
// app.use(function(req, res) {
//   res.redirect("/public/2.html");
//   res.end("??");
// });

app.listen(3000);

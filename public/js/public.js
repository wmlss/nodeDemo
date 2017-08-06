window.onload = function () {
  //基本工资设定模态框打开
  $("#page3").click(setWorkKind);
  //基本工资设定提交
  $("#setWorkKindButton").click(setWorkKindSubmit);
}

//页面1转跳
function toP1() {
  console.log("123");
  window.location.href = "http://127.0.0.1:3000/public/index.html";
}

//页面2转跳
function toP2() {
  console.log("123");
  window.location.href = "http://127.0.0.1:3000/public/check.html";
}

//基本工资设定模态框打开
function setWorkKind() {
  $("#baseMoney").val("");
  $("#workKindModel").modal("show");
}

//基本工资设定提交
function setWorkKindSubmit() {
  var workKind = $("#workKind").val();
  var baseMoney = $("#baseMoney").val();
  var setBase = {};

  if (!isInt(baseMoney)) {
      alert("请输入正整数!");
      return ;
  }
  console.log(setBase);
  $.post("/api/setBaseMoney", {
    workKind: workKind,
    baseMoney: baseMoney
  }, function (res) {
    console.log(res);
    if (res.status) {
      alert("设定成功!");
      $("#workKindModel").modal("hide");
    } else {
      alert("设定失败，请重试.");
    }
  });
}

//根据某年某月的获得该月第一天星期几
function getMonthFirstDay(year, month) {
  return (new Date(year, month-1, 0).getDay() + 1);
  //getDay() 返回从0开始 星期为0到1 月份也是从0开始
}

function getMonthDayNumber(year, month) {
  return (new Date(year, month, 0).getDate());
}

//判断是否为正整数
function isInt(num) {
  if (isNaN(num)) {
    return false;
  }
  if (num <=0) {
    return false;
  }
  return true;
}

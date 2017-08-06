//全局变量 存储记录的缺勤和加班信息
window.workStatusArray = [];
//全局变量 存储一开始要等级的员工id
window.id = 0;
//记录员工加班和考勤状态的object数组
//组成例子： [{date: "2017-1-2", late: true, overwork: {kind: workingDay, money: 200, hours: 1}},]
//overwork的kind类型 正常工作时间 休息日
//overwork 为null 则没有

//基本工资设定{workKind: "", baseMoney: 45000}

window.onload = function () {
  //先获取需要记录的员工ID;
  showIdModal();
  $("#upIdButtom").click(getId);
  initYearSelect();
  initMonthSelect();
  var year = $("#yearSelect").val();
  var month = $("#monthSelect").val();

  $("#addWorkStatus").click(addWorkStatus);

  $("#changeDate").click(changeCalender);
  //基本工资设定模态框打开
  $("#page3").click(setWorkKind);
  //基本工资设定提交
  $("#setWorkKindButton").click(setWorkKindSubmit);
  //提交加班考勤管理
  $("#recordButton").click(recordSubmit);
}

//记录提交
function recordSubmit() {
  var year = $("#yearSelect").val();
  var month = $("#monthSelect").val();
  var dateString = `${year}-${month}-1`;
  var data = JSON.stringify(window.workStatusArray);

  $.post("/api/upWorkStatus", {
    data: data,
    id: window.id,
    date: dateString
  }, function(res) {
    if(res.status) {
      alert("提交成功!");
      $("#recordButton").hide();
    } else {
      alert("提交失败, 请重新尝试");
    }
  })
}

//基本工资设定模态框打开
function setWorkKind() {
  $("#baseMoney").val("");
  $("#workKindModel").modal("show");
}

//添加某天的考勤加班管理
function addWorkStatus() {
  var date = $("#workStatusModelHead").html();
  var late = $("#late").is(":checked");
  var overwork = $("#overwork").is(":checked");
  var overworkKind = $("#overworkKind").val();
  var overworkTime = $("#overworkTime").val();
  var overworkMoney = $("#overworkMoney").val();
  var workStatus = {};

  if (overwork == false) {
    workStatus = {
      date: date,
      late: late,
      overwork: null
    };
  } else {
    if ( !isInt(overworkMoney)) {
      alert("补贴工资请输入正整数!");
      return;
    }

    workStatus = {
      date: date,
      late: late,
      overwork: {
        kind: overworkKind,
        hour: overworkTime,
        money: overworkMoney
      }
    };
  }
  //保存到全局变量中
  window.workStatusArray.push(workStatus);
  initWorkStatus();
  //单元格id
  var tdId = "td-"　+ date;
  var html = $('#'+tdId).html();
  //生成新的单元格追加内容
  html += addContent(workStatus);
  $('#'+tdId).html(html);
  $("#"+tdId).attr("onclick", "");
  $("#workStatusModel").modal("hide");
}

//初始化设加班考勤模态框
function initWorkStatus() {
  document.getElementById("late").checked = false;
  document.getElementById("overwork").checked = false;
  $("#overworkKind").val("工作日");
  $("#overworkTime").val(1);
  $("#overworkMoney").val("");
}

//生成新的单元格追加内容
function addContent(workStatus) {
  var addHtml = "";
  if (workStatus.late) {
    addHtml += "<br>缺勤/";
  }
  if (workStatus.overwork != null) {
    addHtml += `<br>加班<br>${workStatus.overwork.hour}小时;`;
  }
  return addHtml;
}

function createcheckedCalender(y, m, data) {
  var date = new Date();
  var year = y || date.getFullYear();
  var month = m || date.getMonth() + 1;
  //getMonth() 返回从0开始
  var lateInfo = data.late;
  var overworkInfo = data.overwork;
  var dayNum = getMonthDayNumber(year, month);//得到知道月份的天数
  var first = getMonthFirstDay(year, month);//得到第一天为第几周
  var addHtml = "";
  var addDay = 1;
  var weekDay = 1;
  var isAddDay = false;
  var firstDay = 1;

  for (var i=0; i<6; i++) {
    if (addDay > dayNum) {
      break;
    }
    addHtml += "<tr>";
    for (var x=0; x<7; x++) {
      if (firstDay == first && !isAddDay) {
        isAddDay = true;
      }
      if (addDay > dayNum) {
        isAddDay = false;
      }
      if (isAddDay) {
        var time = `${year}-${month}-${addDay}`
        addHtml += `<td class='pointer'>${addDay}`;
        addHtml += makeAddContent(time, data);
        addHtml += "</td>"
        addDay++;
      }else {
        addHtml += "<td> </td>";
      }
      firstDay++;
    }
    addHtml += "</tr>";
  }
  $("#addContent").html(addHtml);
}

function makeAddContent(time, data) {
  var addHtml = "";
  var lateInfo = data.late;
  var overworkInfo = data.overwork;
  for (i in lateInfo) {
    if (lateInfo[i].time == time) {
      addHtml += "<br>缺勤";
      break;
    }
  }
  for (i in overworkInfo) {
    if (overworkInfo[i].time == time) {
      addHtml += `/<br>加班${overworkInfo[i].duration}小时`;
      break;
    }
  }
  return addHtml;
}


function createNewCalender(y, m) {
  var date = new Date();
  var year = y || date.getFullYear();
  var month = m || date.getMonth() + 1;
  //getMonth() 返回从0开始
  var dayNum = getMonthDayNumber(year, month);//得到知道月份的天数
  var first = getMonthFirstDay(year, month);//得到第一天为第几周
  var addHtml = "";
  var addDay = 1;
  var weekDay = 1;
  var isAddDay = false;
  var firstDay = 1;

  for (var i=0; i<6; i++) {
    if (addDay > dayNum) {
      break;
    }
    addHtml += "<tr>";
    for (var x=0; x<7; x++) {
      if (firstDay == first && !isAddDay) {
        isAddDay = true;
      }
      if (addDay > dayNum) {
        isAddDay = false;
      }
      if (isAddDay) {
        var dateDay = `${year}-${month}-${addDay}`
        addHtml += `<td id='td-${dateDay}' class='pointer' value='${addDay}' onclick=setWorkStatus(this)>${addDay}</td>`;
        addDay++;
      }else {
        addHtml += "<td> </td>";
      }
      firstDay++;
    }
    addHtml += "</tr>";
  }
  $("#addContent").html(addHtml);
}

//点击表格单元加班和考勤弹出状态框(设定后对应表格会出现对应的记录)
function setWorkStatus(t) {
  initWorkStatus();
  var year = $("#yearSelect").val();
  var month = $("#monthSelect").val();
  var day = $(t).attr("value");

  var dateString = `${year}-${month}-${day}`;
  $("#workStatusModelHead").html(dateString);
  $("#workStatusModel").modal('show');
}


function initYearSelect() {
  var addHtml = "";
  var nowYear = new Date().getFullYear();
  for (var i=1999; i<=nowYear; i++) {
    addHtml += `<option>${i}</option>`;
  }
  $("#yearSelect").html(addHtml);
  $("#yearSelect").val(nowYear);
}

function initMonthSelect() {
  var addHtml = "";
  var nowMonth = new Date().getMonth() + 1;
  for (var i=1; i<=12; i++) {
    addHtml += `<option>${i}</option>`;
  }
    $("#monthSelect").html(addHtml);
    $("#monthSelect").val(nowMonth);
}

function changeCalender() {
  var year = $("#yearSelect").val();
  var month = $("#monthSelect").val();
  var date = `${year}-${month}-1`
  $.get("/api/checkMonth", {
    id: window.id,
    date: date
  }, function(res) {
    if (res.status == false) {
      createNewCalender(year, parseInt(month));
      $("#recordButton").show();
    } else {
      createcheckedCalender(year, parseInt(month), res.data);
      $("#recordButton").hide();
    }
  });
}

//打开获取ID模态框
function showIdModal() {
  $("#idModal").modal("show");
}

//获取需要记录的ID
function getId() {
  window.id = $("#idInput").val().trim();
  console.log(id);
  $.post("/api/checkId", {
      id: window.id
  }, function (res) {
    if (res.status == false) {
      alert("查无此ID");
      return;
    }else {
      $("#idModal").modal("hide");
      //获取成功后开始生成日历表格
      changeCalender();
      }
    }
  )
}

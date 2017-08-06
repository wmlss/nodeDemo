var mysql = require("mysql");
var mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "sqlDemo"
}
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

exports.checkId = function (id, callback) {
  connection.query("SELECT * FROM `staff` WHERE `id` = ?", [id],
  function(err, res, fields) {
    if (err) {
      console.log(err);
      callback("select id fail", null);
      return ;
    }
    if (res.length != 0) {
      callback(null, true);
    }else {
      callback(null, false);
    }

  });
}

//插入加班和缺勤信息
exports.insertWorkStatus = function (id, dataArray, callback) {
  try {
    for (x in dataArray) {
      var data = dataArray[x];
      connection.query("insert into late values (?, ?)", [id, data.date]);
      if (data.overwork != null) {
        var overwork = data.overwork;
        connection.query("insert into overwork values (?, ?, ?, ?, ?)",
        [id, data.date, overwork.hour, overwork.money, overwork.kind]);
      }
    }
    callback(null);
  }catch(err) {
    console.log(err);
    callback("存储加班缺勤信息失败");
  }
}

//记录工种基本工资
exports.setBaseMoney = function (kind, baseMoney, callback) {
  try {
    connection.query("update workkind set baseMoney = ? where kind = ?",
    [baseMoney, kind]);
    callback(null);
  } catch (err) {
    console.log(err);
    callback("设定基本工资失败");
  }
}

//实际工资记录到数据库
exports.recordSalary = function (id, time, salary) {
  getBaseInfo(id, function (department, name, kind) {
    connection.query("insert into `salary` values(?, ?, ?, ?, ?, ?)",
    [id, time, department, salary, name, kind],
    function (err, res, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(`记录${id},${name},${time}工资${salary}成功`);
      }
    })
  })
}

//输出部门工资信息
exports.showDepartment = function(department, callback) {
  //取得上个月工资
  date = new Date();
  month = parseInt(date.getMonth());
  if (month<10) {
    month = '0' + month.toString();
  }
  var yearMonth = date.getFullYear().toString() + '-' + month;
  console.log(yearMonth);
  connection.query("select * from salary where department=? and DATE_FORMAT(salary.time, '%Y-%m') = ?",
  [department, yearMonth], function(err, res, fields) {
    console.log(res);
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, res);
  });
}

//输出个人工资信息
exports.showById = function(id, callback) {
  connection.query("select * from salary where id = ?", [id], function(err, res, fields) {
    console.log(res);
    if (err) {
      callback(err, null);
      return;
    }
    if (res.length == 0) {
      callback(null, null);
    } else {
      callback(null, res);
    }

  });
}

exports.checkSalary = function(id, date, callback) {
  connection.query("select * from `salary`  where id=? and time=?", [id, date], function(err, res, fields) {
    if (err) {
      console.log(err);
      callback(err, false);
    } else {
      if (res.length != 0) {
        callback(null, true);
      }else {
        callback(null, false);
      }
    }
  });
}


//data 为json 数组 {late: [,,]||null, overwork: [{date: ,hour: }, {}]||null}
exports.checkMonth = function(id, date, callback) {
  var data = {};
  getMonthLate(id, date, function(err, lateData) {
    data.late = lateData;
    getMonthOverwork(id, date, function(err, overworkData) {
      data.overwork = overworkData;
      callback(null, data);
    });
  });
}



exports.getBaseMoney = function (id, callback) {
  connection.query("select * from `workkind`  where kind = (select kind from `staff` where id = ?)", [id], function(err, res, fields) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, res[0].baseMoney);
    }
  });
}

//获得录入月工资时员工的基本信息
function getBaseInfo (id, callback) {
  var connection = mysql.createConnection(mysqlConfig);
  connection.connect();
  connection.query("select * from `staff` where id = ?", [id], function (err, res, fields) {
    console.log(id);
    callback(res[0].department, res[0].name, res[0].kind);
  })
}

function getMonthLate(id, date, callback) {
  date = new Date(date);
  month = parseInt(date.getMonth()+1);
  if (month<10) {
    month = '0' + month.toString();
  }
  var yearMonth = date.getFullYear().toString() + month;

  connection.query("select * from late where id = ? and DATE_FORMAT(late.time, '%Y%m') = ?;", [id, yearMonth], function(err, res, fields) {
    if (err) {
      console.log(err);
      callback(err, null);
    }else {
      if (res.length == 0) {
        callback(null, null);
      } else {
        res = formatDate(res);
        callback(null, res);
      }
    }
  });
}

function getMonthOverwork(id, date, callback) {
  date = new Date(date);
  month = parseInt(date.getMonth()+1);
  if (month<10) {
    month = '0' + month.toString();
  }
  var yearMonth = date.getFullYear().toString() + month;

  connection.query("select * from overwork where id = ? and DATE_FORMAT(overwork.time, '%Y%m') = ?;", [id, yearMonth], function(err, res, fields) {
    if (err) {
      console.log(err);
      callback(err, null);
    }else {
      if (res.length == 0) {
        callback(null, null);
      } else {
        res = formatDate(res);
        callback(null, res);
      }
    }
  });
}

function formatDate(data) {
  for (i in data) {
    var date = new Date(data[i].time);
    var month = parseInt(date.getMonth()) + 1;
    var time = `${date.getFullYear()}-${month}-${date.getDate()}`;
    data[i].time = time;
  }
  return data;
}

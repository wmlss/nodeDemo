var express = require("express");
app = express();
var model = require("../model");

exports.checkId = function (req, res) {
  var id = req.body.id;

  model.checkId(id, function(err, isIn) {
    var result = {};
    if (err) {
      console.log(err)
      result.status = false;
      res.json(result);
      res.end();
    }
    if (isIn) {
      result.status = true;
    } else {
      result.status = false;
    }
    res.json(result);
    res.end();
  });
}

exports.upWorkStatus = function (req, res) {
  var dataArray = JSON.parse(req.body.data);
  var id = req.body.id;
  var date = req.body.date;

  model.insertWorkStatus(id, dataArray, function(err) {
    var result = {};

    if (err == null) {
      result.status = true;
      recordSalary(id, date, dataArray);
    } else {
      console.log(err);
      result.status = false;
    }
    res.json(result);
    res.end();
  })
  res.end();
}

exports.setBaseMoney = function (req, res) {
  var kind = req.body.workKind;
  var baseMoney = req.body.baseMoney;

  model.setBaseMoney(kind, baseMoney, function (err) {
    var result = {};
    if (err) {
      console.log(err);
      result.status = false;
      res.json(result);
      res.end();
    } else {
      result.status = true;
      res.json(result);
      res.end();
    }
  });
}


exports.checkMonth = function(req, res) {
  var id = req.query.id;
  var date = req.query.date;

  model.checkSalary(id, date, function(err, status) {
    var result = {};
    console.log(status)
    if (status == false) {
      result.status = false;
      res.json(result);
      res.end();
    } else {
      model.checkMonth(id, date, function(err, data) {
        var result = {};
        result.status = true;
        result.data = data;
        res.json(result);
        res.end();
      });
    }
  });
}

exports.showDepartment = function(req, res) {
  var department = req.query.department;
  model.showDepartment(department, function(err, data) {
    var result = {};
    if (err) {
      result.status = false;
      console.log(err);
      res.json(result);
      res.end();
    } else {
      result.status = true;
      result.data = data;
      res.json(result);
      res.end();
    }
  });
}

exports.searchById = function(req, res) {
  var id = req.query.id;
  model.showById(id , function(err, data) {
    var result = {};
    if (err || data == null) {
      result.status = false;
      console.log(err);
      res.json(result);
      res.end();
    } else {
      result.status = true;
      result.data = data;
      res.json(result);
      res.end();
    }
  });
}

//录入实际工资
function recordSalary (id, date, dataArray) {
  model.getBaseMoney(id, function(err, baseMoney) {
    if (err) {
      console.log("记录工资时查询基本工资失败!");
      return;
    }
    var salary = calculateSalary(baseMoney, dataArray);

    model.recordSalary(id, date, salary);
  });
}

//计算实际工资
function calculateSalary(baseMoney, dataArray) {
  var salary = parseInt(baseMoney);
  for (i in dataArray) {
    var data = dataArray[i];
    if (data.late) {
      salary = salary - 100;
    }
    if (data.overwork != null) {
      salary = salary + parseInt(data.overwork.money);
    }
  }
  return salary;
}

function getSalaryDate(dataArray) {
  var time = new Date(dataArray[0].date);
  console.log(dataArray[0].date);
  var month = parseInt(time.getMonth()) + 1
  var date = time.getFullYear() + '-' + month + '-' + "01";
  return date;
}

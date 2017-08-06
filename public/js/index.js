
window.onload = function() {
  showDepartment();
}
$("#searchOneButton").click(function () {
  var id = $("#searchId").val().trim();
  $.get("/api/searchById", {
    id: id
  }, function(res){
    if (res.status == false) {
      alert("无此ID数据");
    } else {
      showOneById(res.data);
    }
  });

});

function showOneById(data) {
    var addHtml = addIDContent(data);
    $("#IDtbody").html(addHtml);
    $("#employeeModal").modal("show");
}

function addIDContent(data) {
  var addHtml = "";
  for (i in data) {
    var date = new Date(data[i].time);
    var month = parseInt(date.getMonth()) + 1;
    var time = date.getFullYear() + '-' + month;
    addHtml += "<tr>"
    addHtml += `<td>${data[i].name}</td><td>${data[i].kind}</td>
                <td>${data[i].department}</td><td>${data[i].salary}</td><td>${time}</td>`
    addHtml += "</tr>"
  }
  return addHtml;
}

function showDepartment(t) {
  var department = "开发部";
  if (t != null) {
    department = $(t).html().trim();
  }

  $("#departmentName").html(department);
  $.get("/api/showDepartment", {
    department: department
  }, function(res) {
    console.log(res);
    if (res.status == false) {
      alert("暂无部门信息");
    } else {
      var addHtml = makeDepartmentContent(res.data);
      $("#departmentBody").html(addHtml);
    }
  });
}

function makeDepartmentContent(data) {
  var addHtml = "";

  for (i in data) {
    var rand = Math.random() * 1000;
    var yearAward = data[i].salary - rand;
    addHtml += "<tr>"
    addHtml += `<td>${data[i].name}</td><td>${data[i].id}</td>
                <td>${data[i].kind}</td><td>${data[i].salary}</td><td>${parseInt(yearAward)}</td>`
    addHtml += "</tr>"
  }
  return addHtml;
}

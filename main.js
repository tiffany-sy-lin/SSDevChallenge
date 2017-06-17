var locallyStoredData = [];

$(document).ready(

/*Retreive data from server and create table and graph*/
function(){
$.ajax({
    type:"get",
    url:"//jsapi.makespi.com/api/companies/revenue",
    data: {
        key: '4e9f746aa8df5eeba6232ce96bddcd58'
    },
    success: function(data){
      var tableRowId = 1;
      locallyStoredData = data;
      var companyList = [];
      //Iterate through all objects and add to table as you go 
      for(i in data.companies){
        $('#revenueTable').append('<tr id='+tableRowId+'><td>'+data.companies[i].industry
          +'</td><td>'+data.companies[i].name+'</td><td>'+data.companies[i].revenue+'</td><td>'+data.companies[i].year+'</td></tr>');
        tableRowId++;
        if (jQuery.inArray(data.companies[i].name, companyList) === -1) {
          companyList.push(data.companies[i].name);
        }
        //$('#dropdownList').append('<option>'+data.companies[i].name+"</option>");
      }
      createGraph();

      //sort the company dropdown list in add revenue
      var check = 1;
      var temp;
      for (i = 0; (i <= companyList.length) && check; i++) {
        check = 0;
        for ( j = 0; j < companyList.length - 1; j++) {
          if (companyList[j+1] < companyList[j]) {
            temp = companyList[j];
            companyList[j] = companyList[j+1];
            companyList[j+1] = temp;
            check = 1;
          }
        }
      }
      for (i in companyList) {
        $('#dropdownList').append('<option>'+companyList[i]+"</option>");
      }
    },
    });

/*Validation check for new revenue input*/
function checkForm() {
  for (i in locallyStoredData.companies) {
    var selectedCompany = document.getElementById('dropdownList').value;
    var newRevenue = document.getElementById('newRevenue').value;
    var year = document.getElementById('year').value;
    if(selectedCompany != null && selectedCompany != '' && newRevenue != null && newRevenue != '' && year != null && year != '') {
      if (selectedCompany == locallyStoredData.companies[i].name) {
        if (year == locallyStoredData.companies[i].year){
          return false;
        }
      }
    }
    else {return false;}
  }
  return true;
}

/*Post data to server*/
function postData() {
  if (checkForm()) {
    var companyIndustry = '';
    for (i in locallyStoredData.companies) {
      if (document.getElementById("dropdownList").value == locallyStoredData.companies[i].name) {
        companyIndustry = locallyStoredData.companies[i].industry;
      }
    }
    var formData = {
      name: document.getElementById("dropdownList").value,
      revenue: document.getElementById("newRevenue").value,
      year: document.getElementById("year").value,
      industry: companyIndustry,
      key: '4e9f746aa8df5eeba6232ce96bddcd58' 
  }
  var saveData = $.ajax({
      type: 'POST',
      url: "//jsapi.makespi.com/api/companies/revenue",
      data: formData,
      success: function() { alert("Save Complete") }
  });
  }
  saveData.error(function() { alert("Something went wrong"); });
}

/*Create the graph*/
function createGraph() {
var industryArray = [];
var industryRevenue = [];
//Iterate through stored data to combine revenues by industry
for (i in locallyStoredData.companies){
  var currIndustry = locallyStoredData.companies[i].industry;
    if (jQuery.inArray(currIndustry, industryArray) !== -1){
      for (j in industryArray){
        if (industryArray[j] == locallyStoredData.companies[i].industry) {
          if (industryRevenue[j] != null && industryRevenue[j] != ''){
            var convertedRevenue = parseFloat(locallyStoredData.companies[i].revenue.replace(',',''));
            industryRevenue[j] += convertedRevenue;
          }
          else {
            var convertedRevenue = parseFloat(locallyStoredData.companies[i].revenue.replace(',',''));
            industryRevenue[j] += convertedRevenue;
          }
        }
      }
    }
    else {
      var convertedRevenue = parseFloat(locallyStoredData.companies[i].revenue.replace(',',''));
      industryArray.push(currIndustry);
      industryRevenue.push(convertedRevenue);
    }
}
//Render the chart
var data = {
  labels: industryArray,
  datasets: [{
      data: industryRevenue,
      backgroundColor: ["#A9A9A9", "#D1DBBD","#91AA9D","#3E606F","#193441", "#000", "#f1f1f1"]
    }]
}
var dataChart = document.getElementById("myChart").getContext('2d');
var myBarChart = new Chart(dataChart, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      },
      legend: {
        display: false
      },
    }
});


}

/*Filter table based on user input. Searches all columns*/
  $("#myInput").keyup(function(){
    // When value of the input is not blank
        var term=$(this).val()
    if( term != "")
    {
      // Show only matching TR, hide rest of them
      $("#revenueTable tbody>tr").hide();
            $("#revenueTable td").filter(function(){
                   return $(this).text().toLowerCase().indexOf(term ) >-1
            }).parent("tr").show();
    }
    else
    {
      // When there is no input or clean again, show everything back
      $("#revenueTable tbody>tr").show();
    }
  });

  document.getElementById ("submitButton").addEventListener ("click", postData, false);


});

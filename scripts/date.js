// makeDate to make our date
var makeDate = function() {
    var d = new Date();
    // empty string variable to hold our formatted date
    var formattedDate = "";
    // adding month to the string. 
    // Month start at 0 index so January is 0 so we are adding +1 so it displays in a format that humans use
    formattedDate += (d.getMonth() +1) + "_";
    // adding date
    formattedDate += d.getDate() + "_";
    // adding year
    formattedDate += d.getFullYear();
    
    return formattedDate;
  }
  
  module.exports = makeDate;
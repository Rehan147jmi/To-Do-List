
module.exports = date;

function date()  {
  
 let today = new Date();


var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  return day;

}
Date.prototype.addDays = addDays;

interface Date {
  addDays: typeof addDays;
}

function addDays(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

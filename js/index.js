import { fetchRefresh } from "./utils/fetchRefresh.js";
import { fetchData } from "./utils/fetchData.js";

let accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const date = new Date();

if (accessToken == null) {
  window.location.href = "login.html";
}

// function to refresh the token

fetchRefresh(
  "POST",
  "https://freddy.codesubmit.io/refresh",
  accessToken,
  refreshToken
);

function trimNumber(num) {
  if (num >= 1000000) {
    return Math.round(num / 1000000) + "M";
  } else if (num >= 1000) {
    return Math.round(num / 1000) + "K";
  }
  return num;
}

// function to get today data from the API

const getToday = () => {
  fetchData(accessToken).then((products) => {
    console.log(products);
    const today = date.getDay() + 1;
    const todayData = products.dashboard.sales_over_time_week[today];
    document.getElementById("today-total").innerText = `$${trimNumber(
      todayData.total
    )} `;
    document.getElementById(
      "today-orders"
    ).innerText = ` /${todayData.orders} orders`;
  });
};
getToday();

const getWeek = () => {
  fetchData(accessToken).then((products) => {
    let sumOrders = 0;
    let sumTotal = 0;
    Object.keys(products.dashboard.sales_over_time_week).forEach((key) => {
      sumOrders += products.dashboard.sales_over_time_week[key].orders;
      sumTotal += products.dashboard.sales_over_time_week[key].total;
    });
    document.getElementById("week-total").innerText = `$${trimNumber(
      sumTotal
    )} `;
    document.getElementById("week-orders").innerText = ` /${sumOrders} orders`;
  });
};
getWeek();

const getMonth = () => {
  fetchData(accessToken).then((products) => {
    const month = date.getMonth();
    console.log("month", month);
    const monthData = products.dashboard.sales_over_time_year[month];
    document.getElementById("month-total").innerText = `$${trimNumber(
      monthData.total
    )} `;
    document.getElementById(
      "month-orders"
    ).innerText = ` /${monthData.orders} orders`;
  });
};

getMonth();

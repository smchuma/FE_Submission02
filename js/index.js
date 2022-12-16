import { fetchRefresh } from "./utils/fetchRefresh.js";
import { fetchData } from "./utils/fetchData.js";
import { logout } from "./utils/logout.js";

let accessToken = localStorage.getItem("accessToken");
const url = "https://freddy.codesubmit.io/dashboard";

const date = new Date();

if (accessToken == null) {
  window.location.href = "login.html";
}

//! function to refresh the token

fetchRefresh(accessToken);

//!function to shorten numbers
function trimNumber(num) {
  if (num >= 1000000) {
    return Math.round(num / 1000000) + "M";
  } else if (num >= 1000) {
    return Math.round(num / 1000) + "K";
  }
  return num;
}

//! function to get today data from the API

const getToday = async () => {
  const globalData = await fetchData(url, accessToken);
  const products = globalData.dashboard;
  const today = date.getDay() + 1;
  const todayData = products.sales_over_time_week[today];
  document.getElementById("today-total").innerText = `$${trimNumber(
    todayData.total
  )} `;
  document.getElementById(
    "today-orders"
  ).innerText = ` /${todayData.orders} orders`;
};

getToday();

//! function to get last week data from the API

const getWeek = async () => {
  const globalData = await fetchData(url, accessToken);
  const products = globalData.dashboard;

  let sumOrders = 0;
  let sumTotal = 0;
  Object.keys(products.sales_over_time_week).forEach((key) => {
    sumOrders += products.sales_over_time_week[key].orders;
    sumTotal += products.sales_over_time_week[key].total;
  });

  document.getElementById("week-total").innerText = `$${trimNumber(sumTotal)} `;
  document.getElementById("week-orders").innerText = ` /${sumOrders} orders`;
};

getWeek();

//! function to get last month data from the API

const getMonth = async () => {
  const globalData = await fetchData(url, accessToken);
  const products = globalData.dashboard;

  const month = date.getMonth();
  const monthData = products.sales_over_time_year[month];
  document.getElementById("month-total").innerText = `$${trimNumber(
    monthData.total
  )} `;
  document.getElementById(
    "month-orders"
  ).innerText = ` /${monthData.orders} orders`;
};
getMonth();

//! chart.js datasets

const data = {
  labels: ["today", "yesterday", "day 3", "day 4", "day 5", "day 6", "day 7"],
  datasets: [
    {
      label: "chart",
      data: [5, 19, 3, 5, 2, 3],
      borderWidth: 4,
      barThickness: 30,
      backgroundColor: "transparent",
      borderColor: "#959595",
    },
  ],
};

// config
const config = {
  type: "bar",
  data,
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        display: false,
        drawBorder: false,
        grid: {
          display: false,
        },
      },
      x: {
        drawBorder: false,
        grid: {
          display: false,
        },
      },
    },
  },
};

const myChart = new Chart(document.getElementById("myChart"), config);
const myChart2 = new Chart(document.getElementById("myChart2"), config);

//! function to get the chart data from the API

const getChart = async () => {
  const globalData = await fetchData(url, accessToken);
  const products = globalData.dashboard;
  const dayList = [
    "today",
    "yesterday",
    "day 3",
    "day 4",
    "day 5",
    "day 6",
    "day 7",
  ];
  const days = dayList.map((day) => {
    return day;
  });
  myChart.config.data.labels = days;
  myChart.update();

  const revenue = Object.values(products.sales_over_time_week).map(
    (day) => day.total
  );
  myChart.config.data.datasets[0].data = revenue;
  myChart.update();
};
getChart();

const getChart2 = async () => {
  const globalData = await fetchData(url, accessToken);
  const products = globalData.dashboard;

  const monthList = [
    "this month",
    "last month",
    "month 3",
    "month 4",
    "month 5",
    "month 6",
    "month 7",
    "month 8",
    "month 9",
    "month 10",
    "month 11",
    "month 12",
  ];
  const months = monthList.map((month) => {
    return month;
  });
  myChart2.config.data.labels = months;
  myChart2.update();

  const monthlyRevenue = Object.values(products.sales_over_time_year).map(
    (month) => month.total
  );
  myChart2.config.data.datasets[0].data = monthlyRevenue;
  myChart2.update();
};

getChart2();

const button = document.querySelector("#btn");
const table1 = document.querySelector("#first");
const table2 = document.querySelector("#second");
let table1Visible = true;

button.addEventListener("click", () => {
  if (table1Visible) {
    $(table1).hide();
    $(table2).show();
    table1Visible = false;
  } else {
    $(table2).hide();
    $(table1).show();
    table1Visible = true;
  }
});

//! function to display bestsellers data with pagination

const table = document.querySelector("table");
let pageSize = 10;
let currentPage = 1;

const bestsellers = async (table) => {
  const globalData = await fetchData(url, accessToken);
  const data = globalData.dashboard;

  const tableBody = table.querySelector("tbody");
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = data.bestsellers.slice(start, end);
  tableBody.innerHTML = "";
  const pageNumber = document.createElement("button");

  pageNumber.innerHTML = currentPage;
  numbers.innerHTML = "";
  numbers.appendChild(pageNumber);

  paginatedItems.forEach((item) => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    const date = document.createElement("td");
    const units = document.createElement("td");
    const revenue = document.createElement("td");

    name.innerHTML = item.product.name;
    date.innerHTML = null;
    units.innerHTML = item.units;
    revenue.innerHTML = item.revenue;

    row.appendChild(name);
    row.appendChild(date);
    row.appendChild(units);
    row.appendChild(revenue);

    tableBody.appendChild(row);
  });
};

bestsellers(table);

const prevPage = async () => {
  if (currentPage > 1) {
    currentPage--;
    await bestsellers(table);
  }
};

//!  pagination buttons
const nexPage = async () => {
  if (currentPage < Math.ceil(globalData.bestsellers.length / pageSize)) {
    currentPage++;
    await bestsellers(table);
  }
};

document.getElementById("prev").addEventListener("click", prevPage);
document.getElementById("next").addEventListener("click", nexPage);

//! function for logout
const logoutUser = document.getElementById("logoutUser");
logoutUser.addEventListener("click", () => logout());

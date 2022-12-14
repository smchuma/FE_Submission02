import { fetchRefresh } from "./utils/fetchRefresh.js";
import { fetchData } from "./utils/fetchData.js";
import { bestSellers } from "./bestSellers.js";
import { logout } from "./utils/logout.js";

let accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const url = "https://freddy.codesubmit.io/dashboard";
const refreshUrl = "https://freddy.codesubmit.io/refresh";
const date = new Date();

if (accessToken == null) {
  window.location.href = "login.html";
}

// function to refresh the token
fetchRefresh(refreshUrl, accessToken, refreshToken);

//function to shorten numbers
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
  fetchData(accessToken, url).then((products) => {
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

// function to get last week data from the API
const getWeek = () => {
  fetchData(accessToken, url).then((products) => {
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

//function to get last month data
const getMonth = () => {
  fetchData(accessToken, url).then((products) => {
    const month = date.getMonth();
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

const data = {
  labels: [
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
  ],
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

const customBorder = {
  id: "customBorder",
  beforeDatasetsDraw(chart, args, pluginsOptions) {
    const {
      ctx,
      chartArea: { left, top, right, bottom, width, height },
    } = chart;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.moveTo(left, top);
    ctx.lineTo(right, top);
    ctx.lineTo(right, bottom);
    ctx.lineTo(left, bottom);
    ctx.closePath();
  },
};

// config
const config = {
  type: "bar",
  data,
  options: {
    plugins: {
      customBorder, // bot working
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

const getChart = () => {
  const dayList = ["today", "yesterday", "day 3", "day 4", "day 6", "day 7"];
  const days = dayList.map((day) => {
    return day;
  });
  myChart.config.data.labels = days;
  myChart.update();

  fetchData(accessToken, url).then((products) => {
    const revenue = Object.values(products.dashboard.sales_over_time_week).map(
      (day) => day.total
    );
    myChart.config.data.datasets[0].data = revenue;
    myChart.update();
  });
};
getChart();

const getChart2 = () => {
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

  fetchData(accessToken, url).then((products) => {
    const monthlyRevenue = Object.values(
      products.dashboard.sales_over_time_year
    ).map((month) => month.total);
    myChart2.config.data.datasets[0].data = monthlyRevenue;
    myChart2.update();
  });
};
getChart2();
// setup

bestSellers(url, accessToken);

const logoutUser = document.getElementById("logoutUser");
logoutUser.addEventListener("click", () => logout(accessToken, refreshToken));

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

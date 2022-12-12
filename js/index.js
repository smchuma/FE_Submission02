let accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

if (accessToken == null) {
  window.location.href = "login.html";
}

// function to refresh the token

const xhr = new XMLHttpRequest();
xhr.open("POST", "https://freddy.codesubmit.io/refresh");
xhr.setRequestHeader("Authorization", "Bearer " + refreshToken);
xhr.send("refreshToken" + refreshToken);
xhr.onload = () => {
  const response = JSON.parse(xhr.response);

  if (xhr.status == 200) {
    accessToken = response.access_token;
    localStorage.setItem("accessToken", response.access_token);
  }
};

// function to the data from the API

const loadUser = () => {
  const fetch = new XMLHttpRequest();
  fetch.open("GET", "https://freddy.codesubmit.io/dashboard", true);
  fetch.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  fetch.setRequestHeader("Authorization", "Bearer " + accessToken);

  fetch.send();

  fetch.onload = () => {
    if (fetch.status == 200) {
      // If the response is successful, parse the response as JSON
      const products = JSON.parse(fetch.responseText);
      console.log(products.dashboard);
      const date = new Date();
      const today = date.getDay() + 1;
      const month = date.getMonth() + 1;

      const todayData = products.dashboard.sales_over_time_week[today];
      document.getElementById("today-total").innerText = `$${todayData.total}`;
      document.getElementById(
        "today-orders"
      ).innerText = ` / ${todayData.orders} orders`;

      let sumOrders = 0;
      let sumTotal = 0;

      Object.keys(products.dashboard.sales_over_time_week).forEach((key) => {
        sumOrders += products.dashboard.sales_over_time_week[key].orders;
        sumTotal += products.dashboard.sales_over_time_week[key].total;
      });
      document.getElementById("week-total").innerText = `$${sumTotal}`;
      document.getElementById(
        "week-orders"
      ).innerText = ` / ${sumOrders} orders`;

      // const monthData = products.dashboard.sales_over_time_year[month];

      // Loop through the products and calculate the total orders for each time period
      // const todayTotal = 0;
      // const lastWeekTotal = 0;
      // const lastMonthTotal = 0;
    }
  };
};
loadUser();

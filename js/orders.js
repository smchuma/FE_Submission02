import { fetchRefresh } from "./utils/fetchRefresh.js";
import { fetchData } from "./utils/fetchData.js";
import { logout } from "./utils/logout.js";

let accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const url = "https://freddy.codesubmit.io/orders";
const refreshUrl = "https://freddy.codesubmit.io/refresh";

if (accessToken == null) {
  window.location.href = "login.html";
}

fetchRefresh(refreshUrl, accessToken, refreshToken);

const fetchOrders = (accessToken, url, table) => {
  const tableBody = table.querySelector("tbody");

  fetchData(accessToken, url).then((data) => {
    tableBody.innerHTML = "";
    const { orders, page, total } = data;
    console.log(orders);
    orders.forEach((item) => {
      const row = document.createElement("tr");
      const name = document.createElement("td");
      const date = document.createElement("td");
      const price = document.createElement("td");
      const status = document.createElement("td");

      name.innerHTML = item.product.name;
      date.innerHTML = item.created_at;
      price.innerHTML = null;
      status.innerHTML = item.status;
      if (item.status == "delivered") {
        status.style.color = "green";
      } else if (item.status == "processing") {
        status.style.color = "red";
      }

      row.appendChild(name);
      row.appendChild(date);
      row.appendChild(price);
      row.appendChild(status);

      tableBody.appendChild(row);
    });
  });
};

fetchOrders(accessToken, url, document.querySelector("table"));

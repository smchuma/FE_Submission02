import { fetchRefresh } from "./utils/fetchRefresh.js";
import { logout } from "./utils/logout.js";

let accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const url = "https://freddy.codesubmit.io/orders";
const refreshUrl = "https://freddy.codesubmit.io/refresh";

if (accessToken == null) {
  window.location.href = "login.html";
}
fetchRefresh(refreshUrl, accessToken, refreshToken);

let globalData;
let pageSize = 10;
let currentPage = 1;

//! function to fetch data from the API

async function fetchData() {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  globalData = data.orders;
}

//! function to display data

const table = document.querySelector("table");

const renderTable = async (table) => {
  const tableBody = table.querySelector("tbody");
  await fetchData();
  const data = globalData;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = data.slice(start, end);
  tableBody.innerHTML = "";
  const pageNumber = document.createElement("button");

  pageNumber.innerHTML = currentPage;
  numbers.innerHTML = "";
  numbers.appendChild(pageNumber);

  paginatedItems.forEach((item) => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    const date = document.createElement("td");
    const price = document.createElement("td");
    const status = document.createElement("td");

    name.innerHTML = item.product.name;
    date.innerHTML = null;
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
};

renderTable(table);

const prevPage = async () => {
  if (currentPage > 1) {
    currentPage--;
    await renderTable(table);
  }
};

const nexPage = async () => {
  if (currentPage < Math.ceil(globalData.length / pageSize)) {
    currentPage++;
    await renderTable(table);
  }
};

document.getElementById("prev").addEventListener("click", prevPage);
document.getElementById("next").addEventListener("click", nexPage);

//! function for logout

const logoutUser = document.getElementById("logoutUser");
logoutUser.addEventListener("click", () => logout(accessToken, refreshToken));
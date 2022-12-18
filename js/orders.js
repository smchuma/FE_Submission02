import { fetchRefresh } from "./utils/fetchRefresh.js";
import { fetchData } from "./utils/fetchData.js";
import { logout } from "./utils/logout.js";

let accessToken = localStorage.getItem("accessToken");
const url = "https://freddy.codesubmit.io/orders";

//! checking if accessToken is null

if (accessToken == null) {
  window.location.href = "login.html";
}
fetchRefresh(accessToken);

let pageSize = 10;
let currentPage = 1;
const globalData = await fetchData(url, accessToken);
const data = globalData.orders;

const table = document.querySelector("table");

//! function to display data in table and pagination

const renderTable = async (table) => {
  const tableBody = table.querySelector("tbody");
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

//! buttons for pagination

const prevPage = async () => {
  if (currentPage > 1) {
    currentPage--;
    await renderTable(table);
  }
};

const nexPage = async () => {
  if (currentPage < Math.ceil(data.length / pageSize)) {
    currentPage++;
    await renderTable(table);
  }
};

document.getElementById("prev").addEventListener("click", prevPage);
document.getElementById("next").addEventListener("click", nexPage);

//! search function

const filterSearch = () => {
  const filter = searchInput.value.toUpperCase();
  const tr = table.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      const textValue = td.textContent || td.innerText;
      if (textValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};

const searchInput = document.getElementById("search");
searchInput.addEventListener("keyup", filterSearch);

//! hamburger menu

const menuBtn = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("is-active");
  mobileMenu.classList.toggle("is-active");
});

//! function for logout

const logoutUser = document.getElementById("logoutUser");
const menuLogout = document.getElementById("logoutUser");
logoutUser.addEventListener("click", () => logout());
menuLogout.addEventListener("click", () => logout());

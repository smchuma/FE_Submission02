import { fetchData } from "./utils/fetchData.js";

export const bestSellers = (url, accessToken) => {
  fetchData(accessToken, url).then((products) => {
    const placeholder = document.getElementById("data-output");
    let output = "";
    products.dashboard.bestsellers.forEach((item) => {
      output += `
        <tr>
        <td>${item.product.name}</td>
        <td></td>
        <td>${item.units}</td>
        <td>${item.revenue}</td>
       
        </tr>`;
    });
    placeholder.innerHTML = output;
  });
};

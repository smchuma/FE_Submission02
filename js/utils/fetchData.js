export const fetchData = (accessToken, url) => {
  const promise = new Promise((resolve, reject) => {
    const fetch = new XMLHttpRequest();
    fetch.open("GET", url, true);
    fetch.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    fetch.setRequestHeader("Authorization", "Bearer " + accessToken);
    fetch.send();

    fetch.onload = () => {
      if (fetch.status == 200) {
        // If the response is successful, parse the response as JSON
        const products = JSON.parse(fetch.responseText);
        resolve(products);
      } else {
        reject(fetch.status);
      }
    };
  });
  return promise;
};

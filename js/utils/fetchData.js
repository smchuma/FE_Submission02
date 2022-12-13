export const fetchData = (accessToken) => {
  const promise = new Promise((resolve, reject) => {
    const fetch = new XMLHttpRequest();
    fetch.open("GET", "https://freddy.codesubmit.io/dashboard", true);
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

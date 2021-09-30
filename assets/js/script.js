var searchHistory = document.querySelector("div");
var searchButton = document.getElementById("search-button");
var today = moment().format("[Today: ]MM/DD/YYYY");
$("#today").text(today);

//weather api
function getApi(city_name) {
  var apikey = "0529aa4a52c063407835437742d7e75a";
  var search = document.querySelector("#cityName").value;
  // console.log(city_name);
  // if the input box is empty, shows nothing
  if (search === "" && typeof city_name === "string") {
    search = city_name;
  }
  // else if (search !== typeof city_name){
  //   var cityNotFund = document.querySelector('.cityNotFound')
  //   cityNotFund.classList.remove('hide')
  // }
  else if (search === "") {
    return;
  }
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    search +
    "&appid=" +
    apikey;
  
  stopSearching(search);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apikey}&units=imperial`
      );
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);



      var weatherIcon = document.createElement("img");
      var tempvariable = data.current.weather[0].icon;
      weatherIcon.setAttribute(
        "src",
        "http://openweathermap.org/img/w/" + tempvariable + ".png"
      );
      var iconEl = document.getElementById("icon");
      // stop repeating showing
      iconEl.innerHTML = "";
      iconEl.appendChild(weatherIcon);

      var temp = document.getElementById("temp");
      temp.textContent = "Temp: " + data.current.temp + " ℉";
      //   card.appendChild(temp)
      var wind = document.getElementById("wind");
      wind.textContent = "Wind: " + data.current.wind_speed + " MPH";

      //   card.appendChild(wind)
      var humidity = document.getElementById("humidity");
      humidity.textContent = "Humidity: " + data.current.humidity + " %";

      //   card.appendChild(humidity)
      var uv = document.getElementById("uv");
      var uvBtn = document.createElement("div");
      uvBtn.style.display = "inline";
      uvBtn.style.padding = "0 3px 0 3px";
      uvBtn.style.borderRadius = "5px";
      uvBtn.textContent = data.current.uvi;
      var uvi = data.current.uvi;
      if (uvi <= 2) {
        uvBtn.classList.add("green");
      } else if (uvi <= 5) {
        uvBtn.classList.add("yellow");
      } else if (uvi <= 7) {
        uvBtn.classList.add("orange");
      } else if (uvi <= 10) {
        uvBtn.classList.add("red");
      } else {
        uvBtn.classList.add("purple");
      }

      uv.textContent = "UV Index: ";
      uv.appendChild(uvBtn);
      //   card.appendChild(humidity)
      //   cityWeather.appendChild(card)

      for (var i = 1; i <= 5; i++) {
        var searchResult = document.getElementById("weather" + (i + 0));
        // stop repeating showing
        searchResult.innerHTML = "";
        // Date date from javascript itself
        var date = document.createElement("li");
        date.textContent = new Date(
          data.daily[i].dt * 1000
        ).toLocaleDateString();
        searchResult.appendChild(date);
        // weather icon
        var weatherIcon = document.createElement("img");
        var tempvariable = data.daily[i].weather[0].icon;
        weatherIcon.setAttribute(
          "src",
          "http://openweathermap.org/img/w/" + tempvariable + ".png"
        );
        weatherIcon.classList.add("weatherIcon");
        searchResult.appendChild(weatherIcon);

        var listItem1 = document.createElement("li");
        listItem1.textContent = "Temp: " + data.daily[i].temp.day + " ℉";
        // console.log(data);
        searchResult.appendChild(listItem1);

        var listItem2 = document.createElement("li");
        listItem2.textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
        searchResult.appendChild(listItem2);

        var listItem3 = document.createElement("li");
        listItem3.textContent = "Humidity: " + data.daily[i].humidity + " %";
        searchResult.appendChild(listItem3);

        // 5 day uv index
        var listItem4 = document.createElement("li");
        var listItem4Btn = document.createElement("li");
        listItem4Btn.style.display = "inline";
        listItem4Btn.style.padding = "0 3px 0 3px";
        listItem4Btn.style.borderRadius = "5px";
        listItem4Btn.style.lineHeight = "2em";
        listItem4Btn.textContent = data.daily[i].uvi;
        var uvi2 = data.daily[i].uvi;
        if (uvi2 <= 2) {
          listItem4Btn.classList.add("green");
        } else if (uvi2 <= 5) {
          listItem4Btn.classList.add("yellow");
        } else if (uvi2 <= 7) {
          listItem4Btn.classList.add("orange");
        } else if (uvi2 <= 10) {
          listItem4Btn.classList.add("red");
        } else {
          listItem4Btn.classList.add("purple");
        }
        listItem4.textContent = "UV Index: ";
        searchResult.appendChild(listItem4);
        searchResult.appendChild(listItem4Btn);
      }
    });
}

searchButton.addEventListener("click", getApi);


function stopSearching(city) {
  // var searchHistory  = localStorage.getItem("search") || [];
  var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  searchHistory.push(city);
  // var city = document.getElementById("name");
  // city.textContent = searchHistory[5];
  // console.log(searchHistory)
  // history no more than 5 items
  searchHistory = searchHistory.splice(- 5);

  // localStorage.setItem("search", city);
  localStorage.setItem("search", JSON.stringify(searchHistory));
  showHistory();
}

function showHistory() {
  var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  var historyEl = document.getElementById("seachHistory");
  // stop repeating showing
  historyEl.innerHTML = "";
  for (i = 0; i < searchHistory.length; i++) {
    var historyItem = document.createElement("div");
    historyItem.classList.add("historyItem");
    historyItem.textContent = searchHistory[i];
    historyItem.style.textTransform = "capitalize";
    //Click history item to get the city weather data
    historyItem.addEventListener("click", function (event) {
      getApi(event.target.textContent);
    });
    historyEl.appendChild(historyItem);
  }
}
showHistory();
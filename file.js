/* Create request to receive information about teddies from the server*/
const request = new XMLHttpRequest();
const url='http://localhost:3000/api/teddies';
request.open("GET", url);
request.send();

request.onreadystatechange = function(){
  /* If the request works, retrieve, parse and store information in the response variable*/
  if(this.readyState == XMLHttpRequest.DONE && this.status == 200){
      var response = JSON.parse(request.responseText);
      /* for each teddy in the response, extract and name in a variable its name, price, image url, description and colors*/
      for (var i = 0; 1 < response.length; i++){
        let teddy = response[i];
        let teddyInfo = {
          teddyName: teddy.name,
          teddyPrice: teddy.price,
          teddyUrl: teddy.imageUrl,
          teddyDescription: teddy.description,
          teddyColors: teddy.colors
        }
        /*create an array to store the TeddyInfo objects in */
        var Teddies = [];
        /* add the TeddyInfo object to the array*/
        Teddies.push(teddyInfo);

        /*create new card with the necessary information for the vue page*/
        const main = document.getElementById("main-vue");

        const newCard = document.createElement("div");
        main.appendChild(newCard);
        /* add the content from the server to the new card*/
        newCard.innerHTML = '<div class="card m-2"\>\
                              <div class="card-body pb-0"\>\
                                <div class="img-size">\
                                <img class="card-img-top mb-2" src="' + teddyInfo.teddyUrl + '" alt=""\>\
                                </div>\
                                <div class="card-text row mb-0 py-2"\>\
                                  <h2 class="col my-auto">' +  teddyInfo.teddyName + '</h2\>\
                                  <p class="col text-right my-auto ml-auto">' +  teddyInfo.teddyPrice + ' € </p\>\
                                </div\>\
                              </div\>\
                            </div\>'
      }
  }
}


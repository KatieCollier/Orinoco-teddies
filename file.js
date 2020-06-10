/* create a function containing a request to retrieve teddy data */
var getInfo = function(url, success){
  var request = new window.XMLHttpRequest();

  request.onreadystatechange = function(){
      if(this.readyState == 4){
          success(request.responseText);
  }
}
request.open("GET", url, true );
request.send();
}

/*create a function that only runs once the getInfo function has been completed
This function creates a new card for each teddy and fills it with the corresponding data*/
var createCard = function () {
  getInfo('http://localhost:3000/api/teddies', function (response) {
      var Teddies = JSON.parse(response);
      const main = document.getElementById("main-vue");
      for (let i = 0; i < Teddies.length; i++) {/* for each teddy in the server*/
          /*create new card with the necessary information for the vue page*/
          const newCard = document.createElement("div");
          main.appendChild(newCard);
          /* add the content from the server to the new card*/
          newCard.innerHTML = '<div class="card m-2"\>\
                                <div class="card-body pb-0"\>\
                                  <div class="img-size">\
                                    <img class="card-img-top mb-2" src="' + Teddies[i].imageUrl + '" alt=""\>\
                                  </div>\
                                  <div class="card-text row mb-0 py-2"\>\
                                    <a id="card-' + i + '"class="stretched-link" href="product.html">\
                                      <h2 class="col my-auto">' +  Teddies[i].name + '</h2\>\
                                    </a>\
                                    <p class="col text-right my-auto ml-auto">' +  Teddies[i].price + ' € </p\>\
                                  </div\>\
                                </div\>\
                              </div\>';
      }
  });
}

/* Create a function to identify which teddy is clicked on in the vue page
Save teddy number to session storage for future use in filling out product page*/
const goToProduct = function(){
  const main = document.getElementById("main-vue");
  main.addEventListener("click", function(event){
    console.log(event.target.id, "was clicked!");
    let j = parseInt(event.target.id.replace("card-",""));
    console.log(j);
    sessionStorage.setItem("clickedTeddy", j);
  })
}

/*run the create card function only on the vue page*/
if (document.getElementById("main-vue")){
  createCard();
  goToProduct();
}

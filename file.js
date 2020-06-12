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

/*create function to give product details in the product page depending on the clicked on teddy*/
var giveProductDetails = function(){
  /*This function needs the teddy info to work, so get that first*/
  getInfo('http://localhost:3000/api/teddies', function(response){
    var Teddies = JSON.parse(response);
    /*this function needs the clickedTeddy nb from the session storage*/
    let j = parseInt(sessionStorage.getItem("clickedTeddy"));
    console.log(j);
    /*use clickedTeddy nb to fill in the different fields*/
    /*Photo*/
    let productPhoto = document.getElementById("product-photo");
    productPhoto.innerHTML = "<img src=\"" + Teddies[j].imageUrl + "\" alt=\"\">";
    /*Name*/
    let productName = document.getElementById("product-name");
    productName.innerHTML = Teddies[j].name;
    /*Price*/
    let productPrice = document.getElementById("product-price");
    productPrice.innerHTML = Teddies[j].price + " €";
    /*Description*/
    let productDescription = document.getElementById("product-description");
    productDescription.innerHTML = "<strong> Description: </strong>" + Teddies[j].description;
    /*Color*/
    let productColor = document.getElementById("product-color");
    /*Create an option for each color listed by the server*/
    let colors = Teddies[j].colors;
    for (let k=0; k<colors.length; k++){
      let color = colors[k];
      let newOption = document.createElement("option");
      productColor.appendChild(newOption);
      /*will need a "translation" for the colors*/
      let frenchColor = "Non défini";
      switch(color){
        case "Brown":
          frenchColor = "Marron";
          break;
        case "Tan":
          frenchColor = "Roux";
          break;
        case "Chocolate":
          frenchColor = "Chocolat";
          break;
        case "White":
          frenchColor = "Blanc";
          break;
        case "Pale brown":
          frenchColor = "Marron clair";
          break;
        case "Dark brown":
          frenchColor = "Marron foncé";
          break;
        case "Blue":
          frenchColor = "Bleu";
          break;
        case "Pink":
          frenchColor = "Rose";
          break;
        case "Black":
          frenchColor = "Noir";
          break;
        case "Beige":
          frenchColor = "Beige";
          break;
      }
      newOption.value = color;
      newOption.innerHTML = frenchColor;
    }
  })
}

/*run the give ProductDetails function only on the product page
if(document.getElementById("main-product")){
  giveProductDetails();
}*/


/*###########################################################*/

/*create a function that collects necessary info for basket when you click on "Ajouter au panier"*/
let addBasket = function(){
  getInfo('http://localhost:3000/api/teddies', function(response){
    var Teddies = JSON.parse(response);
    console.log(Teddies);
    let btnAddBasket = document.getElementById("add-to-basket");
    btnAddBasket.addEventListener("click",function(event){
      /*add necessary info to local storage*/
      /*Teddy id and quantity of teddies bought*/
      let j = parseInt(sessionStorage.getItem("clickedTeddy"));/*get number of teddy in array that is still in session storage*/
      let teddyBought = Teddies[j]._id;
      let quantity = document.getElementById("product-quantity").value;
      localStorage.setItem(teddyBought, quantity);
    })
  } 
  )
}

/*run the give ProductDetails function only on the product page*/
if(document.getElementById("main-product")){
  giveProductDetails();
  addBasket();
}

/*create function to complete basket page*/
let fillBasket = function(){
  /*can only complete basket when we already have teddy info*/
  getInfo('http://localhost:3000/api/teddies', function(response){
    var Teddies = JSON.parse(response);
    let basketItems = document.getElementById("items");
    let keys = Object.keys(localStorage);/* get all keys stored in local storage*/
    let basketTotal = 0;
    for(let l=0; l<keys.length; l++){
      let key = keys[l];
      for(let m=0; m<Teddies.length; m++){
        let teddy = Teddies[m];
        if(key == teddy._id){
          let teddyQuantity = parseInt(localStorage.getItem(key));
          let itemTotalPrice = teddyQuantity * teddy.price;
          let basketItem = document.createElement("div");
          basketItems.appendChild(basketItem);
          basketItem.innerHTML = "<div class=\"row\">\
          <div class=\"col-2 article-miniature\">\
              <a href=\Need URL here\">\
                  <img src=" + teddy.imageUrl +" alt=\"\">\
              </a>\
          </div>\
          <div class=\"col article-info\">\
              <div class=\"row\">\
              <div class=\"basket-article col\">\
                  <a href=\"need URL here\">\
                  <p>" + teddy.name + "</p>\
                  </a>\
              </div>\
              <div class=\"article-price col\">\
                  <p>" + teddy.price + " € </p>\
              </div>\
              <div class=\"article-quantity col choice-group m-3\">\
                  <input type=\"number\" name=\"article-quantity\" value=\"" + teddyQuantity + "\" class=\"input-number row\">\
              </div>\
              <div class=\"article-total col\">\
                  <p>" + itemTotalPrice + " € </p>\
              </div>\
          </div>\
          </div>\
      </div>" 
          basketTotal = basketTotal + itemTotalPrice;
        } 
      }
    }
    let basketTotalPrice = document.getElementById("basket-total-price");
    basketTotalPrice.innerHTML = basketTotal + " €";
  })
}

if(document.getElementById("main-basket")){
  fillBasket();
}



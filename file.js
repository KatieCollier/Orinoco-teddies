/* Get teddy info from the server and store it in an easily usable array*/
const getInfo = async function(){
  let response = await fetch('http://localhost:3000/api/teddies')
  if(response.ok){
    let Teddies = await response.json()
    return Teddies
  }
}

/*####################################################*/
/*functions relating to the vue page*/
/* create a custon HTML element in which to insert the info for each teddy*/
class TeddyCard extends HTMLElement{
  connectedCallback(){
    this.innerHTML = '<div class="card m-2"\>\
                        <div class="card-body pb-0"\>\
                          <div class="img-size">\
                          </div>\
                          <div class="card-text row mb-0 py-2"\>\
                            <a class="stretched-link" href="product.html">\
                              <h2 class="teddy-name col my-auto"> Name </h2\>\
                            </a>\
                            <p class="teddy-price col text-right my-auto ml-auto"> Price </p\>\
                          </div\>\
                        </div\>\
                      </div\>';
  }
}

customElements.define('teddy-card', TeddyCard);

/*create a function that loops through all the teddies and fills out a card for each one*/
const createCards = async function(){
    let Teddies = await getInfo();
    let main = document.getElementById("main-vue");
    for(t=0; t<Teddies.length; t++){
      let newCard = document.createElement("teddy-card");
      main.appendChild(newCard);
      let image = document.querySelectorAll(".img-size");
      image[t].innerHTML = "<img class=\"card-img-top mb-2\" src=\"" + Teddies[t].imageUrl + "\" alt=\"\">" ;
      let teddyName = document.querySelectorAll(".teddy-name");
      teddyName[t].innerHTML = Teddies[t].name;
      let teddyPrice = document.querySelectorAll(".teddy-price");
      teddyPrice[t].innerHTML = Teddies[t].price + " €";
      let link = document.querySelectorAll(".stretched-link");
      link[t].id = "card-" + t;
    }
    
}

/* Create a function to identify which teddy is clicked on in the vue page
  Save teddy number to session storage for future use in filling out product page*/
  const goToProduct = async function(){
    let Teddies = await getInfo();
    let main = document.getElementById("main-vue");
    main.addEventListener("click", function(event){
      let j = parseInt(event.target.id.replace("card-",""));
      sessionStorage.setItem("clickedTeddy", Teddies[j]._id);     
    })
  }

  /* run the vue page function only on the vue page*/
  if(document.getElementById("main-vue")){
    createCards()
    goToProduct()
  }
 

  /*#######################################################*/
  /*Functions for the product page*/
  /*create a function for color translation that will be needed later*/
  const colorTranslation = function(color){
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
        return frenchColor
  }

/* create a function to complet the teddy details in the teddy page*/
const giveTeddyDetails = async function(){
  let Teddies = await getInfo();
  for (i=0; i<Teddies.length; i++){
    let teddy = Teddies[i];
    let clickedTeddy = sessionStorage.getItem("clickedTeddy");
    if(teddy._id == clickedTeddy){
      let productPhoto = document.getElementById("product-photo");
      productPhoto.innerHTML = "<img src=\"" + teddy.imageUrl + "\" alt=\"\">";
      let productName = document.getElementById("product-name");
      productName.innerHTML = teddy.name;
      let productPrice = document.getElementById("product-price");
      productPrice.innerHTML = teddy.price + " €";
      let productDescription = document.getElementById("product-description");
      productDescription.innerHTML = "<strong> Description: </strong>" + teddy.description;
      let productColor = document.getElementById("product-color");
      let colors = teddy.colors;
      for (let k=0; k<colors.length; k++){
        let color = colors[k];
        let newOption = document.createElement("option");
        productColor.appendChild(newOption);
        newOption.value = color;
        newOption.innerHTML = colorTranslation(color);
      }
    }
  }
}

/*change url depending on the teddy shown -- ISSUES*/
const changeURL = function(){
    let clickedTeddy = sessionStorage.getItem("clickedTeddy");
    let url = new URL(window.location.href);
    let search_param = url.searchParams;
    search_param.set("id", clickedTeddy);
    let newUrl = url.toString();
    window.location.href = newUrl;
}

/*create a function that collects necessary info from the product page to add to basket*/
let addToBasket = function(){
  let btnAddBasket = document.getElementById("add-to-basket");
  btnAddBasket.addEventListener("click", function(event){
    let teddyBought = sessionStorage.getItem("clickedTeddy");
    let quantity = parseInt(document.getElementById("product-quantity").value);
    if(localStorage.getItem(teddyBought)){
      let prevQuantity = parseInt(localStorage.getItem(teddyBought));
      localStorage.setItem(teddyBought, prevQuantity+quantity);
    } else {
      localStorage.setItem(teddyBought, quantity);
    }
  })
}

if(document.getElementById("main-product")){
  giveTeddyDetails();
  /*changeURL();*/
  addToBasket();
}

/*###########################################################*/
/*Functions for the basket page*/
/* create a custom HTML object for the besket items*/
class BasketItem extends HTMLElement{
  connectedCallback(){
    this.innerHTML = "<div class=\"item row m-3 pb-2\">\
                        <div class=\"col-2 article-miniature\">\
                          <a class=\"img-min\" href=\Need URL here\">\
                          </a>\
                        </div>\
                        <div class=\"col article-info m-3\">\
                          <div class=\"row align-items-center\">\
                            <div class=\"basket-article col\">\
                              <a href=\"need URL here\">\
                                <p class=\"order-teddy-name\">  </p>\
                              </a>\
                            </div>\
                            <div class=\"article-price col\">\
                              <p class=\"order-teddy-price\">  </p>\
                            </div>\
                            <div class=\"article-quantity col choice-group\">\
                              <input type=\"number\" name=\"article-quantity\" value=\"1\" class=\"input-number row\">\
                            </div>\
                            <div class=\"article-total col text-right\">\
                              <p> Total price of items € </p>\
                            </div>\
                          </div>\
                        </div>\
                      </div>" 
  }
}

customElements.define('basket-item', BasketItem);

/*Create function to:
fill in basket from add to basket buttons on order page
give the quantity of items ordered - can be updated directly on the basket page
give the total price per item - is updated if the quantity changes
give the totla price of the order - is updated if the quantities of an item change*/
const fillBasket = async function(){
  let Teddies = await getInfo();
  let items = document.getElementById("items");
  let keys = Object.keys(localStorage);
  let basketTotal = 0;
  for(let l=0; l<keys.length; l++){
    let key = keys[l];
    let newBasketItem = document.createElement("basket-item");
    items.appendChild(newBasketItem);
    for (let m=0; m<Teddies.length; m++){
      let teddy = Teddies[m];
      if(teddy._id == key){
        let imgMin = document.querySelectorAll(".img-min");
        imgMin[l].innerHTML = "<img src=\"" + teddy.imageUrl + "\" alt=\"\">";
        let orderTeddyName = document.querySelectorAll(".order-teddy-name");
        orderTeddyName[l].innerHTML = teddy.name;
        let orderTeddyPrice = document.querySelectorAll(".order-teddy-price");
        orderTeddyPrice[l].innerHTML = teddy.price + " €";
        let orderTeddyQuantity = document.querySelectorAll(".input-number");
        orderTeddyQuantity[l].value = parseInt(localStorage.getItem(key));
        let articleTotal = document.querySelectorAll(".article-total");
        let articleTotalPrice = teddy.price*orderTeddyQuantity[l].value;
        articleTotal[l].innerHTML = articleTotalPrice + " €";
        basketTotal = basketTotal + articleTotalPrice;
        orderTeddyQuantity[l].addEventListener("change", function(event){
          localStorage.setItem(teddy._id, orderTeddyQuantity[l].value);
          articleTotalPrice = teddy.price*orderTeddyQuantity[l].value;
          articleTotal[l].innerHTML = articleTotalPrice + " €";
        })
      } 
    } 
  }
  let basketTotalPrice = document.getElementById("basket-total-price");
  basketTotalPrice.innerHTML = "Prix total:  " + basketTotal + " €";
  items.addEventListener("change", function(event){
    let articleTotal = document.querySelectorAll(".article-total");
    let basketTotal = 0;
    for(let h=0; h<articleTotal.length; h++){
      let articlePrice = articleTotal[h].innerHTML;
      let nbArticlePrice = parseInt(articlePrice.replace(" €",""));
      basketTotal = basketTotal + nbArticlePrice;
      basketTotalPrice.innerHTML = "Prix total:  " + basketTotal + " €";
    }
  })
}

/*create function to get order info to later use in the POST request*/
const orderInfo = function(){
  let products = [];/* array with product IDs*/
  let keys = Object.keys(localStorage);
  for (let k=0; k<keys.length; k++){
    let key = keys[k];
    let qty = parseInt(localStorage.getItem(key));
    for(let q=0; q<qty; q++){
      products.push(key);
    }
  }
  let jsonProducts = "\"products\": " + JSON.stringify(products)

  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  }
  let jsonContact = "\"contact\": " + JSON.stringify(contact);

  let order = "{" + jsonContact + "," + jsonProducts + "}";
  return order
}

/*create function to send order and retrieve order id*/
const sendOrder = async function(data){
  let order = await orderInfo();
  let response = await fetch("http://localhost:3000/api/teddies/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: order
  })
  if(response.ok){
    let data= await response.json();
    let orderId = data.orderId;
    localStorage.setItem("orderID", orderId)
  }else{
    alert("Nous rencontrons actuellement une erreur avec notre système. Veuillez réessayer plus tard. Nous sommes désolés de ce contre-temps.")
  }
}


/*run basket page functions only for the basket page*/
if(document.getElementById("main-basket")){
  fillBasket();
}

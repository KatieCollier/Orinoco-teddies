const request = new XMLHttpRequest();
const url='http://localhost:3000/api/teddies';
request.open("GET", url);
request.send();

request.onreadystatechange = function(){
  if(this.readyState == XMLHttpRequest.DONE && this.status == 200){
      var response = JSON.parse(request.responseText);
      console.log(response);
      var teddyName = document.getElementById("teddy-name");
      teddyName.innerHTML = response[0].name;
      console.log(teddyName);
      var teddyImg = document.getElementById("teddy-img");
      teddyImg.innerHTML = "src=\"" + response[0].imageUrl +"\" alt=\"\"" ;
      console.log(teddyImg);
      console.log(response[0].imageUrl);
  }
}


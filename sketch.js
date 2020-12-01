var feedPet,addFood,fedTime,lastFed,foodObj,foodStock,milkBottle,milk,readState;
var bedroom,garden,washroom,gameState,currentTime
function preload()
{
  dogImg=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png")
  bedroom=loadImage("images/Room.png")
  garden=loadImage("images/Garden.png")
  washroom=loadImage("images/WashRoom.png")
 // milkBottle=loadImage("images/Milk.png")
	//load images here
}

function setup() {
  database = firebase.database();
  //console.log(database);
  createCanvas(550, 500);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  
  foodObj=new Food();

  dog=createSprite(400,300,100,100)
  dog.addImage(dogImg)
  dog.scale=0.2
  
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feedPet= createButton("Feed the dog")
  feedPet.position(700,95)
  feedPet.mousePressed(feedDog);
  
 

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods)
}


function draw() {
  background(46,139,87)
  
  fedTime=database.ref('lastFedTime');
  fedTime.on("value",function(data){
    lastFed=data.val()  
  });

  fill(255,255,254)
  textSize(15)
 
  if(lastFed>=12){
    text("Last Feed:"+lastFed%12+"PM",350,30)
  }
  else if(lastFed===0){
    text("Last Feed:12 AM",350,30) 
  }
  else{
    text("Last Feed:"+lastFed+"AM",350,30)

  }
  if(gameState!="Hungry"){
    feedPet.hide();
    addFood.hide();
    dog.remove();
  }else{
    feedPet.show();
     addFood.show();
     dog.addImage(dogImg);
  }
  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("Playing")
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washroom();
  }else {
    update("Hungry")
    foodObj.display();
  }
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);

}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    lastFedTime:hour(),
    gameState: "Hungry"
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({

  Food:foodS

  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })


}
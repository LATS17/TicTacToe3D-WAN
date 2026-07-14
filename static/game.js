const socket = io();


let jugador="X";


let tablero=document.getElementById("tablero");



for(let z=0;z<4;z++){

for(let y=0;y<4;y++){

for(let x=0;x<4;x++){


let boton=document.createElement("button");


boton.className="casilla";


boton.dataset.x=x;
boton.dataset.y=y;
boton.dataset.z=z;


boton.onclick=function(){


socket.emit(
"movimiento",
{
x:x,
y:y,
z:z
}
);


};


tablero.appendChild(boton);



}

}

}



socket.on(
"actualizar_tablero",
function(data){


let botones=document.querySelectorAll(".casilla");


for(let b of botones){


if(
b.dataset.x==data.x &&
b.dataset.y==data.y &&
b.dataset.z==data.z
){

b.innerHTML=data.simbolo;

}


}



}
);



socket.on(
"mensaje",
function(msg){

document.getElementById("estado").innerHTML=msg;

}
);
const socket=io();


let tablero=document.getElementById("tablero");


let lineaGanadora=[];



for(let z=3;z>=0;z--){


let capa=document.createElement("div");

capa.className="capa";


let titulo=document.createElement("h3");

titulo.innerHTML="Z = "+z;


capa.appendChild(titulo);



let plano=document.createElement("div");

plano.className="plano";



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



plano.appendChild(boton);



}

}



capa.appendChild(plano);


tablero.appendChild(capa);



}




socket.on(
"actualizar",
(data)=>{


let botones=document.querySelectorAll(".casilla");



botones.forEach(b=>{


if(

b.dataset.x==data.x &&

b.dataset.y==data.y &&

b.dataset.z==data.z

){


b.innerHTML=data.jugador;


b.classList.add(

data.jugador=="X"

?"x"

:"o"

);


}



});



document.getElementById("coordenadas").innerHTML=

"Última jugada: X="+data.x+
" Y="+data.y+
" Z="+data.z;



if(data.ganador){


document.getElementById("mensaje").innerHTML=

"🏆 Jugador "+data.ganador+" GANÓ";


marcarLinea(data.linea);



}

else{


document.getElementById("turno").innerHTML=

"Turno: "+data.turno;



}



});





function marcarLinea(linea){


let botones=document.querySelectorAll(".casilla");


linea.forEach(p=>{


botones.forEach(b=>{


if(

b.dataset.x==p.x &&

b.dataset.y==p.y &&

b.dataset.z==p.z

)

{

b.classList.add("ganadora");

}


});


});


}





socket.on(
"error",
(msg)=>{

alert(msg);

});





socket.on(
"reiniciado",
()=>{


location.reload();


});




function reiniciar(){


socket.emit(
"reiniciar"
);


}



function salir(){


window.close();


}
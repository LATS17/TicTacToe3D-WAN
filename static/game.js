
const socket = io();



// CREAR TABLERO 4x4x4

const tablero = document.getElementById("tablero");



for(let z = 0; z < 4; z++){


    let capa = document.createElement("div");

    capa.className="capa";



    let titulo=document.createElement("h3");

    titulo.innerHTML="NIVEL Z = "+z;


    capa.appendChild(titulo);




    let plano=document.createElement("div");

    plano.className="plano";





    for(let y=0;y<4;y++){


        for(let x=0;x<4;x++){



            let casilla=document.createElement("button");


            casilla.className="casilla";


            casilla.dataset.x=x;

            casilla.dataset.y=y;

            casilla.dataset.z=z;





            casilla.onclick=function(){



                socket.emit(

                    "movimiento",

                    {

                        x:x,

                        y:y,

                        z:z

                    }

                );


            };




            plano.appendChild(casilla);


        }


    }





    capa.appendChild(plano);


    tablero.appendChild(capa);


}




// ACTUALIZACION DE MOVIMIENTOS



socket.on(

"actualizar",

(data)=>{



    colocarFicha(data);





    actualizarTurno(data.turno);




    document.getElementById("coordenadas").innerHTML=


    `X=${data.x}
     Y=${data.y}
     Z=${data.z}`;





    mostrarMensaje(data.mensaje);






    if(data.linea){



        marcarVictoria(data.linea);



        mostrarGanador(data.ganador);



    }



});






// COLOCAR FICHA


function colocarFicha(data){



    let casillas=

    document.querySelectorAll(".casilla");



    casillas.forEach((casilla)=>{



        if(

            casilla.dataset.x==data.x &&

            casilla.dataset.y==data.y &&

            casilla.dataset.z==data.z

        ){



            casilla.innerHTML=data.jugador;



            casilla.classList.add(

                data.jugador=="X"

                ?

                "x"

                :

                "o"

            );



        }



    });



}




// ESTADO DE JUGADORES



socket.on(

"estado_jugadores",

(data)=>{



    document.getElementById("jugadores").innerHTML=


    data.jugadores+" / 2";




    document.getElementById("estado").innerHTML=


    data.estado;



    if(data.jugadores==2){


        document.getElementById("estado")

        .classList.add("online");


    }



});





// CAMBIO DE TURNO



function actualizarTurno(jugador){



    let elemento=

    document.getElementById("turno");



    elemento.innerHTML=

    "Jugador "+jugador;



    elemento.style.transition=".3s";




    if(jugador=="X"){


        elemento.style.color="#38bdf8";


        elemento.style.textShadow=

        "0 0 20px #38bdf8";


    }

    else{


        elemento.style.color="#fb7185";


        elemento.style.textShadow=

        "0 0 20px #fb7185";


    }


}







// MENSAJES


function mostrarMensaje(texto){



    let mensaje=

    document.getElementById("mensaje-final");



    mensaje.innerHTML=texto;



    mensaje.style.animation="none";



    setTimeout(()=>{


        mensaje.style.animation="";


    },10);



}



// RESALTAR VICTORIA



function marcarVictoria(linea){



    let casillas=

    document.querySelectorAll(".casilla");




    linea.forEach((posicion)=>{



        casillas.forEach((casilla)=>{



            if(

                casilla.dataset.x==posicion.x &&

                casilla.dataset.y==posicion.y &&

                casilla.dataset.z==posicion.z

            ){



                casilla.classList.add(

                    "ganadora"

                );



            }



        });



    });



}





// MOSTRAR GANADOR



function mostrarGanador(jugador){



    let mensaje=

    document.getElementById("mensaje-final");



    mensaje.innerHTML=


    "GANADOR: JUGADOR "+jugador;



    mensaje.style.color="#facc15";



}



// ERRORES



socket.on(

"error",

(mensaje)=>{


    mostrarMensaje(

        mensaje

    );


});






// REINICIO


socket.on(

"reiniciado",

()=>{


    limpiarTablero();


});






function reiniciar(){



    socket.emit(

        "reiniciar"

    );


}









function limpiarTablero(){



    let casillas=

    document.querySelectorAll(".casilla");



    casillas.forEach((casilla)=>{



        casilla.innerHTML="";


        casilla.classList.remove("x");


        casilla.classList.remove("o");


        casilla.classList.remove("ganadora");



    });





    document.getElementById("turno").innerHTML=

    "Jugador X";



    document.getElementById("coordenadas").innerHTML=

    "X=- Y=- Z=-";



    document.getElementById("mensaje-final").innerHTML="";



}




// SALIR


function salir(){


    window.close();


}

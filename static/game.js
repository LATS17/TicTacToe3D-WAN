const socket = io();


const tablero = document.getElementById("tablero");



function crearTablero(){


    tablero.innerHTML = "";


    for(let z = 0; z < 4; z++){


        const capa = document.createElement("div");

        capa.className = "capa";



        const titulo = document.createElement("h3");

        titulo.innerText = "NIVEL Z = " + z;


        capa.appendChild(titulo);



        const plano = document.createElement("div");

        plano.className = "plano";




        for(let y = 0; y < 4; y++){


            for(let x = 0; x < 4; x++){



                const casilla = document.createElement("button");


                casilla.className = "casilla";


                casilla.dataset.x = x;

                casilla.dataset.y = y;

                casilla.dataset.z = z;




                casilla.onclick = function(){



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


}




crearTablero();







socket.on(

"actualizar",

(data)=>{


    colocarFicha(data);



    if(data.turno){

        actualizarTurno(data.turno);

    }



    actualizarCoordenadas(data);





    if(data.linea){


        mostrarVictoria(data);


    }



    if(data.mensaje){


        mostrarMensaje(data.mensaje);


    }



});








function colocarFicha(data){



    const casillas =

    document.querySelectorAll(".casilla");





    casillas.forEach(casilla=>{



        if(

            casilla.dataset.x == data.x &&

            casilla.dataset.y == data.y &&

            casilla.dataset.z == data.z

        ){



            casilla.innerText = data.jugador;



            casilla.classList.add(

                data.jugador === "X"

                ?

                "x"

                :

                "o"

            );



        }



    });



}









socket.on(

"estado_jugadores",

(data)=>{


    const jugadores =

    document.getElementById("jugadores");


    const estado =

    document.getElementById("estado");



    if(jugadores){

        jugadores.innerText =

        data.jugadores + " / 2";

    }




    if(estado){


        estado.innerText = data.estado;



        if(data.jugadores === 2){


            estado.style.color="#22c55e";


        }

        else{


            estado.style.color="#facc15";


        }


    }


});









function actualizarTurno(jugador){



    const turno =

    document.getElementById("turno");



    if(!turno)
        return;




    turno.innerText =

    "Jugador " + jugador;





    if(jugador === "X"){



        turno.style.color="#38bdf8";


        turno.style.textShadow=

        "0 0 20px #38bdf8";


    }

    else{


        turno.style.color="#fb7185";


        turno.style.textShadow=

        "0 0 20px #fb7185";


    }



}









function actualizarCoordenadas(data){



    const coordenadas =

    document.getElementById("coordenadas");



    if(coordenadas){


        coordenadas.innerText =

        "X=" + data.x +

        " Y=" + data.y +

        " Z=" + data.z;


    }


}









function mostrarVictoria(data){



    data.linea.forEach(posicion=>{



        document

        .querySelectorAll(".casilla")

        .forEach(casilla=>{



            if(

                casilla.dataset.x == posicion.x &&

                casilla.dataset.y == posicion.y &&

                casilla.dataset.z == posicion.z

            ){



                casilla.classList.add(

                    "ganadora"

                );


            }



        });



    });



}









function mostrarMensaje(texto){



    const mensaje =

    document.getElementById("mensaje-final");



    if(mensaje){


        mensaje.innerText = texto;


    }



}









socket.on(

"error",

(mensaje)=>{


    mostrarMensaje(mensaje);


});









// CORREGIDO:
// Flask envía "reiniciado"

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



    document

    .querySelectorAll(".casilla")

    .forEach(casilla=>{


        casilla.innerText = "";



        casilla.classList.remove(

            "x",

            "o",

            "ganadora"

        );



        casilla.disabled=false;



    });






    const coordenadas =

    document.getElementById("coordenadas");



    if(coordenadas){


        coordenadas.innerText=

        "X=- Y=- Z=-";


    }







    const mensaje =

    document.getElementById("mensaje-final");



    if(mensaje){


        mensaje.innerText="";


    }







    actualizarTurno("X");


}









function salir(){



    window.location.href="/";


}

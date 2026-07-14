const socket = io();


// ======================================
// CREAR TABLERO 4x4x4
// ======================================


const tablero = document.getElementById("tablero");



for(let z = 0; z < 4; z++){


    let capa = document.createElement("div");

    capa.className = "capa";



    let titulo = document.createElement("h3");

    titulo.innerHTML = "Nivel Z = " + z;


    capa.appendChild(titulo);



    let plano = document.createElement("div");

    plano.className = "plano";




    for(let y = 0; y < 4; y++){


        for(let x = 0; x < 4; x++){



            let boton = document.createElement("button");


            boton.className = "casilla";


            boton.dataset.x = x;

            boton.dataset.y = y;

            boton.dataset.z = z;




            boton.onclick = function(){



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







// ======================================
// ACTUALIZAR MOVIMIENTO
// ======================================


socket.on(

    "actualizar",

    function(data){



        let botones =
        document.querySelectorAll(".casilla");



        botones.forEach(function(boton){



            if(

                boton.dataset.x == data.x &&

                boton.dataset.y == data.y &&

                boton.dataset.z == data.z

            ){


                boton.innerHTML =
                data.jugador;



                if(data.jugador=="X"){


                    boton.classList.add("x");


                }

                else{


                    boton.classList.add("o");


                }



            }



        });





        document.getElementById("turno").innerHTML =

        "Jugador " + data.turno;






        document.getElementById("coordenadas").innerHTML =


        "X=" + data.x +

        " Y=" + data.y +

        " Z=" + data.z;







        document.getElementById("estado").innerHTML =

        data.mensaje;






        // Si hay ganador

        if(data.linea){


            marcarGanador(data.linea);


            document.getElementById("mensaje-final").innerHTML =

            "Ganador: Jugador " + data.ganador;


        }




    }

);









// ======================================
// ESTADO DE JUGADORES
// ======================================


socket.on(

    "estado_jugadores",

    function(data){



        document.getElementById("jugadores").innerHTML =

        data.jugadores + " / 2";



        document.getElementById("estado").innerHTML =

        data.estado;




    }

);









// ======================================
// MARCAR LINEA GANADORA
// ======================================


function marcarGanador(linea){



    let botones =
    document.querySelectorAll(".casilla");



    linea.forEach(function(posicion){



        botones.forEach(function(boton){



            if(

                boton.dataset.x == posicion.x &&

                boton.dataset.y == posicion.y &&

                boton.dataset.z == posicion.z

            ){


                boton.classList.add(
                    "ganadora"
                );


            }



        });



    });



}







// ======================================
// ERROR
// ======================================


socket.on(

    "error",

    function(mensaje){


        alert(mensaje);


    }

);







// ======================================
// REINICIO
// ======================================


socket.on(

    "reiniciado",

    function(){


        location.reload();


    }

);





function reiniciar(){


    socket.emit(
        "reiniciar"
    );


}






// ======================================
// SALIR
// ======================================


function salir(){


    window.close();


}
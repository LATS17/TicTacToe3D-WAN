const socket = io();



const tablero = document.getElementById("tablero");





let jugadorActual = "";





function crearTablero(){


    tablero.innerHTML="";


    for(let z = 0; z < 4; z++){


        let capa=document.createElement("div");

        capa.className="capa";


        let titulo=document.createElement("h3");

        titulo.innerText="NIVEL Z = "+z;


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



                    realizarMovimiento(
                        x,
                        y,
                        z
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









function realizarMovimiento(x,y,z){


    socket.emit(

        "movimiento",

        {

            x:x,

            y:y,

            z:z

        }

    );


}









socket.on(

"actualizar",

(data)=>{


    colocarFicha(data);



    if(data.turno){


        actualizarTurno(
            data.turno
        );


    }



    if(data.x!==undefined){


        actualizarCoordenadas(data);


    }





    if(data.linea){


        mostrarVictoria(data);


    }



    if(data.mensaje){


        mostrarMensaje(
            data.mensaje
        );


    }



});









function colocarFicha(data){



    let casillas=

    document.querySelectorAll(".casilla");





    casillas.forEach(casilla=>{



        if(

            casilla.dataset.x==data.x &&

            casilla.dataset.y==data.y &&

            casilla.dataset.z==data.z


        ){



            casilla.innerText=data.jugador;



            casilla.classList.add(

                data.jugador==="X"

                ?

                "x"

                :

                "o"

            );



        }


    });



}









function actualizarTurno(jugador){



    jugadorActual=jugador;



    let turno=

    document.getElementById("turno");



    turno.innerText=

    "Jugador "+jugador;





    if(jugador==="X"){



        turno.style.color="#38bdf8";



    }

    else{



        turno.style.color="#fb7185";



    }



}








function actualizarCoordenadas(data){



    document.getElementById(

        "coordenadas"

    ).innerText=


    "X="+data.x+
    "  Y="+data.y+
    "  Z="+data.z;



}









socket.on(

"estado_jugadores",

(data)=>{



    document.getElementById(

        "jugadores"

    ).innerText=


    data.jugadores+" / 2";





    let estado=

    document.getElementById(

        "estado"

    );





    estado.innerText=

    data.estado;



    if(data.jugadores===2){


        estado.style.color="#22c55e";


    }


    else{


        estado.style.color="#facc15";


    }



});









function mostrarVictoria(data){



    if(!data.linea)
        return;





    data.linea.forEach(posicion=>{



        document

        .querySelectorAll(".casilla")

        .forEach(casilla=>{





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









function mostrarMensaje(texto){



    let mensaje=

    document.getElementById(

        "mensaje-final"

    );



    mensaje.innerText=texto;



}









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


        casilla.innerText="";


        casilla.classList.remove(
            "x",
            "o",
            "ganadora"
        );


        casilla.disabled=false;


    });




    document.getElementById(
        "coordenadas"
    ).innerText=
    "X=- Y=- Z=-";





    document.getElementById(
        "mensaje-final"
    ).innerText="";





    actualizarTurno("X");


}





    document.getElementById(

        "coordenadas"

    ).innerText=

    "X=- Y=- Z=-";





    document.getElementById(

        "mensaje-final"

    ).innerText="";



}








function salir(){



    window.location.href="/";



}

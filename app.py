from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)

app.config["SECRET_KEY"] = "tic-tac-toe-3d-wan"


socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="eventlet"
)


# VARIABLES DEL JUEGO


def crear_tablero():

    return [
        [
            [
                ""
                for x in range(4)
            ]
            for y in range(4)
        ]
        for z in range(4)
    ]


tablero = crear_tablero()

turno = "X"
ganador = None
linea_ganadora = []


# Guardar jugadores reales conectados
jugadores_conectados = set()



# GENERAR LINEAS GANADORAS


def generar_lineas_ganadoras():

    lineas = []


    direcciones = [

        (1,0,0),
        (0,1,0),
        (0,0,1),
        (1,1,0),
        (1,-1,0),
        (1,0,1),
        (1,0,-1),
        (0,1,1),
        (0,1,-1),
        (1,1,1),
        (1,1,-1),
        (1,-1,1),
        (1,-1,-1)
    ]


    for z in range(4):
        for y in range(4):
            for x in range(4):
                for dx,dy,dz in direcciones:
                    linea=[]

                    for i in range(4):
                        nx=x+(dx*i)
                        ny=y+(dy*i)
                        nz=z+(dz*i)


                        if (
                            0 <= nx < 4 and
                            0 <= ny < 4 and
                            0 <= nz < 4

                        ):
                            linea.append(
                                {
                                    "x":nx,
                                    "y":ny,
                                    "z":nz
                                }
                            )
                        else:
                            break


                    if len(linea)==4:
                        if linea not in lineas:
                            lineas.append(linea)

    return lineas


LINEAS_GANADORAS = generar_lineas_ganadoras()



# COMPROBAR GANADOR


def comprobar_ganador(jugador):

    for linea in LINEAS_GANADORAS:

        gana=True

        for posicion in linea:

            x=posicion["x"]
            y=posicion["y"]
            z=posicion["z"]

            if tablero[z][y][x] != jugador:
                gana=False
                break

        if gana:
            return linea
    return None


# PAGINA


@app.route("/")
def index():
    return render_template(
        "index.html"
    )


# JUGADORES


def emitir_estado():

    cantidad=len(jugadores_conectados)

    if cantidad==0:
        estado="Esperando jugadores"
    elif cantidad==1:
        estado="Esperando segundo jugador"
    else:
        estado="Partida iniciada"


    socketio.emit(
        "estado_jugadores",
        {
            "jugadores":cantidad,
            "estado":estado
        }
    )


@socketio.on("connect")
def conectar():
    jugadores_conectados.add(
        request.sid
    )
    emitir_estado()




@socketio.on("disconnect")
def desconectar():

    jugadores_conectados.discard(
        request.sid
    )

    emitir_estado()


# MOVIMIENTO

@socketio.on("movimiento")
def movimiento(data):

    global turno
    global ganador
    global linea_ganadora


    if len(jugadores_conectados)<2:

        emit(
            "error",
            "Esperando segundo jugador"
        )
        return


    if ganador:
        return


    x=data["x"]
    y=data["y"]
    z=data["z"]




    if tablero[z][y][x]!="":

        emit(
            "error",
            "Casilla ocupada"
        )

        return

    jugador=turno

    tablero[z][y][x]=jugador

    linea=comprobar_ganador(
        jugador
    )

    mensaje=""

    if linea:

        ganador=jugador
        linea_ganadora=linea

        mensaje="Jugador "+jugador+" ganó"

    else:

        turno = (
            "O"
            if turno=="X"
            else
            "X"
        )

        mensaje="Turno jugador "+turno


    socketio.emit(
        "actualizar",
        {
            "x":x,
            "y":y,
            "z":z,
            "jugador":jugador,
            "turno":turno,
            "ganador":ganador,
            "linea":linea,
            "mensaje":mensaje
        }
    )


# REINICIO SIN RECARGAR PAGINA


@socketio.on("reiniciar")
def reiniciar():

    global tablero
    global turno
    global ganador
    global linea_ganadora

    tablero=crear_tablero()

    turno="X"

    ganador=None

    linea_ganadora=[]



    socketio.emit(
        "reiniciado"
    )

    emitir_estado()


# INICIO

if __name__=="__main__":

    socketio.run(
        app,
        host="0.0.0.0",
        port=10000
    )

from flask import Flask, render_template
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

jugadores = 0

linea_ganadora = []


# GENERAR LAS 76 LINEAS DE VICTORIA

def generar_lineas_ganadoras():

    lineas = []

    # Direcciones principales


    direcciones = [

        (1,0,0),   # X
        (0,1,0),   # Y
        (0,0,1),   # Z
        (1,1,0),   # XY
        (1,-1,0),
        (1,0,1),   # XZ
        (1,0,-1),
        (0,1,1),   # YZ
        (0,1,-1),
        (1,1,1),   # 3D
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


# VERIFICAR GANADOR

def comprobar_ganador(jugador):

    for linea in LINEAS_GANADORAS:

        completa=True

        for posicion in linea:
            x=posicion["x"]
            y=posicion["y"]
            z=posicion["z"]

            if tablero[z][y][x] != jugador:
                completa=False
                break

        if completa:
            return linea
    return None


# PAGINA PRINCIPAL

@app.route("/")
def inicio():
    return render_template(
        "index.html"
    )


# CONEXIONES

@socketio.on("connect")
def conectar():

    global jugadores

    jugadores += 1

    if jugadores > 2:
        jugadores = 2

    emitir_estado()


@socketio.on("disconnect")
def desconectar():
    global jugadores
    jugadores -= 1
    if jugadores < 0:
        jugadores=0
    emitir_estado()


def emitir_estado():
    estado=""
    if jugadores == 0:

        estado="Esperando jugadores"

    elif jugadores == 1:

        estado="Esperando segundo jugador"

    else:

        estado="Partida iniciada"

    emit(

        "estado_jugadores",
        {
            "jugadores":jugadores,
            "estado":estado
        },
        broadcast=True
    )



# MOVIMIENTOS

@socketio.on("movimiento")
def movimiento(data):

    global turno
    global ganador
    global linea_ganadora

    if jugadores < 2:
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

    if tablero[z][y][x] != "":

        emit(
            "error",
            "Movimiento inválido: casilla ocupada"
        )

        return


    jugador=turno

    tablero[z][y][x]=jugador

    linea=comprobar_ganador(
        jugador
    )


    if linea:

        ganador=jugador

        linea_ganadora=linea


        mensaje=(
            "Jugador "
            + jugador
            + " ganó"
        )


    else:


        lleno=True


        for z1 in range(4):

            for y1 in range(4):

                for x1 in range(4):

                    if tablero[z1][y1][x1]=="":

                        lleno=False



        if lleno:


            mensaje="Empate"


            ganador="EMPATE"



        else:


            turno=(

                "O"

                if turno=="X"

                else

                "X"

            )


            mensaje=(

                "Turno jugador "

                + turno

            )





    emit(
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
        },
        broadcast=True
    )


# REINICIO

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

    emit(
        "reiniciado",
        broadcast=True
    )


# EJECUCION

if __name__=="__main__":

    socketio.run(
        app,
        host="0.0.0.0",
        port=10000
    )

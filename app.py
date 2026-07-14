from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = "tic-tac-toe-3d"

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="eventlet"
)


def nuevo_tablero():
    return [
        [
            ["" for x in range(4)]
            for y in range(4)
        ]
        for z in range(4)
    ]


tablero = nuevo_tablero()
turno = "X"
ganador = None


@app.route("/")
def index():

    return render_template(
        "index.html"
    )

# VALIDAR GANADOR 3D

def comprobar_ganador(x,y,z,jugador):


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


    for dx,dy,dz in direcciones:
        linea=[]

        for i in range(4):
            nx=x+dx*i
            ny=y+dy*i
            nz=z+dz*i

            if (
                0 <= nx <4 and
                0 <= ny <4 and
                0 <= nz <4
            ):
                if tablero[nz][ny][nx]==jugador:

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
            return linea
    return None

# MOVIMIENTO

@socketio.on("movimiento")
def movimiento(data):

    global turno
    global ganador

    if ganador:
        return

    x=data["x"]
    y=data["y"]
    z=data["z"]

    # casilla ocupada

    if tablero[z][y][x]!="":

        emit(
            "error",
            "Casilla ocupada"
        )

        return

    jugador=turno

    tablero[z][y][x]=jugador

    linea=comprobar_ganador(
        x,y,z,jugador
    )

    if linea:

        ganador=jugador

    else:

        turno="O" if turno=="X" else "X"

    emit(
        "actualizar",
        {
        "x":x,
        "y":y,
        "z":z,
        "jugador":jugador,
        "turno":turno,
        "ganador":ganador,
        "linea":linea
        },

        broadcast=True
    )

# REINICIAR

@socketio.on("reiniciar")
def reiniciar():

    global tablero
    global turno
    global ganador

    tablero=nuevo_tablero()

    turno="X"

    ganador=None


    emit(
        "reiniciado",
        broadcast=True
    )


if __name__=="__main__":


    socketio.run(
        app,
        host="0.0.0.0",
        port=10000

    )
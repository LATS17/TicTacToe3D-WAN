from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)

app.config['SECRET_KEY'] = 'tic-tac-toe-3d'

socketio = SocketIO(
    app,
    cors_allowed_origins="*"
)


# Matriz del tablero 4x4x4
jugadas = [
    [[0 for x in range(4)] for y in range(4)]
    for z in range(4)
]


jugador_actual = 0


@app.route("/")
def inicio():
    return render_template("index.html")


@socketio.on("movimiento")
def recibir_movimiento(data):

    global jugador_actual

    x = data["x"]
    y = data["y"]
    z = data["z"]

    simbolo = "X" if jugador_actual == 0 else "O"

    # Guardar movimiento
    jugadas[z][y][x] = simbolo


    # enviar movimiento a todos los jugadores
    emit(
        "actualizar_tablero",
        {
            "x":x,
            "y":y,
            "z":z,
            "simbolo":simbolo
        },
        broadcast=True
    )


    jugador_actual = 1 - jugador_actual



@socketio.on("conectar_jugador")
def conectar():

    emit(
        "mensaje",
        "Jugador conectado al servidor WAN"
    )


if __name__ == "__main__":

    socketio.run(
        app,
        host="0.0.0.0",
        port=10000
    )
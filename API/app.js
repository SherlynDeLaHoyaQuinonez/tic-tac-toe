const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Esto permite solicitudes desde cualquier origen
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

// Define la estructura de datos del juego (backend)
let board = [['', '', ''], ['', '', ''], ['', '', '']];
let currentPlayer = 'X';
let message = '';

// Ruta para obtener el estado actual del juego
app.get('/game', (req, res) => {
  res.json({ board, currentPlayer, message });
});

// Ruta para realizar un movimiento
app.post('/makeMove', (req, res) => {
  const { row, col } = req.body;

  // Validar el movimiento y actualizar el estado del juego
  if (isValidMove(row, col) && !isGameOver()) {
    board[row][col] = currentPlayer;

    if (checkWinner(row, col)) {
      message = `¡El jugador ${currentPlayer} ha ganado!`;
    } else if (isBoardFull()) {
      message = '¡Es un empate!';
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    // Envía el estado del juego a todos los clientes WebSocket conectados
    broadcastGameState();

    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Movimiento inválido o juego terminado.' });
  }
});

// Ruta para reiniciar el juego
app.post('/resetGame', (req, res) => {
  board = [['', '', ''], ['', '', ''], ['', '', '']];
  currentPlayer = 'X';
  message = '';

  // Envía el estado del juego a todos los clientes WebSocket conectados
  broadcastGameState();

  res.json({ success: true });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

// Funciones de lógica del juego
function isValidMove(row, col) {
  // Verificar si el movimiento es válido
  return board[row] && board[row][col] === '' && !isGameOver();
}

function checkWinner(row, col) {
  const player = board[row][col];

  // Verificar filas
  if (
    (board[row][0] === player && board[row][1] === player && board[row][2] === player) ||
    // Verificar columnas
    (board[0][col] === player && board[1][col] === player && board[2][col] === player) ||
    // Verificar diagonales
    (row === col && board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
    ((row === 0 && col === 2) || (row === 2 && col === 0)) &&
      board[0][2] === player &&
      board[1][1] === player &&
      board[2][0] === player
  ) {
    return true;
  }

  return false;
}

function isBoardFull() {
  // Verificar si el tablero está lleno
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        return false;
      }
    }
  }
  return true;
}

function isGameOver() {
  // Verificar si el juego ha terminado
  return message !== '';
}

// Función para enviar el estado del juego a todos los clientes WebSocket conectados
function broadcastGameState() {
  const gameState = { board, currentPlayer, message };
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(gameState));
    }
  });
}

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
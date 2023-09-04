const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Tablero del juego
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

// Función para reiniciar el tablero
function resetBoard() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
}

// Función para verificar si un jugador ha ganado
function checkWinner(player) {
  // Verificación de filas y columnas
  for (let i = 0; i < 3; i++) {
    if (
      (board[i][0] === player && board[i][1] === player && board[i][2] === player) ||
      (board[0][i] === player && board[1][i] === player && board[2][i] === player)
    ) {
      return true;
    }
  }

  // Verificación de diagonales
  if (
    (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
    (board[0][2] === player && board[1][1] === player && board[2][0] === player)
  ) {
    return true;
  }

  return false;
}

// Ruta para realizar un movimiento en el tablero
app.post('/move', (req, res) => {
  const { row, col, player } = req.body;

  if (board[row][col] === '' && (player === 'X' || player === 'O')) {
    board[row][col] = player;

    // Verificar si el jugador ganó
    if (checkWinner(player)) {
      res.json({ message: `¡El jugador ${player} ha ganado!`, board });
    } else {
      res.json({ message: 'Movimiento exitoso', board });
    }
  } else {
    res.status(400).json({ message: 'Movimiento inválido' });
  }
});

// Ruta para obtener el estado actual del tablero
app.get('/board', (req, res) => {
  res.json(board);
});

// Ruta para comenzar un nuevo juego reiniciando el tablero
app.post('/new-game', (req, res) => {
  resetBoard();
  res.json({ message: 'Nuevo juego iniciado', board });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
<template>
  <div id="app">
    <h1>Tic Tac Toe</h1>
    <div class="board">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          @click="makeMove(rowIndex, colIndex)"
        >
          {{ cell }}
        </div>
      </div>
    </div>
    <div class="message">
      <p>{{ message }}</p>
      <button @click="startGame">Nuevo Juego</button>
      <button @click="restartGame">Reiniciar Juego</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
      ID_Game: null,
      Player: null,
      message: "",
      apiBaseUrl: "https://46i3aj7hn3.execute-api.us-east-1.amazonaws.com", // Cambia a la URL de tu API
    };
  },
  methods: {
    makeMove(rowIndex, colIndex) {
      if (this.ID_Game != null) {
        axios
          .get(`${this.apiBaseUrl}/game/${this.ID_Game}`)
          .then((response) => {
            console.log(response.data["Game"]);
          });

        const move = {
          row: rowIndex.toString(), // Convierte los índices en cadenas si es necesario
          col: colIndex.toString()
        };
        axios
          .put(`${this.apiBaseUrl}/makeMove/${this.ID_Game}`, move)
          .then((response) => {
            console.log(response.data);
            if (response.data["Valido"] === "Movimiento valido.") {
              this.board[rowIndex][colIndex] = "X"
              
            }
          });
        
      } else {
        alert("Inicia un juego primero");
      }
    },
    startGame() {
      axios
        .get(`${this.apiBaseUrl}/get-id`)
        .then((response) => {
          this.ID_Game = response.data["New Game"];
        })
        .then(() => {
          axios
            .put(`${this.apiBaseUrl}/game/${this.ID_Game}`)
            .then((response) => {
              console.log(response.data)
              alert(`Juego iniciado.`)
            });
        });
    },
    restartGame(){
      axios
      .put(`${this.apiBaseUrl}/resetGame/${this.ID_Game}`)
      .then((response)=> {
        if (response.data["Valido"] == "Juego reiniciado") {
          this.board = [
              ["", "", ""],
              ["", "", ""],
              ["", "", ""],
            ];
          alert("Juego reiniciado")
          
        }
      })
    }
  },
};
</script>

<style scoped>
#app {
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-top: 30px;
}

.board {
  display: inline-block;
  border: 2px solid #333;
}

.row {
  display: flex;
}

.cell {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  cursor: pointer;
  border: 1px solid #ccc;
}

.message {
  margin-top: 20px;
  font-size: 1.5em;
}

button {
  font-size: 1em;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  margin-left: 10px;
}

button:hover {
  background-color: #0056b3;
}
</style>

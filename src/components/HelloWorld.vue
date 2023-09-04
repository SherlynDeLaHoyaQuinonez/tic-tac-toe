<template>
  <div>
    <h1>Tic Tac Toe</h1>
    <div>
      <p>Current Player: {{ currentPlayer }}</p>
    </div>
    <div class="board">
      <div
        class="cell"
        v-for="(cell, index) in board"
        :key="index"
        @click="makeMove(index)"
      >
        {{ cell }}
      </div>
    </div>
    <div>
      <p>{{ announcement }}</p>
      <button @click="resetBoard">Restart</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      board: Array(9).fill(""),
      currentPlayer: "X",
      isGameActive: true,
      announcement: "",
    };
  },
  methods: {
    makeMove(index) {
      if (this.isGameActive && !this.board[index]) {
        this.$set(this.board, index, this.currentPlayer);
        if (this.checkWin() === this.currentPlayer) {
          this.announcement = `Player ${this.currentPlayer} wins!`;
          this.isGameActive = false;
        } else if (this.board.indexOf("") === -1) {
          this.announcement = "It's a tie!";
          this.isGameActive = false;
        } else {
          this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        }
      }
    },
    resetBoard() {
      this.board = Array(9).fill("");
      this.currentPlayer = "X";
      this.announcement = "";
      this.isGameActive = true;
    },
    checkWin() {
      const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
          this.board[a] &&
          this.board[a] === this.board[b] &&
          this.board[a] === this.board[c]
        ) {
          return this.board[a];
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-gap: 5px;
  margin-top: 20px;
}

.cell {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  background-color: #eee;
  cursor: pointer;
}

.cell:hover {
  background-color: #ccc;
}
</style>

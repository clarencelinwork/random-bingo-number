<!-- src/components/NumberDraw.vue -->
<template>
  <div class="number-draw-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>抽號碼系統</h2>
          <el-button type="primary" @click="drawNumber" :disabled="remainingNumbers.length === 0">
            抽號碼
          </el-button>
          <el-button type="danger" @click="resetGame">重置</el-button>
        </div>
      </template>

      <div class="result-section" v-if="lastDrawnNumber !== null">
        <h3>最後抽出的號碼</h3>
        <div class="last-number">{{ lastDrawnNumber }}</div>
      </div>

      <div class="numbers-grid">
        <h3>號碼狀態</h3>
        <div class="grid">
          <div
              v-for="num in 25"
              :key="num"
              class="number-box"
              :class="{ 'drawn': drawnNumbers.includes(num) }"
          >
            {{ num }}
          </div>
        </div>
      </div>

      <div class="statistics">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="stat-item">
              <h4>已抽出號碼</h4>
              <el-tag
                  v-for="num in drawnNumbers"
                  :key="num"
                  class="drawn-number-tag"
              >
                {{ num }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="stat-item">
              <h4>剩餘號碼</h4>
              <el-tag
                  v-for="num in remainingNumbers"
                  :key="num"
                  type="info"
                  class="remaining-number-tag"
              >
                {{ num }}
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'
import {ElMessage} from 'element-plus'

export default {
  name: 'NumberDraw',
  setup() {
    const drawnNumbers = ref([])
    const lastDrawnNumber = ref(null)
    const remainingNumbers = ref([])

    // 初始化遊戲
    const initializeGame = () => {
      remainingNumbers.value = Array.from({length: 25}, (_, i) => i + 1)
      drawnNumbers.value = []
      lastDrawnNumber.value = null

      // 從localStorage讀取之前的狀態
      const savedState = localStorage.getItem('numberDrawState')
      if (savedState) {
        const state = JSON.parse(savedState)
        drawnNumbers.value = state.drawnNumbers
        lastDrawnNumber.value = state.lastDrawnNumber
        remainingNumbers.value = state.remainingNumbers
      }
    }

    // 抽號碼
    const drawNumber = () => {
      if (remainingNumbers.value.length === 0) {
        ElMessage({
          message: '所有號碼都已抽完！',
          type: 'warning'
        })
        return
      }

      const randomIndex = Math.floor(Math.random() * remainingNumbers.value.length)
      const drawnNumber = remainingNumbers.value.splice(randomIndex, 1)[0]

      drawnNumbers.value.push(drawnNumber)
      lastDrawnNumber.value = drawnNumber

      // 保存到localStorage
      saveState()

      ElMessage({
        message: `抽出號碼：${drawnNumber}`,
        type: 'success'
      })
    }

    // 重置遊戲
    const resetGame = () => {
      localStorage.removeItem('numberDrawState')
      initializeGame()
      ElMessage({
        message: '遊戲已重置',
        type: 'info'
      })
    }

    // 保存狀態到localStorage
    const saveState = () => {
      const state = {
        drawnNumbers: drawnNumbers.value,
        lastDrawnNumber: lastDrawnNumber.value,
        remainingNumbers: remainingNumbers.value
      }
      localStorage.setItem('numberDrawState', JSON.stringify(state))
    }

    onMounted(() => {
      initializeGame()
    })

    return {
      drawnNumbers,
      lastDrawnNumber,
      remainingNumbers,
      drawNumber,
      resetGame
    }
  }
}
</script>

<style scoped>
.number-draw-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-section {
  text-align: center;
  margin: 20px 0;
}

.last-number {
  font-size: 48px;
  font-weight: bold;
  color: #409EFF;
  margin: 10px 0;
}

.numbers-grid {
  margin: 20px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.number-box {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s;
}

.number-box.drawn {
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
}

.statistics {
  margin-top: 20px;
}

.stat-item {
  margin-bottom: 20px;
}

.drawn-number-tag,
.remaining-number-tag {
  margin: 4px;
}
</style>
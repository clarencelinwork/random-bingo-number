# NumberDraw.vue
<template>
  <div class="number-draw-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>賓果抽號碼</h2>
          <div class="button-group">
            <el-button type="primary" size="large" @click="drawNumber" :disabled="remainingNumbers.length === 0">
              抽號碼
            </el-button>
            <el-button type="danger" size="large" @click="confirmReset">重置</el-button>
          </div>
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
              :class="{
                'drawn': drawnNumbers.includes(num),
                'last-drawn': num === lastDrawnNumber
              }"
              @click="handleNumberClick(num)"
          >
            {{ num }}
          </div>
        </div>
      </div>

      <hr class="divider"/>

      <div class="draw-sequence">
        <h3>抽出順序</h3>
        <div class="sequence-list">
          <el-tag
              v-for="(num, index) in drawnNumbers"
              :key="index"
              :type="num === lastDrawnNumber ? 'danger' : 'primary'"
              class="sequence-number"
              size="large"
          >
            {{ num }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 重置確認對話框 -->
    <el-dialog
        v-model="dialogVisible"
        title="確認重置"
        width="300px"
        center
    >
      <span>確定要重置所有號碼嗎？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleReset">確定重置</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 手動選擇確認對話框 -->
    <el-dialog
        v-model="manualSelectDialogVisible"
        title="確認選擇"
        width="300px"
        center
    >
      <span>確定要選擇號碼 {{ selectedNumber }} 嗎？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="manualSelectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmManualSelect">確定選擇</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue'

export default {
  name: 'NumberDraw',
  setup() {
    const drawnNumbers = ref([])
    const lastDrawnNumber = ref(null)
    const remainingNumbers = ref([])
    const dialogVisible = ref(false)
    const manualSelectDialogVisible = ref(false)
    const selectedNumber = ref(null)

    const initializeGame = () => {
      remainingNumbers.value = Array.from({length: 25}, (_, i) => i + 1)
      drawnNumbers.value = []
      lastDrawnNumber.value = null

      const savedState = localStorage.getItem('numberDrawState')
      if (savedState) {
        const state = JSON.parse(savedState)
        drawnNumbers.value = state.drawnNumbers
        lastDrawnNumber.value = state.lastDrawnNumber
        remainingNumbers.value = state.remainingNumbers
      }
    }

    const drawNumber = () => {
      if (remainingNumbers.value.length === 0) {
        return
      }

      const randomIndex = Math.floor(Math.random() * remainingNumbers.value.length)
      const drawnNumber = remainingNumbers.value.splice(randomIndex, 1)[0]

      drawnNumbers.value.push(drawnNumber)
      lastDrawnNumber.value = drawnNumber

      saveState()
    }

    // 處理點擊數字
    const handleNumberClick = (num) => {
      if (!drawnNumbers.value.includes(num) && remainingNumbers.value.includes(num)) {
        selectedNumber.value = num
        manualSelectDialogVisible.value = true
      }
    }

    // 確認手動選擇
    const confirmManualSelect = () => {
      const index = remainingNumbers.value.indexOf(selectedNumber.value)
      if (index !== -1) {
        remainingNumbers.value.splice(index, 1)
        drawnNumbers.value.push(selectedNumber.value)
        lastDrawnNumber.value = selectedNumber.value
        saveState()
      }
      manualSelectDialogVisible.value = false
    }

    const confirmReset = () => {
      dialogVisible.value = true
    }

    const handleReset = () => {
      localStorage.removeItem('numberDrawState')
      initializeGame()
      dialogVisible.value = false
    }

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
      dialogVisible,
      manualSelectDialogVisible,
      selectedNumber,
      confirmReset,
      handleReset,
      handleNumberClick,
      confirmManualSelect
    }
  }
}
</script>

<style scoped>
.number-draw-container {
  max-width: 650px;
  margin: 0 auto;
  padding: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.button-group {
  display: flex;
  gap: 10px;
}

.result-section {
  text-align: center;
  margin: 15px 0;
}

.result-section h3 {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.last-number {
  font-size: 42px;
  font-weight: bold;
  color: #409EFF;
  margin: 10px 0;
  line-height: 1.2;
}

.numbers-grid {
  margin: 15px 0 0 0;
}

.numbers-grid h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 1.1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  justify-items: center;
}

.number-box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: all 0.3s;
  background-color: #fff;
  height: 50px;
  width: 100px;
  cursor: pointer;
}

.number-box:not(.drawn):hover {
  border-color: #409EFF;
  color: #409EFF;
}

.number-box.drawn {
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
  cursor: not-allowed;
}

.number-box.last-drawn {
  background-color: #F56C6C;
  color: white;
  border-color: #F56C6C;
  cursor: not-allowed;
}

:deep(.el-card__header) {
  padding: 15px;
}

:deep(.el-card__body) {
  padding: 15px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
}

:deep(.el-button--large) {
  padding: 15px 25px;
  font-size: 16px;
}

.draw-sequence {
  margin-top: 20px;
  text-align: center;
}

.draw-sequence h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 1.1rem;
}

.sequence-list {
  display: grid;
  grid-template-columns: repeat(9, auto);
  gap: 10px;
  justify-content: center;
  margin: 0 auto;
  max-width: 600px;
}

.sequence-number {
  font-size: 18px;
  padding: 8px 15px;
  font-weight: bold;
}

.divider {
  margin: 20px 0;
  border: none;
  height: 1px;
  background: #dcdfe6;
}
</style>
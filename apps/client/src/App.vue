<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Teste API</h1>
    <p class="mt-2">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const message = ref('Carregando...')

onMounted(async () => {
  const res = await axios.get('http://localhost:3000/api/hello')
  message.value = res.data.message
})
</script>

<script setup>
import { useFormStore } from "@/stores/formData";
const store = useFormStore();
</script>

<script>
export default {
  data() {
    return { appendDataString: null };
  },
};
</script>

<template>
  <main>
    <div>
      <h1>This is a home page</h1>
      <h2>Pinia Store test</h2>
      <h2>PhnGetter demo: {{ store.phnGetter }}</h2>
      <h2>AppendData demo: {{ store.testField }}</h2>
      <input
        v-model="appendDataString"
        type="text"
        placeholder="Type here"
      />
      <button @click="store.appendData(appendDataString)">Append</button>
      <button @click="store.clearData()">Clear</button>
    </div>
  </main>
</template>

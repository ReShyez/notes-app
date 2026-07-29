<template>
  <NuxtPage/>
</template>

<script setup lang="ts">

import {useNotesStore} from "~/stores/notes";

const notesStore = useNotesStore()

onMounted(() => {
  notesStore.initialize()
})
</script>
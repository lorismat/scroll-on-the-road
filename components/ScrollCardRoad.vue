<template>
  <div class="mx-4 py-96 relative flex justify-center">
    <div class="text-md sm:text-3xl text-center font-serif bg-white border-2 border-black p-4 ">
      {{ text }}
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  text: String,
})


</script>
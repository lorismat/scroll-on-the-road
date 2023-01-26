<template>
  <div :id="idx" class="mx-4 py-96 relative flex justify-center">
    <div class="text-xl sm:text-5xl font-serif w-full bg-black text-white text-center p-4 ">
      {{ textParsed.part }} <br>
      {{ textParsed.trip }}
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  text: String,
  idx: String
})

const textParsed = computed(() => {
  const arrText = props.text.split(":");  
  return {
    "part": arrText[0],
    "trip": arrText[1]
  }
  
  
})


</script>
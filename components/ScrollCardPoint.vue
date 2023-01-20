<template>
  <div class="border-2 bg-white border-black p-4 my-4 relative mx-auto max-w-lg">
    <div> <span class="font-bold font-serif">{{ place }} </span> <span class="text-gray">({{ state }})</span></div>
    <div class="py-2 font-type tracking-tighter">
      {{ text }}
    </div>

    <div class="relative">
      <img class="w-48 absolute right-0" :src="transport" :alt="transp">
    </div>
    
  </div>
</template>


<script setup>

const props = defineProps({
  text: String,
  place: String, 
  state: String,
  transp: String
})

const transport = computed(() => {
  return `/img/${props.transp}.png`
})


</script>
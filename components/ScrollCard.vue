<template>
  <div>
    <div class="step border-2 border-black p-4 m-4 relative bg-white">
      <!-- {{ idx }} <br> -->
      {{ text }} <br><br>
      <span class="font-bold">{{ place }}</span> <br>
      <span class="italic">{{ state }}</span><br>
      by <span class="font-bold underline">{{ transp }}</span>
    </div>

    <div class="blank">
    </div>
  </div>
  
</template>

<script setup>



defineProps({
  text: String,
  place: String, 
  state: String,
  transp: String,
  idx: String
})


</script>

<style scoped>
.blank {
  min-height: 100vh;
}

</style>


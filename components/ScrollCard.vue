<template>
  <div>
    <div class="step border-2 border-black p-4 m-4 relative bg-white">
      {{ text }} <br>
      {{ idx }} - <span class="font-bold">{{ place }}</span> <br><br>

      <span class="text-sm">{{ lat }}, {{ lon }}</span>
    </div>

    <div class="blank">
    </div>
  </div>
  
</template>

<script setup>



defineProps({
  text: String,
  place: String, 
  lat: String,
  lon: String,
  idx: String
})


</script>

<style scoped>
.blank {
  min-height: 100vh;
}

</style>


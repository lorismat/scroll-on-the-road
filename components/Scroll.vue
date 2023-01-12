<template>
  <div class="mx-auto max-w-lg">

    <ScrollCard 
      v-for="l in trackingData"
      :text="l.text"
      :place="l.place"
      :lat="l.lat"
      :lon="l.lon"
      :idx="l.idx"
    />
    
  </div>
</template>

<script setup>

defineProps({
  trackingData: Array
})




</script>
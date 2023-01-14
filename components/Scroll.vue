<template>
  <div class="mx-auto max-w-lg">

    <ScrollCard 
      v-for="l in trackingData"
      :text="l.text"
      :place="l.place"
      :state="l.state"
      :transp="l.transportation"
      :idx="l.idx"
    />
    
  </div>
</template>

<script setup>

defineProps({
  trackingData: Array
})




</script>
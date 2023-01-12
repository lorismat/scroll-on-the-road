<template>
  <div>

    <Home />

    <Map 
    />

    <Scroll 
      :trackingData="trackingData"
    />
    
  </div>
</template>

<script setup>
import * as d3 from 'd3';

const trackingData = ref([]);

function loadData() {
  d3.csv('https://docs.google.com/spreadsheets/d/1v9jnjcfKPv7kxmnKWFRk4Cz7XzjXM2Pqqiy_36zwLoU/export?format=csv&gid=0')
  .then((data) => {
    trackingData.value = data;
  })
}

onBeforeMount(() => {
  loadData();
})

</script>

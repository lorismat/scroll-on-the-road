<template>
  <div>

    <Home />

    <div id="scrolly" class="relative">
      <Map 
      />
      <Scroll class="relative"
        :trackingData="trackingData"
      />
    </div>
    
    <Outro />
    
  </div>
</template>

<script setup>
import * as d3 from 'd3';

const trackingData = ref([]);

function loadData() {
  d3.csv('https://docs.google.com/spreadsheets/d/1v9jnjcfKPv7kxmnKWFRk4Cz7XzjXM2Pqqiy_36zwLoU/export?format=csv&gid=1864892355')
  .then((data) => {
    trackingData.value = data;
  })
}

onBeforeMount(() => {
  loadData();
})

</script>

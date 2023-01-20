<template>
  <div class="px-1">

    <Home />

    <div id="loader" class="font-mono text-center py-10">
      Waiting for a car...
    </div>


    <div v-if="trigger" id="main-block" class="">
      <div id="scrolly" class="relative whole-scroll">

        <div class="flex justify-center sticky z-20 top-0 bg-white">
          <Nav />
        </div>

        <div class="flex flex-col justify-center sticky z-0 top-0 min-h-screen">
          <Map />
        </div>

        <Scroll class="relative z-10"
          :trackingData="trackingData"
        />
      </div>
      <About />

    </div>
       
  </div>
</template>

<script setup>
import * as d3 from 'd3';

const trackingData = ref([]);
const trigger = useState('trigger', () => false);

function loadData() {
  // d3.csv('/data/otr.csv') // prod 
  d3.csv('https://docs.google.com/spreadsheets/d/1v9jnjcfKPv7kxmnKWFRk4Cz7XzjXM2Pqqiy_36zwLoU/export?format=csv&gid=1864892355') // dev
  .then((data) => {
    // document.body.scrollTop = document.documentElement.scrollTop = 0;
    trackingData.value = data;
  })
  .then(() => {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
  })
}

onMounted(() => {
  loadData();
})

</script>

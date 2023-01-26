<template>
  <div class="px-1">

    <TheHome />

    <div v-if="trigger" id="main-block" class="">
      <div id="scrolly" class="relative whole-scroll">

        <div class="flex justify-center sticky z-20 top-0 bg-white">
          <TheNavBar />
        </div>

        <div class="flex flex-col justify-center sticky z-0 top-0 min-h-screen">
          <TheMap />
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
  // d3.csv('/data/otr.csv') // local usage
  d3.csv('https://docs.google.com/spreadsheets/d/1lqpTaeTtosI7LV2zcAdRcX9cuxbxRK4yZx9RiXgk3go/export?format=csv&gid=0')
  .then((data) => {
    trackingData.value = data;
  })

}

onMounted(() => {
  loadData();
})

</script>

<template>
  <div>
    <div class="step" :data-step="idxByType" :data-type="type">
      
      <div v-if="type == 'p'">
        <ScrollCardPoint 
          :text="text" 
          :place="place" 
          :state="state" 
          :transp="transp" 
        />
      </div>

      <div v-else-if="type == 's'">
        <ScrollCardSection 
          :text="text" 
          :idx="idx"
        />
      </div>

      <div v-else>
        <ScrollCardRoad :text="text" />
      </div>

    </div>

    <div class="blank">
    </div>
  </div>
  
</template>

<script setup>

const triggerScrollama = useState('trigger-scrollama', () => "");

const props = defineProps({
  text: String,
  place: String, 
  state: String,
  transp: String,
  idx: String
})

const idxByType = computed(() => {
  return props.idx.split('-')[1];
})

const type = computed(() => {
  return props.idx.split('')[0];
})

onMounted(() => {
  triggerScrollama.value = "ready";
})

</script>

<style scoped>
.blank {
  min-height: 600px;
}

</style>


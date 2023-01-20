<template>
  <div :id="idTop" class="flex justify-center items-center relative min-h-screen">

    
    <div class="">

      <div >
        <img class="py-10 w-28 mx-auto" src="/img/jack.png" alt="jack">
      </div>

      <TheHeader />
    </div>
  </div>
</template>

<script setup>

const idTop = "top";


onBeforeMount(() => {

  window.addEventListener("load", function () {
    console.log("loaded")
    // document.body.scrollTop = document.documentElement.scrollTop = 0;
  })
  
  // window.location.reload(true);
  //window.scrollTo(0, document.getElementById('top').offsetTop)
})


</script>
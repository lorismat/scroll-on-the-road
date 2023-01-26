<template>
  <div class="flex justify-center">
    <!-- <div class="text-center"><span class="underline">Share this project</span></div> -->
    <a 
      href="https://twitter.com/share?ref_src=twsrc%5Etfw" 
      class="twitter-share-button" 
      data-text="An interactive scrolling map to follow Jack Kerouac&#39;s On The Road" 
      data-url="https://www.lorismat.com/" 
      data-via="lorismat_" 
      data-hashtags="ontheroad" 
      data-related="" 
      data-dnt="true"
      data-size="large"
      data-show-count="false">
        Share
      </a>
          
    </div>
</template>

<script setup>

// via https://publish.twitter.com
onMounted(() => {
  let tw = document.createElement('script');
  tw.setAttribute('src', '/libs/widgets.js');
  document.head.appendChild(tw);
})
</script>
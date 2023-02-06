<template>
  <div class="flex justify-center">
    <a 
      href="https://twitter.com/share?ref_src=twsrc%5Etfw" 
      class="twitter-share-button underline underline-offset-4" 
      data-text="Scrolling On The Road!" 
      data-url="on-the-road.lorismat.com" 
      data-via="lorismat_" 
      data-hashtags="ontheroad" 
      data-related="" 
      data-dnt="true"
      data-size="large"
      data-show-count="false">
        Share on Twitter
    </a>
          
    </div>
</template>

<script setup>

// via https://publish.twitter.com
onMounted(() => {
  let tw = document.createElement('script');
  tw.setAttribute('src', '/libs/twitter-btn.js');
  document.head.appendChild(tw);
})
</script>
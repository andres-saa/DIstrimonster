<template>

  <banner-carousel></banner-carousel>
  <RouterView></RouterView>


  <!-- <BarraCategorias class="categories"></BarraCategorias> -->

  <div class="grid">

    <MenuSection></MenuSection>

  </div>


</template>

<script setup>
import BannerCarousel from '@/components/BannerCarousel.vue';
import BarraCategorias from '@/components/BarraCategorias.vue';
import MenuSection from './MenuSection.vue';
import Sidebar from '@/components/Sidebar.vue';
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr;
}


@media (width < 1100px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }

}
</style>

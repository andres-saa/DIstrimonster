<script setup>

import VistaProducto from './components/Dialogs/VistaProducto.vue';
import Toast from 'primevue/toast';
import { InputText } from 'primevue';
import siteDialog from './components/Dialogs/siteDialog.vue';
import SiteDialogSonando from './components/Dialogs/siteDialogSonando.vue';
import barra from './views/barra.vue';
import { useReportesStore } from './store/ventas';
import { onMounted } from 'vue';
import { usecartStore } from './store/shoping_cart';
import { fetchService } from './service/utils/fetchService';
import { URI } from './service/conection';
import { useSitesStore } from './store/site';

const cart = usecartStore()
const siteStore = useSitesStore()


const reportes = useReportesStore()
onMounted(async () => {


  const status = await fetchService.get(`${URI}/site/${31}/status`)
  if (status) {
    siteStore.status = status
  }
  const data = await fetchService.get(`${URI}/get-product-integration-distrimonster`)
  cart.menu = data.data

})
</script>

<template>
  <div>
    <div
    class=""
    v-if="reportes.loading.visible"
    style="width: 100vw;transition: all ease .3s;backdrop-filter: blur(5px);  flex-direction: column;pointer-events:auto; background-color: #00000020; height: 100vh;position: fixed;display: flex;align-items: center;justify-content: center; left: 0;right: 0;z-index: 99999999;"  >
  <div class="luz" style="aspect-ratio: 1  / 1;display: flex;justify-content: center;align-items: center;">

    <div class="girar" style="width: 150px;z-index: -1; height: 150px;padding: 3rem; background-color: var(--p-primary-color); position: absolute;"></div>
    <div class="imagen" style="display: flex;padding: 1rem;border-radius: .3rem; background-color: white;  gap: 1rem; flex-direction: column; align-items:center;">
      <img src="https://backend.salchimonster.com/read-photo-product/yEd7G1Qf" style="width:20vw ;max-width: 100px;" alt="">
      <h5 style="color: black;">Cargando...</h5>
    </div>
  </div>

  </div>

    <Toast></Toast>
    <router-view></router-view>
    <vista-producto></vista-producto>
    <!-- <InputText></InputText> -->
    <siteDialog></siteDialog>
    <barra></barra>
    <!-- <SiteDialogSonando></SiteDialogSonando> -->
  </div>
</template>


<style scoped>

.girar{

  animation: girar infinite .5s linear;

}



@keyframes girar {

  100%{
    transform: rotate(360deg);
  }

}
</style>

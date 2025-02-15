<template>



  <h2 style="text-align: center;margin: 2rem 0;">Precios de la semana</h2>


  <div style="margin-top: 10rem; max-width: 1000px; margin: 2rem auto;padding: 1rem;">


    <DataTable :value="data" class="shadow-1" style="">
      <!-- Producto -->
      <Column header="Producto" class="m-0 py-0" style="">
        <template #body="slotProps">
          <span class="m-0 p-0">
            {{ slotProps.data.productogeneral_descripcion }}
          </span>
        </template>
      </Column>

      <!-- Precio base -->
      <Column header="Precio base" class="m-0 py-0 py-2">
        <template #body="slotProps">
          <!-- InputNumber con formato moneda -->
          <span class="m-0 p-0">
            {{ formatoPesosColombianos(slotProps.data.minor)   }}
          </span>

        </template>
      </Column>

      <!-- Precio Mayor -->
      <Column header="Precio Mayor" class="m-0 py-0" style="">
          <template #body="slotProps">
          <InputNumber v-if="modificando"
          :inputStyle="{ width: '100%',maxWidth:'10rem', height: '2rem',borderRadius:'0' }"

            v-model="slotProps.data.mayor"
            mode="currency"
            currency="USD"
            locale="en-US"
            :minFractionDigits="0"
            :maxFractionDigits="2"

          />
          <span v-else class="m-0 p-0">
            {{ formatoPesosColombianos(slotProps.data.mayor) }}
          </span>
        </template>
      </Column>

      <!-- Precio Distribuidor -->
      <Column header="Precio Distribuidor" class="m-0 py-0 " style="">
        <template #body="slotProps">

          <div style="display: flex;">
              <InputNumber v-if="modificando"
          :inputStyle="{ width: '100%',maxWidth:'10rem', height: '2rem',borderRadius:'0' }"

            v-model="slotProps.data.distribuidor"
            mode="currency"
            currency="USD"
            locale="en-US"
            :minFractionDigits="0"
            :maxFractionDigits="2"

          />
          <span v-else class="m-0 p-0">
            {{ formatoPesosColombianos(slotProps.data.distribuidor) }}
          </span>
          </div>

        </template>
      </Column>
    </DataTable>





  </div>
</template>

<script setup>
import { onMounted, ref , computed} from "vue";
import { fetchService } from "@/service/utils/fetchService";
import { DataTable } from "primevue";
import {Button} from "primevue";
import { URI } from "@/service/conection";
import {Column} from "primevue";
import {Dialog} from "primevue";
// Importa el componente InputNumber de PrimeVue

import {InputNumber} from 'primevue';
import { formatoPesosColombianos } from "@/service/utils/formatoPesos";

const hasChanges = computed(() => {
return JSON.stringify(data.value) !== JSON.stringify(oririginal_data.value);
});

const oririginal_data = ref([])
const melo = ref(true)
const data = ref([]);
const modificando = ref(false)

const update = async () => {
const response = await fetchService.get(`${URI}/get-product-integration-distrimonster`);
const productos = response.data?.data?.filter((p) => p.categoria_id == 107) || [];
data.value = productos;
// Crea una copia profunda
oririginal_data.value = JSON.parse(JSON.stringify(productos));
};
const descartar = () => {
  modificando.value = false,
  update()
}

onMounted(async () => {
  update()
});




{

}


const refresh = async() => {
  const response = await fetchService.post(`${URI}/refresh-cache-distrimonster?quipupos=0`)
  await update()
}

const updatePrices = async() => {
  const datas  = {

      "prices":data.value?.map( p => {
      return {
              "id": p.id,
              "mayor": p.mayor,
              "distribuidor": p.distribuidor
              }
  })
  }


  const response = await fetchService.put(`${URI}/update-prices`,datas)
  melo.value = true
  modificando.value = false
  update()
}



</script>

<style scoped>


.py-0{
  padding: 0;
  margin: 0;
}
</style>

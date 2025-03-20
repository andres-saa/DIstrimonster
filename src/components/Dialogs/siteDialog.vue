<template>
  <Dialog style="width: 30rem;max-width: 96%;" v-model:visible="store.visibles.currentSite" header="Selección de sede"
      :modal="true" class="dialog">
      <div class="dialog-content">
          <b class="dialog-title">
              <!-- Puedes agregar algún título global aquí si lo deseas -->
          </b>

          <!-- Contenedor principal -->
          <div class="form-container">
              <!-- Selección de Ciudad -->
              <div class="form-group">
                  <div class="label-spinner">
                      <label for="city-dropdown" class="label">¿En qué ciudad te encuentras?</label>
                      <ProgressSpinner v-if="spinnersView.ciudad" class="spinner" strokeWidth="8" fill="var(--white)"
                          animationDuration=".5s" aria-label="Cargando ciudades" />
                  </div>
                  <Dropdown id="city-dropdown" v-model="currenCity" @click="resetSelectedSite" :options="cities.filter(city => city.city_id != 15)"
                      optionLabel="city_name" placeholder="SELECCIONA UNA CIUDAD" class="dropdown" required />
              </div>

              <!-- Encabezado para selección de sede -->
              <div v-if="currenCity" class="header-text">
                <h3>{{ headerText }}</h3>
              </div>

              <!-- Lista de Sedes -->
              <div style="display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1.5rem; width: 100%; min-width: 100%;">
                <div
                  class="site-container"
                  v-for="site in filteredSites"
                  :key="site.site_id"
                  @click="selectSite(site)"
                  :class="{ 'selected-site': selectedSite && selectedSite.site_id === site.site_id }">
                    <img class="site-image" :src="`${URI}/read-product-image/300/site-${site.site_id}`" alt="Imagen de sede">
                    <div style="display: flex; flex-direction: column;">
                        <h4>SEDE {{ site.site_name }}</h4>
                        <h5 style="font-weight: 500;">{{ site.site_address }}</h5>
                    </div>
                </div>
              </div>
          </div>
      </div>
      <template #footer>
        <div class="button-container">
          <Button label="Guardar" @click="setSite" :disabled="!selectedSite" class="save-button" />
        </div>
      </template>
  </Dialog>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { Dialog } from 'primevue';
import { Dropdown } from 'primevue';
import { Button } from 'primevue';
import { ProgressSpinner } from 'primevue';
import { URI } from '@/service/conection';
import { sitesService } from '@/service/site/sitesService';
import { useSitesStore } from '@/store/site';
import { usecartStore } from '@/store/shoping_cart';
import router from '@/router';
import { fetchService } from '@/service/utils/fetchService';

const store = useSitesStore();
const cart = usecartStore();

watch(
    () => store.location.site?.site_id,
    () => {
        location.reload();
    }
);

const sites = ref([]);
const spinnersView = ref({ ciudad: false });
const cities = ref([]);
const currenCity = ref(null);
const selectedSite = ref(null);

// Computed para filtrar las sedes según la ciudad seleccionada y otras condiciones
const filteredSites = computed(() => {
  if (!currenCity.value) return [];
  return sites.value.filter(
    s => (s.show_on_web || s.site_id == 32) && s.city_id === currenCity.value.city_id
  );
});

// Computed para determinar el texto del encabezado según la cantidad de sedes disponibles
const headerText = computed(() => {
  if(filteredSites.value.length === 1){
    return `PUEDES RECOGER TU PEDIDO EN LA SEDE  ${filteredSites.value[0].site_name}`;
  }
  return "DONDE DESEAS RECOGER TU PEDIDO?";
});

// Si solo hay una sede, se selecciona automáticamente
watch(filteredSites, (newVal) => {
  if (currenCity.value) {
    if (newVal.length === 1) {
      selectedSite.value = newVal[0];
    } else {
      selectedSite.value = null;
    }
  }
});

// Reinicia la sede seleccionada cuando se cambia la ciudad
const resetSelectedSite = () => {
  selectedSite.value = null;
};

// Al hacer clic en una sede, se almacena en selectedSite
const selectSite = (site) => {
  selectedSite.value = site;
};

const setSite = async () => {
    if (!selectedSite.value) return;
    const newLocation = {
        site: selectedSite.value,
        city: currenCity.value,
    };
    store.setLocation(newLocation);
    store.setVisible('currentSite', false);
    router.push('/');
};

const getCities = async () => {
    try {
        spinnersView.value.ciudad = true;
        const response = await fetch(`${URI}/cities`);
        if (response.ok) {
            const data = await response.json();
            cities.value = data.filter(d => d.site_id != 15);
        }
    } catch (error) {
        console.error('Error obteniendo ciudades:', error);
    } finally {
        spinnersView.value.ciudad = false;
    }
};

onMounted(async() => {
    await getCities();
    sites.value = await fetchService.get(`${URI}/sites`);
});
</script>

<style scoped>
/* Estilos del Dialog */
.site-container {
  display: flex;
  width: 100%;
  min-width: 100%;
  align-items: center;
  justify-content: flex-start;
  gap: .5rem;
  padding: .5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Estilo para marcar la sede seleccionada */
.selected-site {
  background-color: yellow;
}

.site-container:hover {
  background-color: #ffe680;
}

.site-container img {
  aspect-ratio: 1 / 1;
  width: 4rem;
  border-radius: .3rem;
  object-fit: cover;
}

.dialog {
  background-color: white;
  position: relative;
  border-radius: 1rem;
  padding-top: 2rem;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialog-title {
  color: black;
  margin-bottom: 1rem;
}

.form-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  width: 100%;
  margin-bottom: 1.5rem;
}

.label-spinner {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.label {
  color: black;
  min-width: max-content;
}

.dropdown {
  width: 100%;
}

.spinner {
  width: 20px;
  height: 20px;
}

.header-text {
  width: 100%;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
  color: black;
}

.button-container {
  width: 100%;
}

.save-button {
  width: 100%;
  padding: 10px 20px;
  border: none;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.save-button:not(:disabled):hover {
  background-color: #333;
}

@media (max-width: 500px) {
  .dialog {
      width: 90%;
  }
}
</style>

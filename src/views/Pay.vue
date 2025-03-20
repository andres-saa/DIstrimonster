<template>
  <div v-if="user?.user?.cedula_nit" class="finalizar-compra-container">
    <!-- Letrero informativo -->
    <div style="margin: auto; max-width: 800px;">
      <div class="title" style="margin: 3rem .5rem">
        <!-- Se muestra el mensaje dinámico -->
        <Tag severity="success" class="advertice">{{ deliveryMessage }}</Tag>
      </div>
    </div>

    <p class="title">FINALIZAR COMPRA</p>

    <div class="form-grid">
      <div class="form-column" >
        <div style="border: 2px dashed var(--p-primary-color);padding: 1rem;border-radius: .5rem;">
          <h3>Información del Usuario</h3>
        <p><strong>Cedula / Nit:</strong> {{user.user?.cedula_nit }}</p>
        <p>
          <strong>Nombre:</strong>
          {{ user.user?.user_name }} {{ user.user?.second_name }} {{ user.user?.first_last_name }} {{ user.user?.second_last_name }}
        </p>
        <p><strong>Teléfono:</strong> {{ user.user?.user_phone }}</p>
        <p><strong>Dirección:</strong> {{ user.user?.user_address }}</p>
        <p><strong>Correo:</strong> {{ user.user?.email }}</p>
        <div style="width: 100%;margin-top: 1rem ; display: flex;justify-content: end;">
          <Button security="info" @click="() => {user.user = {}}" label="Estos no son mis datos"></Button>
          </div>
        </div>
        
        
        Sede donde vas a recoger
        <div
          class="form-group"
          @click="siteStore.setVisible('currentSite', true)"
          style="background-color: white; border: 1px solid #00000040; padding: 1rem; border-radius: .3rem;"
        >
          <div>
            <b>Ciudad:</b> {{ siteStore.location?.city.city_name }} <br />
            <b>Sede:</b> {{ siteStore.location?.site?.site_name }} <br />
            <b>Dirección:</b> {{ siteStore.location?.site?.site_address }} <br />
          </div>
        </div>
        
        Método de pago
        <div class="form-group">
          <Select
            style="width: 100%;"
            v-model="user.user.payment_method_option"
            id="payment_method"
            placeholder="METODO DE PAGO"
            :options="computedPaiments"
            optionLabel="name"
          />
        </div>

        <span>Metodo Entrega</span>
        <div class="form-group">
          <Select
            style="width: 100%;"
            v-model="user.user.order_type"
            id="metodo_de_entrega"
            placeholder="Metodo de entrega"
            :options="computedOrderTypes"
            optionLabel="name"
          />
        </div>
        Si gustas nos puedes dejar una nota
        <Textarea v-model="store.cart.order_notes" class="order-notes" placeholder="NOTAS:" />
      </div>

      <resumen class="resumen-column" />
    </div>
  </div>

  <div v-else>
    <div style="display: flex; height: 80vh; width: 100%; justify-content: center; gap: 1rem; padding: 1rem; align-items: center;">
      <Button class="button-custom" icon="pi pi-user" @click="displayRegisteredDialog = true">
        <i class="pi pi-user"></i>
        <span>Soy usuario Registrado</span>
      </Button>
      <Button severity="success" class="button-custom" icon="pi pi-plus" @click="displayNewUserDialog = true">
        <i class="pi pi-plus"></i>
        <span>No estoy registrado</span>
      </Button>
    </div>
  </div>

  <Dialog header="Buscar Usuario Registrado" v-model:visible="displayRegisteredDialog" :modal="true" :closable="true" style="width: 30rem;max-width: 95%;">
    <div class="dialog-content">
      <div class="form-group" style="gap: 2rem;">
        <label for="dni-search">Buscar por Cedula / Nit:</label>
        <InputText id="dni-search" v-model="dniSearch" placeholder="Ingrese Cedula / Nit" />
        <div v-if="noFound">

          <i  class="pi pi-times"></i>
        No se encontro un usuario con ese Id
      </div>
        <div style="display: flex; justify-content: end; width: 100%; gap: 2rem;">
          <Button icon="pi pi-search" label="Buscar" @click="searchUserByDni(dniSearch)" />
        </div>
      </div>

    
      <div class="backend-info" v-if="backendInfo" style="padding: 0; width: 100%;">
        <h3>Información del Usuario</h3>
        <p><strong>Cedula / Nit:</strong> {{ backendInfo?.user_phone }}</p>
        <p>
          <strong>Nombre:</strong>
          {{ backendInfo?.user_name }} {{ backendInfo?.second_name }} {{ backendInfo?.first_last_name }} {{ backendInfo?.second_last_name }}
        </p>
        <p><strong>Teléfono:</strong> {{ backendInfo?.user_phone }}</p>
        <p><strong>Dirección:</strong> {{ backendInfo?.user_address }}</p>
        <p><strong>Correo:</strong> {{ backendInfo?.email }}</p>
      </div>


      
      
      <div v-if="backendInfo?.cedula_nit" style="display: flex; justify-content: end; width: 100%; gap: 2rem;">
        <Button icon="pi pi-check" severity="success" label="Soy yo" @click="soy(backendInfo)" />
      </div>
    </div>
  </Dialog>

  <!-- Diálogo para nuevos usuarios -->
  <Dialog header="Registro de Usuario" v-model:visible="displayNewUserDialog" :modal="true" :closable="true" style="width: 30rem;max-width: 95%;">
    <div class="dialog-content">
      <div class="form-group">
        <label for="user_name">Primer nombre</label>
        <InputText id="user_name" v-model="newUser.user_name" placeholder="Nombre" />
      </div>

      <div class="form-group">
        <label for="second_name">Segundo Nombre</label>
        <InputText id="second_name" v-model="newUser.second_name" placeholder="Segundo Nombre" />
      </div>

      <div class="form-group">
        <label for="first_last_name">Primer Apellido</label>
        <InputText id="first_last_name" v-model="newUser.first_last_name" placeholder="Primer Apellido" />
      </div>
      <div class="form-group">
        <label for="second_last_name">Segundo Apellido</label>
        <InputText id="second_last_name" v-model="newUser.second_last_name" placeholder="Segundo Apellido" />
      </div>


      <div class="form-group">
        <label for="cedula_nit">Cédula/NIT</label>
        <InputText id="cedula_nit" v-model="newUser.cedula_nit" placeholder="Cédula o NIT" />
      </div>

      <div class="form-group">
        <label for="user_phone">Teléfono</label>
        <InputText id="user_phone" v-model="newUser.user_phone" placeholder="Teléfono" />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <InputText id="email" v-model="newUser.email" placeholder="Email" />
      </div>


      <div class="form-group">
        <label for="user_address">Dirección</label>
        <InputText id="user_address" v-model="newUser.user_address" placeholder="Dirección" />
      </div>
  
  
    
   
      <Button label="Enviar Datos" @click="create_user(newUser)" />
    </div>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import resumen from './resumen.vue';
import { usecartStore } from '@/store/shoping_cart';
import { useSitesStore } from '@/store/site';
import { useUserStore } from '@/store/user';
import { Button } from 'primevue';
import { Textarea } from 'primevue';
import { Tag } from 'primevue';
import { InputText } from 'primevue';
import { InputMask } from 'primevue';
import { Dialog } from 'primevue';
import { Select } from 'primevue';
import Holidays from 'date-holidays';
import { fetchService } from '@/service/utils/fetchService';
import { URI } from '@/service/conection';

const store = usecartStore();
const siteStore = useSitesStore();
const user = useUserStore();
const payment_method_options = ref([]);

const soy = (man) => {
  user.user = man;
  displayRegisteredDialog.value = false;
};

const noFound = ref(false)

const searchUserByDni = async (dni) => {
  if (!dni || dni.split(' ').join('') == '') {
    alert('Necestiamos un documento para poder buscarte en la base de datos');
    return;
  }
  if (dni.includes(' ')) {
    alert('No puedes incuir espacios en el documento');
    return;
  }
  const response = await fetchService.get(`${URI}/get-distrimonster-user-by-dni/${dni}`);

  if (!response){
    noFound.value = true
  }
  if (response.user_id) {
    backendInfo.value = response;
  }

  console.log(response);
};

const displayRegisteredDialog = ref(false);
const displayNewUserDialog = ref(false);
const dniSearch = ref('');
const backendInfo = ref(null);

const newUser = ref({
  user_name: '',
  user_phone: '',
  user_address: '',
  site_id: '32',
  cedula_nit: '',
  email: '',
  first_last_name: '',
  second_last_name: '',
  second_name: ''
});


const create_user = async (user_new) => {
  const errors = [];

  // Validamos cada campo obligatorio
  if (!user_new.user_name || user_new.user_name.trim() === '') {
    alert('El nombre es obligatorio para el registro.');
    return
  }
  if (!user_new.user_phone || user_new.user_phone.trim() === '') {
    alert('El teléfono es obligatorio para el registro.');
    return
  }
  if (!user_new.user_address || user_new.user_address.trim() === '') {
    alert('La dirección es obligatoria para el registro.');
    return
  }
  if (!user_new.site_id || user_new.site_id.trim() === '') {
    alert('El ID del sitio es obligatorio para el registro.');
    return
  }
  if (!user_new.cedula_nit || user_new.cedula_nit.trim() === '') {
    alert('La cédula o NIT es obligatorio para el registro.');
    return
  }
  if (!user_new.email || user_new.email.trim() === '') {
    alert('El correo electrónico es obligatorio para el registro.');
    return
  }
  if (!user_new.first_last_name || user_new.first_last_name.trim() === '') {
    alert('El primer apellido es obligatorio para el registro.');
    return
  }


  const response = await fetchService.post(`${URI}/create-distrimonster-user`, user_new)
  
  if (response[0]) {
    user.user = response[0]
    displayNewUserDialog.value = false
  }
  
};





// Para efectos del mensaje, definimos una ciudad seleccionada.
const computedOrderTypes = computed(() => {
  const currentCityId = siteStore.location?.site?.city_id;
  const currentSiteId = siteStore.location?.site?.site_id;
  if (currentSiteId == 32) {
    return order_types.value.filter(option => option.id == 5);
  } else {
    return order_types.value.filter(option => option.id == 4);
  }
});

const computedPaiments = computed(() => {
  const currentCityId = siteStore.location?.site?.city_id;
  const currentSiteId = siteStore.location?.site?.site_id;
  if (currentSiteId == 32) {
    return payment_method_options.value.filter(option => option.id == 6 || option.id == 8);
  } else {
    return payment_method_options.value.filter(option => option.id == 6);
  }
});

// Configuración de información de corte por ciudad
const cutoffInfo = {
  "10_5": { cutoffDay: 'antes del miércoles', cutoffTime: '12:00' }, // cali recoger
  "10_3": { cutoffDay: 'antes del miércoles', cutoffTime: '12:00' }, // calisede
  "8_4": { cutoffDay: 'antes del lunes', cutoffTime: '12:00' }, // bogota
  "9_4": { cutoffDay: 'antes del miércoles', cutoffTime: '12:00' } // medallo
};

const order_types = ref([]);

onMounted(async () => {
  user.user.order_type = null;
  payment_method_options.value = await fetchService.get(`${URI}/payment_methods`);
  order_types.value = await fetchService.get(`${URI}/get_all_order_types`);
  user.user.order_type = computedOrderTypes.value[0];
  
  if (user.user.payment_method_option?.id != 7) {
    siteStore.setNeighborhoodPrice();
  } else {
    siteStore.setNeighborhoodPriceCero();
  }
});

function esFestivo(fecha) {
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  const fechaFormateada = `${año}-${mes}-${dia}`;
  const festivos = [
    "2025-01-01", "2025-01-06",
    "2025-02-02",
    "2025-03-18", "2025-03-19", "2025-03-24",
    "2025-04-17", "2025-04-18",
    "2025-05-01",
    "2025-06-02", "2025-06-23", "2025-06-30",
    "2025-07-20",
    "2025-08-07", "2025-08-18",
    "2025-09-13",
    "2025-10-03", "2025-10-17",
    "2025-11-08",
    "2025-12-08", "2025-12-25"
  ];
  return festivos.includes(fechaFormateada);
}

function sumarRestarDias(fecha, dias) {
  const resultado = new Date(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

const calculate_cali_recoger = (date = new Date()) => {
  let final_date = new Date(date);
  if (final_date.getDay() === 0) {
    final_date = sumarRestarDias(final_date, 1);
  } else if (final_date.getDay() === 6) {
    final_date = sumarRestarDias(final_date, 2);
  } else {
    final_date = sumarRestarDias(final_date, 1);
  }
  while (esFestivo(final_date)) {
    final_date = sumarRestarDias(final_date, 1);
  }
  return final_date;
};

const calculate_cali_recoger_sede = (date = new Date()) => {
  let orderDate = new Date(date);
  let deliveryDate;
  const saturdayCutoff = new Date(orderDate);
  saturdayCutoff.setHours(12, 0, 0, 0);
  const wednesdayCutoff = new Date(orderDate);
  wednesdayCutoff.setHours(12, 0, 0, 0);
  const day = orderDate.getDay();

  if (day === 6) {
    if (orderDate < saturdayCutoff) {
      deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + 2);
    } else {
      deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + 5);
    }
  } else if (day === 3) {
    if (orderDate < wednesdayCutoff) {
      deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + 1);
    } else {
      deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + 5);
    }
  } else {
    if (day < 3) {
      deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + (4 - day));
    } else {
      deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + (8 - day));
    }
  }
  while (esFestivo(deliveryDate)) {
    deliveryDate = sumarRestarDias(deliveryDate, 1);
  }
  return deliveryDate;
};

const calculate_bogota = (date = new Date()) => {
  let final_date = new Date(date);
  let horaCorteLunes = new Date(final_date);
  horaCorteLunes.setHours(12, 0, 0, 0);
  
  if (final_date.getDay() === 1 && final_date < horaCorteLunes) {
    final_date.setDate(final_date.getDate() + 3);
  } else {
    final_date.setDate(final_date.getDate() + (11 - final_date.getDay()));
  }
  while (esFestivo(final_date)) {
    final_date = sumarRestarDias(final_date, 1);
  }
  return final_date;
};

const calculate_medellin = (date = new Date()) => {
  let final_date = new Date(date);
  let horaCorteMiercoles = new Date(final_date);
  horaCorteMiercoles.setHours(12, 0, 0, 0);
  
  if (final_date.getDay() < 3 || (final_date.getDay() === 3 && final_date < horaCorteMiercoles)) {
    final_date.setDate(final_date.getDate() + (6 - final_date.getDay()));
  } else {
    final_date.setDate(final_date.getDate() + (6 - final_date.getDay()) + 14);
  }
  while (esFestivo(final_date)) {
    final_date = sumarRestarDias(final_date, 1);
  }
  return final_date;
};

const calculate_fecha_entrega = (date, city, metodoEntregaId = 3) => {
  let fechaEntrega;
  switch (city) {
    case 10:
      if (metodoEntregaId === 5) {
        fechaEntrega = calculate_cali_recoger(date);
      } else if (metodoEntregaId === 4) {
        fechaEntrega = calculate_cali_recoger_sede(date);
      } else {
        fechaEntrega = new Date(date);
      }
      break;
    case 8:
      fechaEntrega = calculate_bogota(date);
      break;
    case 9:
      fechaEntrega = calculate_medellin(date);
      break;
    default:
      fechaEntrega = new Date(date);
  }
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return fechaEntrega.toLocaleDateString('es-ES', opciones);
};

const deliveryMessage = computed(() => {
  const fechaEntrega = calculate_fecha_entrega(new Date(), siteStore.location?.site?.city_id);
  const info = cutoffInfo[`${siteStore.location?.site?.city_id}_${user?.user?.order_type?.id}`] || { cutoffDay: 'día', cutoffTime: 'HH:MM' };

  if (user?.user?.order_type?.id == 2) {
    return `Para recoger en la planta ${siteStore.location?.site?.site_name} el ${fechaEntrega} si compras ${info.cutoffDay} a las ${info.cutoffTime}`;
  } else {
    return `Para recoger en la sede ${siteStore.location?.site?.site_name} el ${fechaEntrega} si compras ${info.cutoffDay} a las ${info.cutoffTime}`;
  }
});

watch(deliveryMessage, () => {
  store.cart.delivery_horaentrega = deliveryMessage;
});
</script>

<style scoped>
.finalizar-compra-container {
  padding: 0;
  margin-bottom: 2rem;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin: 2rem 0;
  font-weight: bold;
}

.advertice {
  animation: anim_status_tag 2s infinite ease;
  color: black;
  padding: 1rem;
  font-weight: 400;
  font-size: 1.1rem;
}

@keyframes anim_status_tag {
  20% {
    background-color: rgb(0, 255, 110);
  }
  50% {
    background-color: rgb(0, 255, 204);
    transform: scale(1.02);
  }
  80% {
    background-color: rgb(0, 255, 140);
  }
}

.form-grid {
  display: grid;
  max-width: 800px;
  margin: 0 auto;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.25rem;
}

.form-group {
  display: flex;
  align-items: start;
  gap: 1rem;
  width: 100%;
}

.order-notes {
  height: 8rem;
  resize: none;
  width: 100%;
}

.resumen-column {
  /* Puedes agregar estilos específicos si es necesario */
}

*:focus {
  outline: none;
  border: none;
}

.button-custom {
  width: 50%;
  aspect-ratio: 1/1;
  font-size: clamp(1rem, 2vw, 2rem);
  max-width: 20rem;
  max-height: 20rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.button-custom i {
  font-size: clamp(3rem, 5vw, 6rem);
}

.button-custom span {
  font-size: clamp(1rem, 2vw, 2rem);
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.button-custom {
  width: 50%;
  aspect-ratio: 1 / 1;
  font-size: clamp(1rem, 2vw, 2rem);
  max-width: 20rem;
  max-height: 20rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.button-custom i {
  font-size: clamp(3rem, 5vw, 6rem);
}

.button-custom span {
  font-size: clamp(1rem, 2vw, 2rem);
}

input,
textarea,
select {
  width: 100%;
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 1rem;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(255, 0, 0);
  border-radius: 9px;
  border: 5px solid var(--primary-color);
}
</style>

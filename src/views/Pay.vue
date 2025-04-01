<template>
  <div v-if="user.user?.cedula_nit" class="finalizar-compra-container">
    <!-- Mensaje de entrega -->
    <div class="sticky-message" v-if="!siteStore.visibles.currentSite" >
      <Tag
        severity="success"
        class="advertice"
        style="box-shadow: 0 1rem 1rem #00000030;border-radius: 0;"
      > <span> <strong>Importante:</strong> {{ deliveryMessage }} </span>

      </Tag>
    </div>

    <p class="title">FINALIZAR COMPRA</p>

    <div class="form-grid">
      <!-- Columna de formulario -->
      <div class="form-column">
        <!-- Información del usuario -->
        <div class="user-info">
          <h3>Información del Usuario</h3>
          <p>
            <strong>Cédula / Nit:</strong> {{ user.user?.cedula_nit }}
          </p>
          <p>
            <strong>Nombre:</strong>
            {{ user.user?.user_name }} {{ user.user?.second_name }}
            {{ user.user?.first_last_name }} {{ user.user?.second_last_name }}
          </p>
          <p><strong>Teléfono:</strong> **********</p>
          <p><strong>Dirección:</strong> *********</p>
          <p><strong>Correo:</strong> ******@*****.com</p>
          <div class="button-end">
            <Button
              security="info"
              @click="() => { user.user = {} }"
              label="Estos no son mis datos"
            />
          </div>
        </div>

        <!-- Selección de sede -->
        <label>Sede donde vas a recoger</label>
        <div
          class="form-group clickable"
          @click="siteStore.setVisible('currentSite', true)"
        >
          <div>
            <b>Ciudad:</b> {{ siteStore.location?.city?.city_name }} <br />
            <b>Sede:</b> {{ siteStore.location?.site?.site_name }} <br />
            <b>Dirección:</b> {{ siteStore.location?.site?.site_address }} <br />
          </div>
        </div>

        <!-- Método de pago -->
        <label>Método de pago</label>
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

        <!-- Método de entrega -->
        <label>Método Entrega</label>
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

        <!-- Notas de la orden -->
        <label>Si gustas nos puedes dejar una nota</label>
        <Textarea
          v-model="store.cart.order_notes"
          class="order-notes"
          placeholder="NOTAS:"
        />
      </div>

      <!-- Componente de resumen -->
      <resumen class="resumen-column" />
    </div>
  </div>

  <!-- Vista para usuarios no registrados -->
  <div v-else class="not-registered">
    <Button class="button-custom" icon="pi pi-user" @click="displayRegisteredDialog = true">
      <i class="pi pi-user"></i>
      <span>Soy usuario Registrado</span>
    </Button>
    <Button
      severity="success"
      class="button-custom"
      icon="pi pi-plus"
      @click="displayNewUserDialog = true"
    >
      <i class="pi pi-plus"></i>
      <span>No estoy registrado</span>
    </Button>
  </div>

  <!-- Diálogo: Buscar Usuario Registrado -->
  <Dialog
    header="Buscar Usuario Registrado"
    v-model:visible="displayRegisteredDialog"
    :modal="true"
    :closable="true"
    style="width: 30rem; max-width: 95%;"
  >
    <div class="dialog-content">
      <div class="form-group">
        <label for="dni-search">Buscar por Cédula / Nit:</label>
        <InputText
          id="dni-search"
          v-model="dniSearch"
          placeholder="Ingrese Cédula / Nit"
        />
        <div v-if="noFound" class="not-found">
          <i class="pi pi-times"></i>
          No se encontró un usuario con ese Id
        </div>
        <div class="button-end">
          <Button
            icon="pi pi-search"
            label="Buscar"
            @click="searchUserByDni(dniSearch)"
          />
        </div>
      </div>

      <div class="backend-info" v-if="backendInfo">
        <h3>Información del Usuario</h3>
        <p>
          <strong>Cédula / Nit:</strong> {{ backendInfo?.cedula_nit }}
        </p>
        <p>
          <strong>Nombre:</strong>
          {{ backendInfo?.user_name }} {{ backendInfo?.second_name }}
          {{ backendInfo?.first_last_name }} {{ backendInfo?.second_last_name }}
        </p>
        <p><strong>Teléfono:</strong> **********</p>
        <p><strong>Dirección:</strong> **********</p>
        <p><strong>Correo:</strong> *****@****.com</p>
      </div>

      <div v-if="backendInfo?.cedula_nit" class="button-end">
        <Button
          icon="pi pi-check"
          severity="success"
          label="Soy yo"
          @click="selectUser(backendInfo)"
        />
      </div>
    </div>
  </Dialog>

  <!-- Diálogo: Registro de Usuario -->
  <Dialog
    header="Registro de Usuario"
    v-model:visible="displayNewUserDialog"
    :modal="true"
    :closable="true"
    style="width: 30rem; max-width: 95%;"
  >
    <div class="dialog-content">
      <div class="form-group">
        <label for="user_name">Primer nombre</label>
        <InputText id="user_name" v-model="newUser.user_name" placeholder="Nombre" />
      </div>
      <div class="form-group">
        <label for="second_name">Segundo nombre</label>
        <InputText id="second_name" v-model="newUser.second_name" placeholder="Segundo nombre" />
      </div>
      <div class="form-group">
        <label for="first_last_name">Primer apellido</label>
        <InputText id="first_last_name" v-model="newUser.first_last_name" placeholder="Primer apellido" />
      </div>
      <div class="form-group">
        <label for="second_last_name">Segundo apellido</label>
        <InputText id="second_last_name" v-model="newUser.second_last_name" placeholder="Segundo apellido" />
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
      <div class="button-end">
        <Button label="Enviar Datos" @click="create_user(newUser)" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
/* ========= Importaciones ========= */
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import resumen from './resumen.vue';
import { usecartStore } from '@/store/shoping_cart';
import { useSitesStore } from '@/store/site';
import { useUserStore } from '@/store/user';
import { Button, Textarea, Tag, InputText, Dialog, Select } from 'primevue';
import { fetchService } from '@/service/utils/fetchService';
import { URI } from '@/service/conection';


/* ========= Variables Reactivas y Stores ========= */
const horaColombia = ref(new Date());
const store = usecartStore();
const siteStore = useSitesStore();
const user = useUserStore();

// Opciones de métodos de pago y tipos de orden
const payment_method_options = ref([]);
const order_types = ref([]);

// Variables para diálogos y búsqueda
const displayRegisteredDialog = ref(false);
const displayNewUserDialog = ref(false);
const dniSearch = ref('');
const backendInfo = ref(null);
const noFound = ref(false);

// Objeto para nuevo usuario
const newUser = ref({
  user_name: '',
  user_phone: '',
  user_address: 'sin direccion',
  site_id: '32',
  cedula_nit: '',
  email: '',
  first_last_name: '',
  second_last_name: '',
  second_name: ''
});

// Variable para asegurar que se actualice la hora una sola vez
const updated = ref(false);

// Objeto para información de corte (cutoff)
const cutoffInfoResult = ref({ cutoffDay: 'día', cutoffTime: 'HH:MM' });

/* ========= Funciones Auxiliares ========= */
function sumarRestarDias(fecha, dias) {
  const resultado = new Date(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

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

function formatDate(fecha) {
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return fecha.toLocaleDateString('es-ES', opciones);
}

/* ========= Funciones de Hora y Fecha ========= */
const obtenerHoraColombia = async () => {
  try {
    const response = await fetch('https://backend.salchimonster.com/server_time');
    const data = await response.json();
    horaColombia.value = new Date(data);
  } catch (error) {
    console.error('Error obteniendo la hora de Colombia', error);
  }
};

const calculate_cali_recoger = () => {
  let final_date = new Date(horaColombia.value);



  if (final_date.getHours() > 11) {
    final_date = sumarRestarDias(final_date, 1);
  }


  // si cae un sabado sumamos dos dias, ya se cuenta desde el lunes
  if (final_date.getDay() === 6 ) {
    final_date = sumarRestarDias(final_date, 2);}



  // si cae un domingo sumamos 1 diae, ya se cuenta desde el lunes

  else if (final_date.getDay() === 0) {
      final_date = sumarRestarDias(final_date, 1);


  } else if (final_date.getDay() === 5) {

    final_date = sumarRestarDias(final_date, 3);
  } else {

    final_date = sumarRestarDias(final_date, 1);
  }



  while (esFestivo(final_date)) {
    final_date = sumarRestarDias(final_date, 1);
  }


  return final_date;

};

const calculate_cali_recoger_sede = () => {
  let orderDate = horaColombia.value


  // orderDate = sumarRestarDias(orderDate,6)
  // orderDate.setHours(12)

 if (orderDate.getDay() == 1){
   orderDate = sumarRestarDias(orderDate,3)

 }
 //si es martes

 else if (orderDate.getDay() == 2){
   orderDate = sumarRestarDias(orderDate,2)
 }
 //si es miercoles

 else if (orderDate.getDay() == 3){
  if (orderDate.getHours() < 12){
    orderDate = sumarRestarDias(orderDate,1)
  } else {
    orderDate = sumarRestarDias(orderDate,5)
  }
 }


 else if (orderDate.getDay() == 4){
   orderDate = sumarRestarDias(orderDate,4)
 }

 else if (orderDate.getDay() == 5){
   orderDate = sumarRestarDias(orderDate,3)
 }

 else if (orderDate.getDay() == 6){
  if (orderDate.getHours() < 12){
    orderDate = sumarRestarDias(orderDate,2)
  } else {
    orderDate = sumarRestarDias(orderDate,5)
  }
 }


 else if (orderDate.getDay() == 0){
   orderDate = sumarRestarDias(orderDate,4)
 }

// 32	"ACOPI YUMBO ( PRINCIPAL )"
// 8	"SUBA"
// 1	"BRETAÑA"
// 10	"KENNEDY"
// 33	"NEW JERSEY"
// 11	"LAURELES"
// 4	"JAMUNDI"
// 9	"MONTES"
// 29	"CHAPINERO"
// 2	"FLORA"
// 3	"CANEY"
// 7	"MODELIA"
// 30	"USAQUEN"


if (siteStore.location.site?.site_id == 4 && orderDate.getDay() == 1){
   orderDate = sumarRestarDias(orderDate,3)
}
  while (esFestivo(orderDate)) {
    orderDate = sumarRestarDias(orderDate, 1);
  }
  return orderDate;
};





const calculate_bogota = () => {
  let final_date = horaColombia.value;

  if (final_date.getDay() == 1){
    if (final_date.getHours() < 12){
      final_date = sumarRestarDias(final_date, 3)
    } else {
      final_date = sumarRestarDias(final_date, 10)
    }
  } else if (final_date.getDay() == 2){
    final_date = sumarRestarDias(final_date,9)
  }else if (final_date.getDay() == 3){
    final_date = sumarRestarDias(final_date,8)
  }else if (final_date.getDay() == 4){
    final_date = sumarRestarDias(final_date,7)
  }else if (final_date.getDay() == 5){
    final_date = sumarRestarDias(final_date,6)
  }else if (final_date.getDay() == 6){
    final_date = sumarRestarDias(final_date,5)
  }else if (final_date.getDay() == 0){
    final_date = sumarRestarDias(final_date,4)
  }


  return final_date;
};


function cumplePeriodoQuincenal(fechaInicio, fechaFin) {
  const msPorDia = 1000 * 60 * 60 * 24;
  const diferenciaDias = Math.floor((fechaFin - fechaInicio) / msPorDia);
  return diferenciaDias % 14 === 0;
}



const calculate_medellin = () => {
  let final_date = horaColombia.value
  let base_date = new Date('2025/03/29') // este es el ultimo dia que salio ruta

  //asi se le suman y restan dias a la fecha actual
  // nueva = sumarRestarDias(nueva,3)  acabo de sumar 3 dias a la fecha llamada nueva
  let diffMs = final_date - base_date;
  // Convertir milisegundos a semanas: 1 semana = 7 días * 24 hrs * 60 min * 60 seg * 1000 ms
  let weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  console.log(weeks)

  // calcular la ultima vez que salio

  while (final_date.getDay() != 6){
    final_date = sumarRestarDias(final_date,-1)
  }

  if (cumplePeriodoQuincenal(base_date,final_date)){

    final_date = sumarRestarDias(final_date,14)
    // alert('here')
  }else {
    if (horaColombia.value.getDay()  == 3 && horaColombia.value.getHours() > 11){
      final_date = sumarRestarDias(final_date,21)
    } else {
      final_date = sumarRestarDias(final_date,7)
    }

  }

  while (esFestivo(final_date)) {
    final_date = sumarRestarDias(final_date, 1);
  }
  // console.log(final_date)
  return final_date

};

const calculate_fecha_entrega = (date, city, metodoEntregaId = 3) => {
  let fechaEntrega;
  switch (city) {
    case 10:
      if (metodoEntregaId === 5) {
        fechaEntrega = calculate_cali_recoger();
      } else if (metodoEntregaId === 4) {
        fechaEntrega = calculate_cali_recoger_sede(date);
      } else {
        fechaEntrega = new Date(date);
      }
      break;

      case 13:
        fechaEntrega = calculate_cali_recoger_sede(date);
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
  store.delivery_horaentrega = formatDate(fechaEntrega);
  return formatDate(fechaEntrega);
};

/* ========= Funciones de Actualización y Selección ========= */
const updateCutoffInfo = async () => {
  const city = siteStore.location.site.city_id;
  const order_type = user.user?.order_type?.id;

  if (!updated.value) {
    await obtenerHoraColombia();
    updated.value = true;
  }

  if (city === 10 && order_type === 5) {
    const now_hour = horaColombia.value.getHours();
    const now_day = horaColombia.value.getDay();
    console.log(now_hour, now_day);

    // Calcular fecha de entrega para Cali y determinar el corte un día antes
    const entrega = calculate_cali_recoger();
    let corte = sumarRestarDias(entrega, -1);
    while (corte.getDay() === 0) {
      corte = sumarRestarDias(corte, -1);
    }
    const texto = `antes del ${formatDate(corte)}`;
    cutoffInfoResult.value = {
      cutoffDay: texto,
      moment: 'a las',
      cutoffTime: '12:00 p.m.'
    };
  }

  if (city === 10 && order_type === 4) {
    const now_hour = horaColombia.value.getHours();
    const now_day = horaColombia.value.getDay();
    console.log(now_hour, now_day);

    // Calcular fecha de entrega para Cali y determinar el corte un día antes
    const entrega = calculate_cali_recoger_sede();
    let corte = sumarRestarDias(entrega, -1);

    while (corte.getDay() === 0) {
      corte = sumarRestarDias(corte, -1);
    }

    const texto = `antes del ${formatDate(corte)}`;
    cutoffInfoResult.value = {
      cutoffDay: texto,
      moment: 'a las',
      cutoffTime: '12:00 p.m.'
    };
  }

  if (city === 13 && order_type === 4) {
    const now_hour = horaColombia.value.getHours();
    const now_day = horaColombia.value.getDay();
    console.log(now_hour, now_day);

    // Calcular fecha de entrega para Cali y determinar el corte un día antes
    const entrega = calculate_cali_recoger_sede();
    let corte = sumarRestarDias(entrega, -1);

    while (corte.getDay() === 0) {
      corte = sumarRestarDias(corte, -1);
    }

    const texto = `antes del ${formatDate(corte)}`;
    cutoffInfoResult.value = {
      cutoffDay: texto,
      moment: 'a las',
      cutoffTime: '12:00 p.m.'
    };
  }

  if (city === 8 && order_type === 4) {
    const now_hour = horaColombia.value.getHours();
    const now_day = horaColombia.value.getDay();
    console.log(now_hour, now_day);

    // Calcular fecha de entrega para Cali y determinar el corte un día antes
    const entrega = calculate_bogota();
    let corte = sumarRestarDias(entrega, -3);

    while (corte.getDay() === 0) {
      corte = sumarRestarDias(corte, -1);
    }

    const texto = `antes del ${formatDate(corte)}`;
    cutoffInfoResult.value = {
      cutoffDay: texto,
      moment: 'a las',
      cutoffTime: '12:00 p.m.'
    };
  }

  if (city === 9 && order_type === 4) {
    const now_hour = horaColombia.value.getHours();
    const now_day = horaColombia.value.getDay();
    console.log(now_hour, now_day);

    // Calcular fecha de entrega para Cali y determinar el corte un día antes
    const entrega = calculate_medellin();
    let corte = sumarRestarDias(entrega, -3);

    const texto = `antes del ${formatDate(corte)}`;
    cutoffInfoResult.value = {
      cutoffDay: texto,
      moment: 'a las',
      cutoffTime: '12:00 p.m.'
    };
  }
  // Se puede extender para otros casos de city y order_type
};

const update_order_type = async () => {
  order_types.value = await fetchService.get(`${URI}/get_all_order_types`);
  user.user.order_type = computedOrderTypes.value[0];
};

const searchUserByDni = async (dni) => {
  if (!dni || dni.trim() === '') {
    alert('Necesitamos un documento para poder buscarte en la base de datos');
    return;
  }
  if (dni.includes(' ')) {
    alert('No puedes incluir espacios en el documento');
    return;
  }
  const response = await fetchService.get(`${URI}/get-distrimonster-user-by-dni/${dni}`);
  if (!response) {
    noFound.value = true;
    return;
  }
  if (response.user_id) {
    backendInfo.value = response;
  }
};

const selectUser = (usuario) => {
  user.user = usuario;
  displayRegisteredDialog.value = false;
};

const create_user = async (user_new) => {
  // Validación de campos obligatorios
  if (!user_new.user_name?.trim()) {
    alert('El nombre es obligatorio para el registro.');
    return;
  }
  if (!user_new.user_phone?.trim()) {
    alert('El teléfono es obligatorio para el registro.');
    return;
  }
  if (!user_new.site_id?.trim()) {
    alert('El ID del sitio es obligatorio para el registro.');
    return;
  }
  if (!user_new.cedula_nit?.trim()) {
    alert('La cédula o NIT es obligatorio para el registro.');
    return;
  }
  if (!user_new.email?.trim()) {
    alert('El correo electrónico es obligatorio para el registro.');
    return;
  }
  if (!user_new.first_last_name?.trim()) {
    alert('El primer apellido es obligatorio para el registro.');
    return;
  }
  const response = await fetchService.post(`${URI}/create-distrimonster-user`, user_new);
  if (response[0]) {
    user.user = response[0];
    displayNewUserDialog.value = false;
  }
};

/* ========= Computed Properties ========= */
const computedOrderTypes = computed(() => {
  const currentSiteId = siteStore.location?.site?.site_id;
  if (currentSiteId === 32) {
    return order_types.value.filter(option => option.id === 5);
  } else {
    return order_types.value.filter(option => option.id === 4);
  }
});

const computedPaiments = computed(() => {
  const currentSiteId = siteStore.location?.site?.site_id;
  if (currentSiteId === 32) {
    return payment_method_options.value.filter(option => option.id === 6 || option.id === 8);
  } else {
    return payment_method_options.value.filter(option => option.id === 6);
  }
});

const deliveryMessage = computed(() => {
  const fechaEntrega = calculate_fecha_entrega(
    new Date(horaColombia.value),
    siteStore.location?.site?.city_id,
    user.user?.order_type?.id
  );
  const info = cutoffInfoResult.value;
  if (user.user?.order_type?.id === 5) {
    return `Para recoger en la planta ${siteStore.location?.site?.site_name} el ${fechaEntrega} si compras ${info.cutoffDay} ${info.moment} ${info.cutoffTime}`;
  } else {
    return `Para recoger en la sede ${siteStore.location?.site?.site_name} el ${fechaEntrega} si compras ${info.cutoffDay} a las ${info.cutoffTime}`;
  }
});

/* ========= Hooks ========= */
onMounted(async () => {
  await update_order_type();
  await obtenerHoraColombia();

  payment_method_options.value = await fetchService.get(`${URI}/payment_methods`);



  if (user.user.payment_method_option?.id !== 7) {
    siteStore.setNeighborhoodPrice();
  } else {
    siteStore.setNeighborhoodPriceCero();
  }
});

// Actualizar información de corte cuando cambie la ciudad o el tipo de orden
watch(
  () => [siteStore.location?.site?.city_id, user.user?.order_type?.id],
  async () => {
    await updateCutoffInfo();
  }
);
</script>

<style scoped>
/* Contenedor principal */
.finalizar-compra-container {
  padding: 0;
  margin-bottom: 2rem;
}

/* Títulos y mensajes */
.title {
  text-align: center;
  font-size: 2rem;
  margin: 2rem 0;
  font-weight: bold;
}

.sticky-message {
  margin: auto;
  width: 100%;
  max-width: 100%;
  position: sticky;
  top: 3.5rem;
  z-index: 10000;
  /* overflow: hidden; */
}

/* Estilo del Tag de mensaje */
.advertice {
  animation: anim_status_tag 2s infinite  linear;
  color: black;
  width: 100%;
  padding: 1rem;
  font-weight: 400;
  font-size: 1.1rem;
}

@keyframes anim_status_tag {
  0% { transform: translateX(0) ;background-color:rgb(87, 255, 244);}
 5% { }
 10% {  ; }
 25% { ;background-color:rgb(255, 255, 255);}
 100% { transform: translateX(0) }
}

/* Grid y columnas */
.form-grid {
  display: grid;
  max-width: 900px;
  margin: 0 auto;
  padding: 0.5rem;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1.5fr 2fr;
  }
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.25rem;
}

/* Grupos de formulario */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

/* Elementos clickeables */
.clickable {
  background-color: white;
  border: 1px solid #00000040;
  padding: 1rem;
  border-radius: 0.3rem;
  cursor: pointer;
}

/* Información del usuario */
.user-info {
  border: 2px dashed var(--p-primary-color);
  padding: 1rem;
  border-radius: 0.5rem;
}

/* Botones alineados a la derecha */
.button-end {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  justify-content: end;
  gap: 1rem;
}

/* Área de notas */
.order-notes {
  height: 8rem;
  resize: none;
  width: 100%;
}

/* Estilos para vista no registrada */
.not-registered {
  display: flex;
  height: 80vh;
  width: 100%;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
}

/* Botón personalizado */
.button-custom {
  width: 50%;
  aspect-ratio: 1 / 1;
  font-size: clamp(1rem, 2vw, 2rem);
  max-width: 20rem;
  max-height: 20rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

/* Diálogos */
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 1rem;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(255, 0, 0);
  border-radius: 9px;
  border: 5px solid var(--primary-color);
}

/* Texto en mayúscula sólo en el primer carácter */
* {
  text-transform: capitalize;
}

/* Mensaje de error en búsqueda */
.not-found {
  color: red;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>

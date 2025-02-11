import './assets/main.css'
// import 'primevue/resources/themes/lara-light-indigo/theme.css'; // O tu tema personalizado
// import 'primevue/resources/primevue.min.css'; // Estilos básicos de PrimeVue
import 'primeicons/primeicons.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import Nora from '@primevue/themes/nora'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { randomHoverColor } from './service/randomHoverColor';
import { randomHoverBorderColor } from './service/randomHoverBorderColor';
import App from './App.vue'
import router from './router'
const app = createApp(App)
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#ff0042',
      100: '#ff0043',
      200: '#fff100',
      300: '#ff0044',
      400: '#fff101',
      500: '#ff0042',
      600: '#ff0043',
      700: '#fff100',
      800: '#ff0044',
      900: '#fff101',
      950: '#ff0042',
    },
    secondary: {
      50: '#fff100',
      100: '#fff101',
      200: '#fff100',
      300: '#fff101',
      400: '#fff100',
      500: '#fff101',
      600: '#fff100',
      700: '#fff101',
      800: '#fff100',
      900: '#fff101',
      950: '#fff100',
    },
    barra: {
      100: '#ff0042',
    },
    colorScheme: {
      light: {
        surface: {
          // 0: '#ffffff',
          // 50: '#fff100',
          // 100: '#fff101',
          // 200: '#ff0042',
          // 300: '#ff0043',
          // 400: '#ff0044',
          // 500: '#fff100',
          // 600: '#fff101',
          // 700: '#ff0042',
          // 800: '#ff0043',
          // 900: '#ff0044',
          // 950: '#fff100',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#fff100',
          100: '#fff101',
          200: '#ff0042',
          300: '#ff0043',
          400: '#ff0044',
          500: '#fff100',
          600: '#fff101',
          700: '#ff0042',
          800: '#ff0043',
          900: '#ff0044',
          950: '#fff100',
        },
        // formField: {
        //   hoverBorderColor: '#ff0042',
        // },
      },
    },
  },
})



const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(ToastService);
app.directive('random-hover-color', randomHoverColor)
app.directive('random-hover-border-color', randomHoverBorderColor)

app.use(PrimeVue, {

  // Default theme configuration
  theme: {
    preset: MyPreset,
    options: {
      prefix: 'p',
      darkModeSelector: '.my-app-dark',
      // cssVariables: true, // Asegúrate de habilitar el uso de variables CSS
      cssLayer: {
        name: 'primevue',
        order: 'primevue,app-styles, another-css-library',
      },
    },
  },
})

app.mount('#app')

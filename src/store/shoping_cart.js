import { defineStore } from 'pinia'
import { URI } from '../service/conection'
import { menu } from './menu.js';
export const usecartStore = defineStore('salchi_super_cart_web4433d', {
  persist: {
    key: 'salchi_super_cart_web4433d',
    storage: sessionStorage,
    paths: ['cart', 'last_order', 'menu', ],
  },
  state: () => ({
    currentProduct: {},
    currentSection: {},
    currentVideoIndex: 0,
    currentVideoTime: 0,

    visibles: {
      currentProduct: false,
      addAdditionToCart: false,
      loading:true,
      last_order: '',
    },

    cart: [],
    delivery_horaentrega:new Date(),
    last_order: '',
    sending_order: false,
    was_reserva: false,
    menu:menu
  }),

  getters: {
    // cartTotal(state) {
    //   return state.cart.reduce((acc, item) => acc + item.pedido_precio, 0)
    // },

    cartTotal(state){
      if (!Array.isArray(state.cart) || state.cart.length === 0) return 0;

      return state.cart.reduce((total, product) => total + this.calculateTotalProduct(product), 0);
  },




    // Getter para verificar si existe un producto por ID en el carrito
    isProductInCart: (state) => (productId) => {
      return state.cart.some((item) => {
        return item.pedido_productoid === productId
      })
    },

    // (Esta parecía repetida en tu código original)
    isProductInCart2: (state) => (productId) => {
      return state.cart.products?.some((product) => {
        return product.product.productogeneral_id === productId
      })
    },

    // Ejemplo de getter para calcular el total de un producto fuera de las actions
    getProductTotal: () => (product) => {
      // Si el combo ya tiene su precio final, NO sumamos sus "sub-productos"
      // sino que solo usamos el precio general y los adicionales.
      const productBasePrice = this.getProductPrice(product)
      let total = productBasePrice

      // Adicionales (si aplica)
      if (product.modificadorseleccionList && product.modificadorseleccionList.length > 0) {
        product.modificadorseleccionList.forEach(ad => {
          const adPrice    = parseInt(ad.pedido_precio) || 0
          const adQuantity = parseInt(ad.modificadorseleccion_cantidad) || 1
          total += adPrice * adQuantity
        })
      }
      return total * product.pedido_cantidad
    },
  },

  actions: {
    setCurrentVideoIndex(index) {
      this.currentVideoIndex = index
    },
    setCurrentVideoTime(time) {
      this.currentVideoTime = time
    },
    calculateTotalProduct(product) {
      if (!product || typeof product !== "object") return 0;

      const {
        pedido_base_price = 0,
        mayor = 0,
        distribuidor = 0,
        pedido_cantidad = 1,
        modificadorseleccionList = []
      } = product;

      // Convertir a número para evitar errores con strings
      const cantidad = Number(pedido_cantidad) || 1;

      // Determinar el precio base según la cantidad
      let basePrice;
      if (cantidad >= 1000) {
        basePrice = Number(distribuidor) || 0;
      } else if (cantidad >= 500) {
        basePrice = Number(mayor) || 0;
      } else {
        basePrice = Number(pedido_base_price) || 0;
      }

      const adiciones = Array.isArray(modificadorseleccionList)
        ? modificadorseleccionList.reduce((total, {
            pedido_precio = 0,
            modificadorseleccion_cantidad = 1
          }) => {
            const modPrecio = Number(pedido_precio) || 0;
            const modCantidad = Number(modificadorseleccion_cantidad) || 1;
            return total + modPrecio * modCantidad;
          }, 0)
        : 0;

      // Retornar el total
      return (basePrice + adiciones) * cantidad;
    },

    setCurrentProduct(product) {
      this.currentProduct = product
    },
    setVisible(item, status) {
      this.visibles[item] = status
    },


    getProductId(product) {
      if  (product.lista_presentacion && product.lista_presentacion.length > 0 ){
          return product.lista_presentacion[0].producto_id
      }else if (product.productogeneral_id){
          return product.productogeneral_id
      }
  },

   getProductPrice(product) {

    if (product.productogeneral_precio){
        return product.productogeneral_precio
    }else if (product.lista_presentacion && product.lista_presentacion.length > 0 ){
        return product.lista_presentacion[0].producto_precio
    } else return 0

  },





   buildSignature(product_id,modificadores=[]) {

    const aditions = modificadores.map(p => {
        return {
            "id" : p.modificadorseleccion_id,
            "quantity" : p.modificadorseleccion_cantidad
        }
    })
    return `${product_id}-${JSON.stringify(aditions) }`

    },


    calculateTotalPrice(product, quantity, modificadores = []) {

    },


     addProductToCart(product, quantity = 1, additionalItems = []) {

      const newProduct = {
          "pedido_precio": this.getProductPrice(product),
          "pedido_escombo":product.productogeneral_escombo,
          "pedido_cantidad":parseFloat(quantity.toFixed(1))  ,
          "pedido_base_price": this.getProductPrice(product),
          "minor":product.minor,
          "mayor":product.mayor,
          "presentacion":product.presentacion,
          "kilos_delivery":product.kilos_delivery,
          "unit_measure":product.unit_measure,
          "presentation_unit_measure":product.presentation_unit_measure,
          "distribuidor":product.distribuidor,
          "pedido_productoid": this.getProductId(product),
          "lista_productocombo": product.lista_productobase?  product.lista_productobase.map( product => {
              return {
                      "pedido_productoid": product.producto_id,
                      "pedido_cantidad": product.productocombo_cantidad,
                      "pedido_precio": product.productocombo_precio,
                      "pedido_nombre": product.producto_descripcion,
                    }
          }) : [],
          "pedido_nombre_producto": product.productogeneral_descripcion,
          "modificadorseleccionList": additionalItems.map( add => {
              return {

                  "modificador_id":add.modificador_id ,
                  "modificadorseleccion_id": add.modificadorseleccion_id,
                  "pedido_precio": add.modificadorseleccion_precio,
                  "modificadorseleccion_cantidad": add.modificadorseleccion_cantidad || 1,
                  "modificadorseleccion_nombre":add.modificadorseleccion_nombre

              }
          }

          ),
          "productogeneral_urlimagen":product.productogeneral_urlimagen
      }

      const signature = this.buildSignature(newProduct.pedido_productoid,newProduct.modificadorseleccionList)
      newProduct.signature = signature

      console.log(newProduct)

      const existIndex = this.cart.findIndex(p => p.signature == signature)

      if (existIndex != -1){
        const existingProduct = this.cart[existIndex]
        const newq = existingProduct.pedido_cantidad + parseFloat(quantity.toFixed(1))
        existingProduct.pedido_cantidad = parseFloat(newq.toFixed(1))
        console.log(this.cart[existIndex])
      }
      else {
        this.cart.push(newProduct)
      }

  },


    removeProductFromCart(signature) {
      const existIndex = this.cart.findIndex(p => p.signature === signature)
      this.cart.splice(existIndex, 1)
    },

    // Decrementar la cantidad de un producto


    ajustarCantidad(newVal, presentacion) {
      // factor en base a cuántos decimales quieras manejar
      const factor = 10; // 1 decimal => factor = 10

      // Convertimos a entero para evitar problemas de coma flotante
      const newValInt = Math.round(newVal * factor);
      const presentInt = Math.round(presentacion * factor);

      // 1) Verificar cantidad mínima
      if (newValInt < presentInt) {
        return parseFloat((presentInt / factor).toFixed(1));
      }

      // 2) Verificar si es múltiplo
      if (newValInt % presentInt !== 0) {
        const nuevoInt = Math.ceil(newValInt / presentInt) * presentInt;
        return parseFloat((nuevoInt / factor).toFixed(1));
      }

      // Si no necesita ajuste, igual forzamos a 1 decimal
      return parseFloat((newValInt / factor).toFixed(1));
    },






    incrementProduct(signature) {
      const idx = this.cart.findIndex(item => item.signature === signature);
      if (idx !== -1) {
        const product = this.cart[idx];

        // Sumamos en base a la presentación
        const nuevaCantidad = product.pedido_cantidad + product.presentacion;

        // Forzamos a 1 decimal
        product.pedido_cantidad = parseFloat(nuevaCantidad.toFixed(1));
      }
    },

    decrementProduct(signature) {
      const idx = this.cart.findIndex(item => item.signature === signature);
      if (idx !== -1) {
        const product = this.cart[idx];

        // Restamos en base a la presentación
        const nuevaCantidad = product.pedido_cantidad - product.presentacion;

        // Forzamos a 1 decimal
        const cantidadAjustada = parseFloat(nuevaCantidad.toFixed(1));

        // Si la cantidad resultante es cero o menor, removemos el producto del carrito
        if (cantidadAjustada <= 0) {
          this.cart.splice(idx, 1);
        } else {
          product.pedido_cantidad = cantidadAjustada;
        }
      }
    }

  },
})

# Explicación completa del proyecto D'Cabañas

Este documento sirve para entender y defender el proyecto. Todo lo que se afirma acá se verificó contra el código y, cuando se trata de historia, contra `git log`. Donde algo no se pudo confirmar, se dice explícitamente.

## 1. Cómo funciona todo junto: recorrido de un pedido

### Diagrama de texto (front → API → servicio → base)

```
[Cliente en el navegador]
        |
        | 1. Toca "Agregar" en una pizza
        v
[product-modal.tsx]  --elige tamaño/borde/cantidad-->
        |
        | 2. addItem(...) (lib/cart-context.tsx)
        v
[Carrito en memoria (React state)]
        |
        | 3. Toca "Enviar pedido por WhatsApp"
        v
[cart-sheet.tsx :: handleCheckout]
        |  - abre window.open('', '_blank')  (mismo clic, evita bloqueo de popup)
        |  - arma PedidoRequest (solo IDs y cantidades)
        v
[services/PedidoService.ts :: crearPedido]
        |  POST http://127.0.0.1:8080/api/pedidos  (JSON)
        v
[Backend: PedidoController.kt :: crear]
        |
        v
[PedidoService.kt :: crear]   (@Transactional)
        |  - valida campos (Bean Validation)
        |  - crea fila en `pedidos` (estado Pendiente, fecha now, total 0)
        |  - por cada detalle:
        |      * si comboId -> carga combo, usa combo.precio
        |      * si productoId -> carga producto; si pizza exige tamanioId y borde
        |      * calcula precioUnitario + precioBorde, multiplica por cantidad
        |      * inserta fila en `detalle_pedido`
        |  - suma el total y actualiza `pedidos.total`
        v
[MySQL/MariaDB: tablas pedidos + detalle_pedido]
        |
        | 4. Respuesta JSON (PedidoResponse con id, total, detalles)
        v
[cart-sheet.tsx]
        |  - construye el mensaje de WhatsApp con el Pedido #id
        |  - carga la ventana en blanco con https://wa.me/595973493374?text=...
        |  - muestra "Pedido #id confirmado"
        |  - clear() del carrito (solo si guardó bien)
        v
[WhatsApp se abre con el mensaje listo para enviar]
```

### Puntos clave del recorrido

- El front **nunca envía precios**: solo IDs (`productoId`, `tamanioId`, `comboId`) y cantidades. El backend recalcula todo.
- El borde no es un producto aparte en el carrito: viaja como `conBorde: true` + `tamanioId`, y el backend suma `tamanios.precio_borde`.
- La ventana de WhatsApp se abre **sincrónicamente en el clic** y se carga después, para que el navegador no la bloquee.
- Si el guardado falla, la ventana se cierra y el carrito no se vacía.

## 2. Archivos importantes y capas

### Frontend (Next.js / React / TypeScript)

| Archivo | Para qué sirve |
|---|---|
| `app/page.tsx` | Página principal: arma la UI (Header, Hero, destacados, bordes, combo, footer, modal, carrito). |
| `app/menu/page.tsx` | Página del menú completo. |
| `components/full-menu.tsx` | Tabs por categoría (barra de accesos rápidos) + grilla de `ProductCard`. Lee de la API. |
| `components/product-card.tsx` | Tarjeta de producto. Muestra precio, badge "Más pedida"/"Agotado", abre el modal. |
| `components/product-modal.tsx` | Modal de detalle: tamaño, borde, cantidad, agrega al carrito. |
| `components/cart-sheet.tsx` | Carrito y checkout: datos del cliente, envío del pedido, pantalla de confirmación, apertura de WhatsApp. |
| `components/promo-section.tsx` | Banner de promo del día: muestra imagen y texto según el día, agrega/quita regalos automáticamente del carrito. |
| `components/hero.tsx` | Página de inicio: hero con botón "Ver el menú" (arreglado: ahora es un enlace real a `#menu`) y botón "Promos" a `#promos`. |
| `components/combo-section.tsx` | Sección del combo (mantenida pero desplazada por PromoSection en la home). |
| `hooks/usePromo.ts` | (opcional) Hook de datos de promo. |
| `services/PromoService.ts` | Llamada `fetch` a `/api/promos/hoy`. |
| `components/bordes-section.tsx` | Explica los bordes y muestra `precio_borde` por tamaño desde la API. |
| `hooks/useProducto.ts` | Trae productos + tamaños de la API y los transforma al formato `Product`. Mapea imágenes por nombre. |
| `hooks/useCategoria.ts`, `useTamanio.ts`, `useCombo.ts` | Hooks de datos para cada entidad (un hook por entidad). |
| `services/*Service.ts` | Llamadas `fetch` a la API. Un servicio por entidad. |
| `lib/cart-context.tsx` | Estado global del carrito (items, total, count, add/remove/update/clear). |
| `lib/menu.ts` | Tipos (`Product`, `SizeOption`, etc.) y `formatGs`. |
| `types/*.ts` | Tipos de los DTOs del backend (`Producto`, `Pedido`, etc.). |
| `config/index.ts` | `url_api` y número de WhatsApp (constante fácil de cambiar). |

### Backend (Spring Boot / Kotlin)

Capas, de abajo a arriba:

| Capa | Ejemplo | Para qué sirve |
|---|---|---|
| Configuración | `config/PromoConfig.kt` | Zona horaria (`America/Asuncion`) y fecha forzada para pruebas de promociones. |
| Controlador | `controller/PromoController.kt` | `GET /api/promos/hoy` devuelve la promo del día. Endpoints `/test/forzar-fecha` para pruebas. |
| Entidad | `entity/Pedido.kt`, `entity/PedidoDetalle.kt`, `entity/Producto.kt`, `entity/Tamanio.kt`, `entity/Combo.kt` | Mapeo objeto-relacional: una clase = una tabla. Anotaciones JPA (`@Entity`, `@Column`, `@ManyToOne`). |
| Repositorio | `repository/PedidoRepository.kt` (extiende `JpaRepository`) | Acceso a la base: `findAll`, `findById`, `save`, `delete`. Spring genera la implementación. |
| DTO | `dto/PedidoRequest.kt`, `dto/PedidoResponse.kt`, `dto/PedidoDetalleRequest.kt` | Contrato de entrada/salida de la API. Validaciones con Bean Validation (`@NotBlank`, `@Min`, etc.). |
| Servicio | `service/PedidoService.kt` | Lógica de negocio: calcular precios, validar, armar entidades, transacción. |
| Controlador | `controller/PedidoController.kt` | Recibe HTTP, delega al servicio, devuelve JSON. Anotaciones `@RestController`, `@PostMapping`. |
| Excepciones | `exception/GlobalExceptionHandler.kt` | Traduce excepciones a respuestas HTTP con mensaje. |

### Perfil de Spring

`application.properties` activa el perfil `local` por defecto (`spring.profiles.active=${SPRING_PROFILES_ACTIVE:local}`), y `application-local.properties` apunta a MariaDB en `127.0.0.1:3306/dcabanas`. `ddl-auto=none` (Hibernate no crea tablas) y Flyway deshabilitado, por eso las migraciones se corren a mano.

## 3. Base de datos

Tablas y columnas principales:

- **categorias** (`id`, `nombre`): Clásicas, Especiales, Papas Fritas, Gaseosas, Adicionales.
- **tamanios** (`id`, `nombre`, `precio_clasica`, `precio_especial`, `precio_borde`): Mediana/Grande/Familiar con sus precios.
- **productos** (`id`, `nombre`, `descripcion`, `categoria_id`, `precio`, `stock`, `activo`): pizzas (precio null, se usa el del tamaño) y productos simples (precio fijo).
- **combos** (`id`, `nombre`, `descripcion`, `precio`, `imagen`, `activo`): combos con precio propio.
- **pedidos** (`id`, `fecha`, `total`, `estado`, `forma_pago`, `cliente_nombre`, `cliente_telefono`, `direccion_entrega`, `notas`): cabecera del pedido.
- **detalle_pedido** (`id`, `pedido_id`, `producto_id`, `combo_id`, `tamanio_id`, `con_borde`, `cantidad`, `precio_unitario`, `precio_borde`, `es_regalo`): líneas del pedido. `es_regalo = 1` indica que es un regalo de promoción (precio 0).

Relaciones: `detalle_pedido.pedido_id → pedidos.id` (CASCADE), `producto_id → productos.id`, `tamanio_id → tamanios.id`, `combo_id → combos.id` (SET NULL).

### Cómo se calculan los precios (siempre en el backend)

- Pizza: `precioUnitario = tamanios.precio_clasica` o `precio_especial` según la categoría; si `conBorde = true`, suma `tamanios.precio_borde`.
- Producto simple (papas, gaseosas, adicional): `producto.precio`.
- Combo: `combos.precio` (no se desglosa).
- Total del pedido = Σ `(precioUnitario + precioBorde) * cantidad` de cada línea.

El front manda solo IDs y cantidades; el backend busca los precios reales y los guarda en `detalle_pedido` para que quede el histórico.

## 4. Modificaciones hechas (orden cronológico)

Reconstruido con `git log` (commits del frontend y del backend) y el código actual. Donde no hay commit que lo confirme, se indica.

1. **Proyecto inicial (v0/Next.js)** — commit `e4cb760` / `06665e3`: scaffold de Next.js con tema y componentes base.
2. **Menú en otra página** — commit `5a36f2e`: separación de la página `/menu`.
3. **Unión front + back** — commit `1c25ba8` (`cabanas`): se conectó el catálogo al backend.
4. **Backend: tablas + entidades + repositorios** — commits `47f3782`, `bd41620`, `6234c10`: creación de tablas (categorias, tamanios, productos, pedidos, detalle_pedido), mapeo JPA y repositorios.
5. **Backend: servicios y controladores** — commits `fcb0d03`, `a38ae6a`: `PedidoService` calcula precios y crea pedido; `ProductoController`, `TamanioController`, etc.
6. **Cambio del modelo a 5 tablas y ajuste del backend** — se consolidó el esquema (categorias, tamanios, productos, pedidos, detalle_pedido) y se ajustó el backend para leer precios de la base (borde desde `tamanios.precio_borde`, no hardcodeado). Verificado en `entity/PedidoDetalle.kt`, `service/PedidoService.kt`.
7. **Frontend: catálogo desde la API** — `hooks/useProducto.ts` trae productos y tamaños; `full-menu.tsx` filtra por categoría; imágenes mapeadas por nombre (falta `pizza-choclo.png`).
8. **Checkout con envío por WhatsApp** — `components/cart-sheet.tsx`: guarda el pedido en MySQL y luego abre WhatsApp. Se agregó `notas` y `tipo_entrega` (luego se eliminó `tipo_entrega`).
9. **Combos** — tabla `combos`, entidad `Combo`, repositorio/servicio/controlador/DTOs, hook `useCombo`, sección en la home, `comboId` en el carrito y en `detalle_pedido`.
10. **Eliminación de "Tipo de entrega"** — el negocio es solo delivery: se quitó del front, del request, del backend y se eliminó la columna `tipo_entrega` de la base. La dirección pasó a ser obligatoria.
11. **Limpieza y ajustes finales** — productos agotados visibles/bloqueados, teléfono opcional, validaciones, README, esta explicación.
12. **Promociones diarias** — `config/PromoConfig.kt` (zona horaria `America/Asuncion`, fecha forzada para pruebas), `dto/PromoInfo.kt`, `controller/PromoController.kt` (`GET /api/promos/hoy`), `service/PedidoService.kt` (agrega regalos a precio 0 según el día), `entity/PedidoDetalle.kt` (columna `es_regalo`), `dto/PedidoDetalleRequest.kt` y `dto/PedidoDetalleResponse.kt` (campo `esRegalo`). Frontend: `services/PromoService.ts`, `types/promo.ts`, `components/promo-section.tsx` (reemplaza `ComboSection` en la home), `components/hero.tsx` (botón "Ver el menú" arreglado), `lib/cart-context.tsx` (campo `esRegalo`), `components/cart-sheet.tsx` (envía `esRegalo` y muestra regalos en WhatsApp).

Nota: el historial de Git del frontend tiene commits genéricos ("ayuda mami", "faltan pequeñas cositas"). No siempre el mensaje describe el cambio exacto; por eso la reconstrucción se apoyó también en el código actual. Si algo no matchea con lo que el usuario recuerda, avisar.

## 5. Decisiones y su motivo

- **Abrir la ventana de WhatsApp antes de guardar**: los navegadores bloquean `window.open` si no es en el mismo clic del usuario. Abrirla en blanco sincrónicamente y cargarla después evita el bloqueo. Si el guardado falla, se cierra.
- **El backend recalcula el total**: el front podría estar manipulado o desactualizado. El backend es la fuente de verdad de los precios; el front solo manda IDs y cantidades.
- **El borde no es un producto del carrito**: se representa como `conBorde: true` + `tamanioId`, y el backend suma `tamanios.precio_borde`. Así no se duplica catálogo ni se permite borde en productos que no son pizza.
- **Teléfono opcional**: no todos los clientes quieren darlo; el pedido se identifica por nombre + dirección.
- **Vaciar el carrito solo si el guardado fue exitoso**: evita perder el carrito si hay error de red o validación.
- **Evitar doble clic**: un `useRef` lock además del estado `submitting`, porque el estado de React se actualiza después del render.
- **Productos agotados visibles pero bloqueados**: el cliente ve que existe el producto pero no puede pedirlo; mejor UX que ocultarlo.
- **Estado y fecha en el pedido**: sirven para seguimiento (Pendiente / En preparación / Entregado) y auditoría.

## 6. Glosario

- **DTO (Data Transfer Object)**: objeto que define qué entra/sale de la API. Ej.: `PedidoRequest` con `clienteNombre`, `detalles`, etc.
- **Entidad**: clase mapeada a una tabla (JPA). Ej.: `@Entity class Pedido(...)`.
- **Repositorio**: interfaz que Spring implementa para acceder a la BD. Ej.: `interface PedidoRepository : JpaRepository<Pedido, Int>`.
- **Servicio**: clase con la lógica de negocio. Ej.: `PedidoService.crear()` calcula precios y guarda.
- **Controlador**: recibe HTTP y delega. Ej.: `@RestController class PedidoController`.
- **Endpoint**: URL + método HTTP. Ej.: `POST /api/pedidos`.
- **CORS**: política que permite al front (puerto 3000) llamar al back (8080). Configurado en el backend.
- **Perfil de Spring**: conjunto de configuración por entorno. Ej.: perfil `local` apunta a MariaDB local.
- **Bean Validation**: validaciones declarativas con anotaciones (`@NotBlank`, `@Min(1)`).
- **Transacción**: bloque de operaciones que se guardan juntas o se deshacen. `@Transactional` en `PedidoService.crear`.
- **FK (clave foránea)**: columna que referencia otra tabla. Ej.: `detalle_pedido.pedido_id → pedidos.id`.
- **AUTO_INCREMENT**: el motor asigna el próximo id automáticamente.

## 6b. Lógica de promociones diarias

### Cómo funciona

El backend es la autoridad absoluta para las promociones. El front solo muestra el banner y refleja lo que el backend decide.

```
[Cliente ve el banner de promo en la home]
        |
        | 1. Front llama GET /api/promos/hoy
        v
[PromoController.promoHoy()]
        |
        | 2. Lee PromoConfig.fechaHoy (zona America/Asuncion, o fecha forzada)
        |
        | 3. Devuelve PromoInfo: hayPromoActiva, tipoPromo, descripcion, imagen
        v
[Front muestra el banner si hayPromoActiva]
        |
        | 4. PromoSection calcula regalos esperados según ítems del carrito
        |
        | 5. Si se cumple la condición → addItem() con esRegalo=true, unitPrice=0
        | 6. Si ya no se cumple → removeItem() del regalo
        v
[Cliente toca "Enviar pedido por WhatsApp"]
        |
        | 7. Front envía PedidoRequest con detalles (incluyendo esRegalo)
        v
[PedidoService.crear()] (@Transactional)
        |
        | 8. Vuelve a calcular regalos desde el backend (no confía en el front)
        | 9. Inserta fila en pedidos (total sin regalos)
        |10. Inserta cada detalle en detalle_pedido (es_regalo=1 para regalos, precio 0)
        |11. Responde PedidoResponse con todos los detalles
        v
[Front construye mensaje de WhatsApp]
        |
        |12. Muestra regalos como "Regalo: Papa fritas mediana — 0 Gs"
        v
[WhatsApp se abre con el mensaje completo]
```

### Reglas de negocio

| Día | Condición | Regalo | Máximo por pedido |
|-----|-----------|--------|-------------------|
| Miércoles | ≥ 1 pizza Grande o Familiar | Papa frita mediana | 1 set |
| Viernes | ≥ 1 pizza Familiar | Coca-Cola 1 L | 1 set |
| Sábado/Domingo | ≥ 2 pizzas Familiares | Coca-Cola 1 L + Papa fritas mediana | 1 set |
| Lunes/Martes/Jueves | — | — | — |

- **Un regalo por pedido**: aunque haya más pizzas de las pedidas, solo se entrega un set de regalos.
- **Zona horaria**: configurable en `PromoConfig.zonaHoraria` (por defecto `America/Asuncion`).
- **Fecha forzada para pruebas**: `PromoConfig.fechaForzada` (se puede cambiar con `POST /api/promos/test/forzar-fecha?fecha=YYYY-MM-DD`).

### Qué archivos tocar para cambiar una promo

- **Día o condición**: `PedidoService.determinarRegalosPromo()` en `backend/testing/.../service/PedidoService.kt`
- **Texto o imagen**: `PedidoService.descripcionPromoHoy()` y `imagenPromoHoy()` en el mismo archivo.
- **Producto de regalo o cantidad**: constantes `PRODUCTO_PAPA_MEDIANA` (23) y `PRODUCTO_COCACOLA_1L` (25) al tope de `PedidoService.kt`, y el `when` en `determinarRegalosPromo()`.
- **Zona horaria**: `PromoConfig.zonaHoraria` en `config/PromoConfig.kt`.

## 7. Preguntas probables y respuestas sugeridas

- **¿Por qué el front no calcula el total?** Para que el cliente no pueda manipular precios; el backend es la fuente de verdad y guarda los precios reales en `detalle_pedido`.
- **¿Cómo evitan pedidos duplicados por doble clic?** Un `useRef` lock que se activa al inicio del envío y se libera en `finally`, además del botón deshabilitado.
- **¿Por qué se abre WhatsApp antes de guardar?** Por el bloqueo de popups del navegador: solo se permite `window.open` dentro del clic del usuario.
- **¿Dónde está el número de WhatsApp?** En `config/index.ts`, constante `whatsappNumber`, fácil de cambiar o por variable de entorno.
- **¿Cómo se relacionan las tablas?** `detalle_pedido` referencia `pedidos`, `productos`, `tamanios` y `combos`.
- **¿Qué pasa si un producto está agotado?** Se muestra con badge "Agotado" y el botón queda deshabilitado; el backend también rechaza productos con `activo = false`.
- **¿El teléfono es obligatorio?** No, es opcional.
- **¿Cómo corren el proyecto?** Backend con `mvnw spring-boot:run` (puerto 8080) y frontend con `bun run dev` (puerto 3000); la base se crea ejecutando los scripts de `db/migration`.
- **¿Hay tests?** Hay tests unitarios en el backend (carpeta `src/test`) y pruebas manuales end-to-end documentadas en el historial del proyecto.
- **¿Cómo funcionan las promociones diarias?** El backend valida el día (zona `America/Asuncion`) y la condición de pizzas en el carrito. Si se cumple, agrega el regalo a precio 0 en `detalle_pedido` (`es_regalo = 1`). El front muestra el banner y refleja lo que el backend decide.
- **¿Por qué el backend valida las promos y no el front?** Para evitar que el front manipule regalos gratis. El back recalcula todo al crear el pedido.
- **¿Cuántos regalos se dan por pedido?** Un solo set, aunque se pidan más pizzas de las necesarias.
- **¿Cómo se prueba un día específico?** Con `POST /api/promos/test/forzar-fecha?fecha=YYYY-MM-DD`.
- **¿Qué pasa si quito las pizzas del carrito?** El regalo desaparece automáticamente del carrito (el front lo quita si ya no se cumple la condición).

## 8. Lo pendiente (fuera de alcance de esta entrega)

- Bot automático de WhatsApp.
- Despliegue a producción.
- Imagen `pizza-choclo.png` (usa fallback).
- Panel de administración de pedidos (el backend ya expone `GET /api/pedidos`).

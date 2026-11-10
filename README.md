# D'Cabañas — Pizzería (Frontend + Backend)

Sistema de pedidos para una pizzería: catálogo de productos, pizzas con tamaños y borde relleno, combos, carrito y checkout que guarda el pedido en MySQL y abre WhatsApp con el detalle.

## Estructura

- `cabanas/` — Frontend en Next.js 16 (React 19, TypeScript).
- `backend/testing/` — Backend en Spring Boot 4 (Kotlin), JPA/Hibernate, MariaDB/MySQL.

## Requisitos

- Node.js 20+ y bun.
- JDK 21.
- MariaDB/MySQL en `127.0.0.1:3306`, base `dcabanas`, usuario `root` / `dc123456`.
- Maven (incluido como `mvnw`).

## Base de datos

1. Crear la base: `CREATE DATABASE dcabanas CHARACTER SET utf8mb4;`
2. Ejecutar los scripts de `backend/testing/src/main/resources/db/migration/` en orden (V1, V2, V3). Flyway está deshabilitado, así que se corren a mano.
3. Cargar datos iniciales (categorías, tamaños, productos, combos) según las guías del curso.
4. Columna `es_regalo` en `detalle_pedido` (agregada en el código, ejecutar a mano si es necesario):
   ```sql
   ALTER TABLE detalle_pedido ADD COLUMN es_regalo TINYINT(1) DEFAULT 0;
   ```

## Correr el backend

```bash
cd backend/testing
./mvnw spring-boot:run   # Windows: mvnw.cmd spring-boot:run
```

Queda escuchando en `http://127.0.0.1:8080` (perfil `local`).

## Correr el frontend

```bash
cd cabanas
bun install
bun run dev
```

Abrir `http://localhost:3000`.

La URL del API se configura en `cabanas/config/index.ts` (`url_api`), por defecto `http://127.0.0.1:8080/api/`.

## Número de WhatsApp

Se cambia en una sola línea en `cabanas/config/index.ts`:

```ts
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '595973493374'
```

## Comandos útiles

- `bun run dev` — levanta el frontend en `http://localhost:3000`.
- `bun exec tsc --noEmit` — chequeo de tipos del frontend (o `pnpm exec tsc --noEmit` si usás pnpm).
- `mvnw -q -DskipTests compile` — compila el backend.

## Promociones diarias

Hay promociones que cambian según el día de la semana (hora del local, zona `America/Asuncion`):

| Día | Promo | Regalo |
|-----|-------|--------|
| Miércoles | Pizza Grande o Familiar | Papa frita mediana |
| Viernes | Pizza Familiar | Coca-Cola 1 L |
| Sábado/Domingo | 2 pizzas Familiares | Coca-Cola 1 L + Papa frita mediana |
| Lunes, Martes, Jueves | Sin promo | — |

El backend valida el día y la condición, y pone el regalo a precio 0 en `detalle_pedido` (columna `es_regalo = 1`). El front muestra el banner del día y agrega/quita el regalo del carrito automáticamente.

**Endpoint de prueba (solo desarrollo):**
- `POST /api/promos/test/forzar-fecha?fecha=YYYY-MM-DD` — forza el día para probar.
- `DELETE /api/promos/test/forzar-fecha` — vuelve a la fecha real.

**Imágenes:** se esperan en `cabanas/public/images/promos/` (`promo-miercoles.png`, `promo-viernes.png`, `promo-sabado-domingo.png`). Si faltan, se usa `/images/combo.png` como reemplazo.

**Configuración:** la zona horaria y la fecha forzada están en `backend/testing/.../config/PromoConfig.kt`.

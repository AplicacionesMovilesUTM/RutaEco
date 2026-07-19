# RutaEco ♻️

**RutaEco** es una aplicación móvil híbrida diseñada para fomentar el reciclaje inteligente y el cuidado del medio ambiente. La aplicación permite clasificar residuos utilizando inteligencia artificial (Gemini AI), ubicar puntos de reciclaje cercanos sobre un mapa interactivo y gamificar la experiencia del usuario mediante un sistema de puntos, niveles y logros desbloqueables.

Desarrollada con **Ionic Framework**, **Angular Standalone Components**, **Capacitor** y **Firebase**.

---

## 🚀 Características Principales

1. **Clasificación de Residuos con IA (Gemini):**
   - Toma una fotografía de un residuo desde la cámara o súbela de la galería.
   - La inteligencia artificial de **Gemini** analiza la imagen en tiempo real para determinar el tipo de material (plástico, vidrio, papel, metal, etc.), el tiempo aproximado de degradación y el contenedor recomendado.
   - Proporciona recomendaciones ecológicas específicas para cada residuo.

2. **Mapa de Puntos de Reciclaje:**
   - Mapa interactivo integrado mediante **Leaflet** (usando CartoDB Voyager, libre de claves de API de pago).
   - Geoposicionamiento en tiempo real que calcula la ubicación del usuario (compatible con dispositivos nativos y navegadores web).
   - Detección y recomendación automática del **centro de reciclaje más cercano** mediante una tarjeta flotante inteligente, con enlace directo de navegación a Google Maps.

3. **Gamificación y Estadísticas:**
   - Cada escaneo realizado otorga **15 puntos ecológicos**.
   - Sistema dinámico de niveles (Eco-Semilla, Reciclador Activo, Héroe Verde, Eco-Guardián) con barra de progreso.
   - Resumen analítico en la página de inicio que segmenta la cantidad de residuos clasificados por tipo de material.

4. **Perfil de Usuario y Logros:**
   - Registro e inicio de sesión seguros mediante **Firebase Authentication**.
   - Panel de estadísticas y visualización de logros desbloqueados (e.g., _"Primer Paso"_, _"Eco-Héroe Bronce"_, _"Reciclador de Élite"_) basados en las clasificaciones registradas en la base de datos.
   - Persistencia en la nube que permite sincronizar el progreso entre dispositivos.

---

## 🛠️ Stack Tecnológico

- **Core:** Ionic v8 + Angular v20 (Standalone Components & Routing).
- **Base de Datos & Auth:** Firebase v11 (Authentication & Cloud Firestore).
- **Almacenamiento de Fotos:** Firebase Storage (almacenamiento de imágenes de residuos clasificadas).
- **Inteligencia Artificial:** Google Generative AI (Gemini 1.5 Flash).
- **Mapas:** Leaflet v1.9.
- **Plataforma Híbrida:** Capacitor v8 (Geolocation & Camera).
- **Estilos:** CSS/SCSS con un rediseño de interfaz de usuario de alta calidad con gradientes ecológicos y soporte nativo para **Modo Oscuro**.

---

## 💻 Instalación y Configuración Local

### Requisitos Previos

- [Node.js](https://nodejs.org/) (versión LTS recomendada).
- Ionic CLI instalado de forma global:
  ```bash
  npm install -g @ionic/cli
  ```

### Pasos para Ejecutar

1. **Clonar e ingresar al repositorio:**

   ```bash
   cd RutaEco
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno (Firebase y Gemini):**
   - Los archivos de configuración se encuentran en `src/environments/environment.ts` y `environment.prod.ts`.
   - Asegúrate de configurar tus credenciales de Firebase y tu clave de API de Gemini (`geminiApiKey`).

4. **Ejecutar servidor de desarrollo local:**
   ```bash
   ionic serve
   ```
   Esto abrirá la aplicación en tu navegador web predeterminado (`http://localhost:8100`).

---

## 📦 Construcción y Despliegue

### Compilar para la Web

Para generar la build de producción optimizada:

```bash
npm run build
```

Los archivos de salida se guardarán en el directorio `www/`.

### Desplegar en Dispositivos Móviles (Android / iOS)

1. **Agregar la plataforma deseada:**
   ```bash
   ionic cap add android
   ionic cap add ios
   ```
2. **Sincronizar código web con la app nativa:**
   ```bash
   ionic cap sync
   ```
3. **Abrir el proyecto en Android Studio o Xcode:**
   ```bash
   ionic cap open android
   ionic cap open ios
   ```

---

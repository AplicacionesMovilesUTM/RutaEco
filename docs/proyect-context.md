# RutaEco

## Descripción

RutaEco es una aplicación móvil desarrollada con Ionic + Angular cuyo objetivo es ayudar a los ciudadanos a clasificar correctamente residuos reciclables mediante inteligencia artificial y encontrar centros de reciclaje cercanos usando geolocalización.

## Tecnologías

- Ionic
- Angular Standalone
- Capacitor
- Firebase Authentication
- Firestore
- Firebase Storage
- Capacitor Camera
- Google Maps
- SQLite
- Gemini Vision API (Clasificación de imágenes)

## Arquitectura

La aplicación seguirá una arquitectura basada en servicios.

Toda la lógica irá en Services.

Las páginas solo mostrarán información.

## Pantallas

- Splash
- Login
- Registro
- Home
- Escanear
- Resultado
- Historial
- Mapa
- Perfil

## Flujo

Usuario

↓

Login

↓

Home

↓

Escanear

↓

La fotografía se envía a Gemini Vision

↓

Gemini devuelve

- material
- tipo
- nivel de confianza
- contenedor
- tiempo de degradación
- recomendaciones

↓

Se guarda el resultado en Firestore

↓

Se agrega al historial

↓

El usuario puede abrir el mapa para encontrar puntos de reciclaje cercanos.

## Diseño

Interfaz moderna.

Estilo Material Design.

Animaciones suaves.

Colores verdes y blancos.

Iconografía de Ionic.

Debe sentirse como una aplicación profesional.

## Buenas prácticas

- Standalone Components.
- Lazy Loading.
- Código limpio.
- Interfaces TypeScript.
- No duplicar lógica.
- Componentes reutilizables.
- Responsive únicamente para móviles.

# PruebaTecnicaSodimacFront

Este archivo `README.md` proporciona una visión general y guía de instalación para una aplicación Angular versión 16. La aplicación está diseñada para ejecutarse en entornos de internet o intranet, con una configuración predeterminada para intranet que se puede ajustar según las necesidades del proyecto. Se recomienda a los desarrolladores de front-end trabajar a partir de `home.component` y `home.module` para la adición de nuevos componentes y módulos, evitando modificaciones directas en `app.component`.

## Descripción

Esta aplicación está construida con Angular, un framework de desarrollo para crear aplicaciones web dinámicas y de una sola página. Utiliza Angular Material para el diseño y componentes de la interfaz de usuario, y spacers de Bootstrap para un manejo coherente de espacios y márgenes. Un conjunto de estilos personalizados proporciona una apariencia visual distintiva a elementos como marcos, botones, títulos y otros componentes de la interfaz.

El gestor de estado de la aplicación es una clase `StateService` que extiende de `State<IState>`, facilitando un manejo centralizado y reactivo del estado. Esto permite a los desarrolladores manejar el estado de la aplicación de manera eficiente y estructurada.

La aplicación cuenta con una configuración en `app.component` que determina si se ejecuta en un entorno de internet o intranet, siendo esta última la opción por defecto. Esta bandera es ajustable para adaptarse a diferentes escenarios de despliegue.

Para proyectos que no buscan implementar una arquitectura de microfront, se recomienda modularizar la aplicación en términos de componentes y estados. Es aconsejable realizar cambios en la estructura de carpetas para alinearla más estrechamente con la configuración estándar de un proyecto Angular o seguir otra arquitectura definida.

## Características

- **Angular v16**: Una de las últimas versiones del popular framework de desarrollo web.
- **Angular Material**: Un conjunto de componentes de Material Design para Angular, Algunos de ellos ya personalizados para Sodimac.
- **Angular Material Icons Regular, Rounded y Outlined**: Iconos de Material Design donde su uso son respectivamente: 
  `<mat-icon>arrow_back</mat-icon>`,
  `<mat-icon fontSet="material-icons-round">arrow_back</mat-icon>`,
  `<mat-icon fontSet="material-icons-outlined">arrow_back</mat-icon>`.
- **Traducción de elementos de paginador de angular matierial**: Traducción de los elementos de paginador de angular material al español en el archivo `configuracionPaginador.ts`.
- **Spacers de Bootstrap**: Utilidades para manejar el espaciado y alineación de elementos.
- **State Manager**: Un servicio inyectable para manejar el estado de la aplicación permitiendo comunicación entre componentes sin necesidad de usar databinding entre componentes.
- **Estilos Personalizados SGL**: `sgl-styles.scss` Una hoja de estilos SCSS que define la apariencia personalizada de la aplicación.
- **@ng-select/ng-select**: Un componente de Angular para crear campos de selección personalizados, avanzados y con cierta flexibilidad al usar que los selectores nativos no poseen.
- **@angular/flex-layout**: Una biblioteca para Angular que permite el uso de Flexbox CSS para el diseño de la aplicación.
- **Home.Component.ts**: La aplicación está ideada para que éste componente aloje la página principal de la aplicación y los folders `components` y `views` contengan los componentes y vistas que se requieran.
- **Home.Module.ts**: El módulo principal de la aplicación, que importa y declara los componentes y servicios necesarios para la aplicación añadidos y sin modificar el `App.Module.ts`.
- **SpinnerInterceptor**: Un interceptor automático que permite mostrar un spinner de carga en la aplicación mientras se realizan peticiones HTTP.
- **DialogService**: Un servicio donde debe consignarse la configuración con la que se lanzan los diálogos modales personalizados de la aplicación.

## Dependencias

Para utilizar el componente `ng-select` y `@angular/flex-layout` en tu proyecto, debes instalar las dependencias correspondientes a través de npm:

````
npm install
````

Puede evidenciarse el uso de la librería `@angular/flex-layout` en el **app.component** pero **No se recomienta el uso contínuo de la misma**, ya que ésta lirería actualmente está deprecada y puede dificultar la actualización de versiones y dependencias futuras de los proyectos.

## Requisitos de Sistema

Se recomienda utilizar Node.js versión "v16" para trabajar con esta plantilla y otros proyectos anteriores del cliente. Esto ayudará a garantizar la compatibilidad y evitar posibles inconvenientes relacionados con la versión de Node.js.

Para cambiar a esta versión de Node.js, puedes utilizar [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) ejecutando los siguientes comandos en tu terminal:

```bash
nvm install 16.19.0
nvm use 16.19.0
````

## Hoja de Estilos Personalizada

La aplicación incluye una hoja de estilos SCSS `_sgl-styles.scss` que define estilos específicos para componentes, botones, títulos, y otros elementos de la interfaz de usuario, creados a partir de un [SGL Design System](https://www.figma.com/file/5sNysOm2g7kT4CRKVaSw3v/SGL---Desing-Sytem?type=design&node-id=1801-95254&mode=design) en Figma para las nuevas apps de Homecenter. Los estilos hacen uso de variables SCSS, herencia y media queries para garantizar una apariencia coherente y responsiva.

Aquí hay algunos ejemplos de clases definidas en la hoja de estilos:

- `sgl__frame`: Aplica sombras y bordes redondeados a un elemento contenedor.
- `sgl__button`: Define el estilo de los botones, incluyendo estados de hover y active.
- `sgl__title` y `sgl__subtitle`: Establecen los estilos de los títulos y subtítulos.
- `sgl__modal-frame`: Aplica estilos específicos para marcos de modales.

Estos son solo algunos ejemplos. La hoja de estilos completa incluye muchas más clases que puedes utilizar para personalizar tu aplicación.

Se sugiere que el estilizado de los componentes creados para las nuevas aplicaciónes sigan el diseño propuesto en el [SGL Design System](https://www.figma.com/file/5sNysOm2g7kT4CRKVaSw3v/SGL---Desing-Sytem?type=design&node-id=1801-95254&mode=design) en Figma usando la metodología BEM (Block, Element, Modifier) para el nombrado de clases.

## Uso del Gestor de Estado

El gestor de estado `StateService` es un servicio inyectable que extiende de `State<IState>`, permitiendo un manejo centralizado y reactivo del estado de la aplicación. El gestor de estado se utiliza para comunicar información entre componentes sin necesidad de usar databinding entre componentes.

El gestor de estado está definido la clase `State<T>` que contiene un  `BehaviourSubject` de `rxjs` que sigue permite proveer el ultimo valor actualizado del estado de la aplicación o de cualquier atributo que viva dentro del estado a cualquier variable que esté suscrita al mismo.

Este se compone de tres partes principales:

1. **State**: Es la clase que define con un `BehaviourSubject` el state y que se usa para heredar de la misma el **StateService**.
2. **StateService**: Un servicio inyectable que extiende de `State<IState>` y que se encarga de manejar el estado de la aplicación. El servicio incluye el estado global de la aplicación definido por una interfaz, y los métodos para obtener el estado actual, actualizar el estado y escuchar cambios en el estado.
3. **data-loader.service (Opcional)**: Este es un servicio que se implementa de forma opcional que hereda de la clase `DataService` y que permite hacer peticiones a API's para hacer cargas iniciales u obtención de datos para inyectarlos directamente al state y así proveer de data a componentes que estén suscritos al estado de la aplicación. Así como listas, opciones de selección, catálogos de ciudades, catálogos de artículos, centros de distribución, etc.

El gestor de estado permite ejecutar acciones tales como:

1. **Resetear el estado**: `this.stateService.resetState()`.
2. **Actualizar el estado**: `this.stateService.setState({ ... })`.
3. **Escuchar cambios en el estado**: `this.stateService.currentState$`, suscribiéndose a los cambios del estado y añadiendo los nuevos selectores de escucha según se vaya añadiendo más variables al estado global de la aplicación; tales como `this.stateService.cities$`, `this.stateService.selectOptions$`, etc.

## Uso de Angular Material

La aplicación utiliza Angular Material para el diseño y componentes de la interfaz de usuario. Angular Material es una biblioteca de componentes de Material Design para Angular que ofrece una amplia gama de componentes de interfaz de usuario, como botones, campos de texto, menús, listas, diálogos, y más.

La plantilla ya contiene un módulo de Angular Material con la mayoría de sus componentes importado en el `app.module.ts` y en el `home.module.ts`.

## SonarLint

Se aconseja el uso de SonarLint para la revisión de código y la detección de errores y malas prácticas en el código. SonarLint es una herramienta de análisis estático de código que ayuda a identificar problemas de calidad del código, tales como errores, malas prácticas, vulnerabilidades y código duplicado.

El cliente ya cuenta con una configuración de SonarLint que se puede utilizar para revisar el código de la aplicación y puede ser integrada a tu IDE de desarrollo.


/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export const environment = {
  production: false,
  NUXEO: {
    PATH: 'https://documental.portaloas.udistrital.edu.co/nuxeo/',
    CREDENTIALS: {
      USERNAME: 'desarrollooas',
      PASS: 'desarrollooas2019',
    },
  },
  CONFIGURACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/',
  CONF_MENU_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/configuracion_crud_api/v1/menu_opcion_padre/ArbolMenus/',
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: 'Dnm6dwGVC74_jzLgFpYlnL7t0BAa',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email role documento',
    REDIRECT_URL: 'https://pruebasproduccion.portaloas.udistrital.edu.co',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'https://pruebasproduccion.portaloas.udistrital.edu.co',
  },
  CLIENTE_LINK: 'https://pruebasproduccion.portaloas.udistrital.edu.co/#/pages/dashboard',
  PARAMETROS_CRUD_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/parametros/v1/',
  PROYECTO_ACADEMICO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/proyecto_academico_crud/v1/',
  PERSONA_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/personas_crud/v1/',
  SGA_MID_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/sga_mid/v1/',
  GOOGLE_MID_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/google_mid/v1/',
  PRODUCCION_ACADEMICA_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/produccion_academica_crud/v2/',
  SOLICITUD_DOCENTE_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/solicitudes_crud/v1/',
  EVALUACION_DOCENTE_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/evaluaciones_crud/v1/',
  DOCUMENTO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/',
  TERCEROS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
  AUTENTICACION_MID_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/',
  SPAGOBI: {
    URL: 'https://intelligentia.udistrital.edu.co:8443/SpagoBIBirtReportEngine/BirtReportServlet?',
    CONTEXT: 'SBICONTEXT=%2FSpagoBI',
    ROLE: '&SBI_EXECUTION_ROLE=%2Fspagobi%2Fadmin',
    CON: '&SBI_COUNTRY=ES',
    LAN: '&SBI_LANGUAGE=es',
    HOST: '&SBI_HOST=https%3A%2F%2Fintelligentia.udistrital.edu.co%3A8443',
    DFORMAT: '&dateformat=DD-MM-YYYY',
    CONTROLLER: '&SBI_SPAGO_CONTROLLER=%2Fservlet%2FAdapterHTTP',
    USER: '&user_id=sergio_orjuela',
    EXECUTION: '&SBI_EXECUTION_ID=6b07b65c5d2611eba42cad9b403e2696',
    CROSS: '&isFromCross=false',
    ENVIRONMENT: '&SBI_ENVIRONMENT=DOCBROWSER',
  },
  // Servicios que podrían ser retirados ------------------------------------------------------------------
  NOTIFICACION_SERVICE: 'wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws',
};

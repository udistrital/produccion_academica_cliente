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
    CLIENTE_ID: 'e36v1MPQk2jbz9KM4SmKhk8Cyw0a',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email role documento',
    REDIRECT_URL: 'http://localhost:4200/',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'http://localhost:4200/',
  },
  PARAMETROS_CRUD_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8510/v1/',
  PROYECTO_ACADEMICO_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8116/v1/',
  PERSONA_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8121/v1/',
  SGA_MID_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8119/v1/',
  GOOGLE_MID_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8514/v1/',
  PRODUCCION_ACADEMICA_SERVICE: 'http://pruebasapi2.intranetoas.udistrital.edu.co:8111/v1/',
  SOLICITUD_DOCENTE_SERVICE: 'http://pruebasapi2.intranetoas.udistrital.edu.co:8117/v1/',
  EVALUACION_DOCENTE_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8512/',
  DOCUMENTO_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/documento_crud/v2/',
  TERCEROS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
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
  CORE_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/core_crud/v2/',
  NOTIFICACION_SERVICE: 'wss://pruebasapi.portaloas.udistrital.edu.co:8116/ws',
  OIKOS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/oikos_crud_api/v1/',
  UBICACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/ubicaciones_crud/v1/',
  DOCUMENTO_PROGRAMA_SERVICE: 'https://autenticacion.udistrital.edu.co/apioas/documento_programa_crud/v1/',
  EXPERIENCIA_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/experiencia_laboral_crud/v1/',
  FORMACION_ACADEMICA_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/formacion_academica_crud/v1/',
  ENTE_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/ente_crud/v1/',
  ORGANIZACION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/organizacion_crud/v1/',
  CIDC_SERVICE: 'http://200.69.103.88:3114/api/v1/',
  EVALUACION_INSCRIPCION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/evaluacion_inscripcion_crud/v2/',
  INSCRIPCION_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/inscripcion_crud/v2/',
};

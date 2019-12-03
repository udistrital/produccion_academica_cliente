export let FORM_TRANSFERENCIAINTERNA = {
  // titulo: 'FormacionAcademica',
  tipo_formulario: 'mini',
  alertas: true,
  btn: 'Guardar',
  btnLimpiar: 'Limpiar',
  modelo: 'InfoTransferenciaInterna',
  campos: [
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      nombre: 'Documento',
      label_i18n: 'documento_trans',
      placeholder_i18n: 'documento_trans',
      requerido: true,
      tipo: 'text',
    },
    {
      etiqueta: 'mat-date',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      nombre: 'FechaExpedicion',
      label_i18n: 'fecha_expe',
      placeholder_i18n: 'fecha_expe',
      requerido: true,
      tipo: 'date',
    },
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      nombre: 'codigo',
      label_i18n: 'codigo_trans',
      placeholder_i18n: 'codigo_trans',
      requerido: true,
      tipo: 'text',
    },
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      nombre: 'codigoconfir',
      label_i18n: 'codigo_trans_conf',
      placeholder_i18n: 'codigo_trans_conf',
      requerido: true,
      tipo: 'text',
    },
    /*
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      nombre: 'Telefono',
      label_i18n: 'telefono',
      placeholder_i18n: 'telefono',
      requerido: true,
      tipo: 'number',
      minimo: 1000,
    },
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      nombre: 'TelefonoAlterno',
      label_i18n: 'telefono_alternativo',
      placeholder_i18n: 'telefono_alternativo',
      requerido: true,
      tipo: 'number',
      minimo: 1000,
    },
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      nombre: 'CorreoElectronico',
      label_i18n: 'correo_principal',
      placeholder_i18n: 'correo_principal',
      requerido: true,
      tipo: 'text',
    },
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
      nombre: 'CorreoElectronicoConfir',
      label_i18n: 'correo_confirma',
      placeholder_i18n: 'correo_confirma',
      requerido: true,
      tipo: 'text',
    },
    */
    {
      etiqueta: 'select',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'carreraqueviene',
      label_i18n: 'carrera_viene',
      placeholder_i18n: 'carrera_viene',
      requerido: true,
      tipo: 'ProgramaAcademico',
      key: 'Nombre',
      opciones: [],
    },
    {
      etiqueta: 'select',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'carreratransfiere',
      label_i18n: 'carrera_trans',
      placeholder_i18n: 'carrera_trans',
      requerido: true,
      tipo: 'ProgramaAcademico',
      key: 'Nombre',
      opciones: [],
    },
    {
      etiqueta: 'input',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'UltimoSemestre',
      label_i18n: 'ultimo_semestre',
      placeholder_i18n: 'ultimo_semestre',
      requerido: true,
      tipo: 'number',
    },
    /*
    {
      etiqueta: 'select',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'Cancelo',
      label_i18n: 'cancelo',
      placeholder_i18n: 'cancelo',
      requerido: true,
    },
    */
    {
      etiqueta: 'textarea',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'Motivos',
      label_i18n: 'motivos',
      placeholder_i18n: 'motivos',
      requerido: true,
      tipo: 'text',
    },
  ],
}

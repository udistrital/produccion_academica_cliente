export let FORM_PREGUNTAS = {
  // titulo: 'FormacionAcademica',
  tipo_formulario: 'mini',
  alertas: true,
  btn: 'Guardar',
  btnLimpiar: 'Limpiar',
  modelo: 'InfoFormacionAcademica',
  campos: [
    {
      etiqueta: 'select',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'MedioEntero',
      label_i18n: 'medio_entero',
      placeholder_i18n: 'medio_entero',
      requerido: true,
      tipo: 'MedioEnteroUniversidad',
      key: 'Nombre',
      opciones: [],
    },
    {
      etiqueta: 'select',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'PresentoUniversidad',
      label_i18n: 'presento',
      placeholder_i18n: 'presento',
      requerido: true,
      tipo: 'PresentoUniversidad',
      key: 'Nombre',
      opciones: [],
    },
    {
      etiqueta: 'select',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'TipoInscripcion',
      label_i18n: 'tipo_inscrip',
      placeholder_i18n: 'tipo_inscrip',
      requerido: true,
      tipo: 'TipoInscripcionUniversidad',
      key: 'Nombre',
      opciones: [],
    },
    /*
    {
      etiqueta: 'textarea',
      claseGrid: 'col-lg-12 col-md-12 col-sm-12 col-xs-12',
      nombre: 'Observaciones',
      label_i18n: 'observacion',
      placeholder_i18n: 'observacion',
      requerido: true,
      tipo: 'text',
    },
    */
  ],
}

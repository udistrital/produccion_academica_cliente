export let FORM_ASIGNACION_CUPO = {
    // titulo: 'InfoPersona',
    tipo_formulario: 'mini',
    alertas: true,
    btn: 'Guardar',
    modelo: 'InfoCupos',
    campos: [
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-12 col-md-6 col-sm-12 col-xs-12',
            nombre: 'CuposAsignados',
            label_i18n: 'cupos_asignados',
            placeholder_i18n: 'cupos_asignados',
            requerido: true,
            tipo: 'number',
            minimo: 0,
            maximolog: 999,
        },
    ],
}

export let FORM_INFORMACION_CONTACTO_PREGRADO = {
    // titulo: 'InformacionContacto',
    tipo_formulario: 'mini',
    btn: 'Guardar',
    alertas: true,
    modelo: 'InformacionContacto',
    campos: [
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-3 col-md-6 col-sm-12 col-xs-12',
            nombre: 'EstratoResidencia',
            label_i18n: 'estrato_residencia',
            placeholder_i18n: 'estrato_residencia',
            requerido: true,
            tipo: 'number',
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-3 col-md-6 col-sm-12 col-xs-12',
            nombre: 'CodigoPostal',
            label_i18n: 'codigo_postal',
            placeholder_i18n: 'codigo_postal',
            requerido: false,
            tipo: 'text',
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-3 col-md-6 col-sm-12 col-xs-12',
            nombre: 'Telefono',
            label_i18n: 'telefono',
            placeholder_i18n: 'telefono',
            requerido: true,
            tipo: 'number',
            minimo: 1000,
        },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-3 col-md-6 col-sm-12 col-xs-12',
            nombre: 'TelefonoAlterno',
            label_i18n: 'telefono_alternativo',
            placeholder_i18n: 'telefono_alternativo',
            requerido: true,
            tipo: 'number',
            minimo: 1000,
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'PaisResidencia',
            label_i18n: 'pais_residencia',
            placeholder_i18n: 'pais_residencia',
            requerido: true,
            tipo: 'Lugar',
            key: 'Nombre',
            opciones: [],
            entrelazado: true,
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'DepartamentoResidencia',
            label_i18n: 'departamento_residencia',
            placeholder_i18n: 'departamento_residencia',
            requerido: true,
            tipo: 'Lugar',
            key: 'Nombre',
            opciones: [],
            entrelazado: true,
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'CiudadResidencia',
            label_i18n: 'ciudad_residencia',
            placeholder_i18n: 'ciudad_residencia',
            requerido: true,
            tipo: 'Lugar',
            key: 'Nombre',
            opciones: [],
        },
        // {
        //     etiqueta: 'select',
        //     claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
        //     nombre: 'LocalidadReside',
        //     label_i18n: 'localidad_residencia',
        //     placeholder_i18n: 'localidad_residencia',
        //     requerido: true,
        //     tipo: 'Lugar',
        //     key: 'Nombre',
        //     opciones: [],
        // },
        {
            etiqueta: 'input',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'DireccionResidencia',
            label_i18n: 'direccion_residencia',
            placeholder_i18n: 'direccion_residencia',
            requerido: true,
            tipo: 'text',
        },
        {
            etiqueta: 'select',
            claseGrid: 'col-lg-6 col-md-6 col-sm-12 col-xs-12',
            nombre: 'EstratoSocioenconomicoCostea',
            label_i18n: 'estrato_costea',
            placeholder_i18n: 'estrato',
            requerido: true,
            tipo: 'text',
            key: 'Id',
            opciones: [
                { Id: '1' },
                { Id: '2' },
                { Id: '3' },
                { Id: '4' },
                { Id: '5' },
                { Id: '6'},
            ],
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
            nombre: 'CorreoElectronicoConfirmar',
            label_i18n: 'correo_principal_confirmar',
            placeholder_i18n: 'correo_principal_confirmar',
            requerido: true,
            tipo: 'text',
        },
    ],
}
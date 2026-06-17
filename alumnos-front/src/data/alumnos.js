const imagenesPorNombre = {
    'timmy':   '/img/timmy.jpg',
    'sofía':   '/img/sofia.jpg',
    'javier':  '/img/javier.jpg',
    'lucía':   '/img/lucia.jpg',
    'marcos':  '/img/marcos.jpg',
    'ana':     '/img/ana.jpg',
    'carlos':  '/img/carlos.jpg',
    'elena':   '/img/elena.jpg',
    'diego':   '/img/diego.jpg',
    'valeria': '/img/valeria.jpg'
}

export const getImagen = (nombre) => {

    if (nombre) {
        return imagenesPorNombre[nombre.trim().toLowerCase()]
    }
}

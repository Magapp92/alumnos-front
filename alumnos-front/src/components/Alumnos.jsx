import { createContext, useContext, useEffect, useRef, useState } from "react"
import './Alumnos.css'
import { getImagen } from '../data/alumnos'

const AlumnosContext = createContext()

export const Alumnos = () => {

    const { VITE_EXPRESS } = import.meta.env

    const [ alumnos, setAlumnos ] = useState([])
    const [ editando, setEditando ] = useState(null)

    const formularioPost = useRef(null)
    const formsRef = useRef(null)

    let getAlumnos = async () => {
        console.log(`Obteniendo alumnos`)

        let options = {
            method: `get`
        }
        let peticion = await fetch(VITE_EXPRESS, options)
        let { data } = await peticion.json()

        setAlumnos(data)
    }

    let deleteAlumno = async (idParam) => {
        console.log(`Eliminando al alumno ${idParam}`)

        let options = {
            method: `delete`
        }
        const peticion = await fetch(`${VITE_EXPRESS}/${idParam}`, options)
        const { data } = await peticion.json()

        setAlumnos(data)

        if (editando && editando._id === idParam) setEditando(null)
    }

    let putAlumno = async (idParam, datos) => {
        console.log(`Actualizando al alumno ${idParam}`)

        let options = {
            method: `put`,
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(datos)
        }
        let peticion = await fetch(`${VITE_EXPRESS}/${idParam}`, options)
        let { data } = await peticion.json()

        setAlumnos(data)
    }

    let postAlumno = async ( e ) => {
        e.preventDefault()
        console.log(`Añadiendo alumno`)

        const { nombre, edad, curso, aprobado } = formularioPost.current
        const nuevo = {
            nombre: nombre.value,
            edad: edad.value,
            curso: curso.value,
            aprobado: aprobado.value === `true`
        }

        let options = {
            method: `post`,
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(nuevo)
        }
        const peticion = await fetch(VITE_EXPRESS, options)
        const { data } = await peticion.json()
        
        setAlumnos(data)

        formularioPost.current.reset()
    }

    const submitEdit = (datos) => {
        putAlumno(editando._id, datos)
        setEditando(null)
    }

    useEffect( () => {
        getAlumnos()
    }, [])

    useEffect( () => {
        if (editando) {
            formsRef.current?.scrollIntoView()
        }
    }, [editando])

    return (

        <AlumnosContext.Provider value={{ setEditando, deleteAlumno }}>
        <section className="Alumnos">

            <header className="Alumnos-header">
                <h1 className="Alumnos-title">Gestión de Alumnos</h1>
            </header>

            <div className="Alumnos-forms" ref={formsRef}>
                <div className="Alumnos-formulario">
                    <h3 className="Alumnos-h3">Añadir alumno</h3>
                    <form className="Alumnos-form" onSubmit={postAlumno} ref={formularioPost}>
                        <input type="text"   name="nombre" placeholder="Nombre" className="Alumnos-input" required/>
                        <input type="number" name="edad"   placeholder="Edad"   className="Alumnos-input" required min="0" max="200"/>
                        <select name="curso" className="Alumnos-input" defaultValue="Fullstack" required>
                            <option value="Fullstack">Fullstack</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                        </select>
                        <select name="aprobado" className="Alumnos-input" defaultValue="true" required>
                            <option value="true">Aprobado</option>
                            <option value="false">Suspenso</option>
                        </select>
                        <input type="submit" value="Añadir alumno" className="Alumnos-send"/>
                    </form>
                </div>

                { editando && (
                    <FormularioEdit key={editando._id} alumno={editando}
                    onSubmit={submitEdit} onCancel={() => setEditando(null)} />
                )}
            </div>

            { alumnos?.length === 0 && <p className="Alumnos-empty">No hay alumnos</p> }

            <div className="Alumnos-grid">
                { alumnos?.map( alumno =>
                    <Tarjeta key={alumno._id} {...alumno} />
                )}
            </div>

        </section>
        </AlumnosContext.Provider>

    )
}

const FormularioEdit = ( { alumno, onSubmit, onCancel } ) => {

    const { _id, nombre, curso, edad, aprobado } = alumno
    const formularioPut = useRef(null)

    const handleSubmit = ( e ) => {
        e.preventDefault()
        console.log(`Guardando cambios del alumno ${_id}`)

        const { nombre, edad, curso, aprobado } = formularioPut.current
        const datos = {
            nombre: nombre.value,
            edad: edad.value,
            curso: curso.value,
            aprobado: aprobado.value === `true`
        }

        onSubmit( datos )
    }

    return (
        <div className="Alumnos-formulario Alumnos-formulario--edit">
            <h3 className="Alumnos-h3">Editar alumno</h3>
            <form className="Alumnos-form" onSubmit={handleSubmit} ref={formularioPut}>
                <input type="hidden" name="_id" defaultValue={_id}/>
                <input type="text"   name="nombre" placeholder="Nombre" className="Alumnos-input" defaultValue={nombre} required/>
                <input type="number" name="edad"   placeholder="Edad"   className="Alumnos-input" defaultValue={edad}   required min="0" max="200"/>
                <select name="curso" className="Alumnos-input" defaultValue={curso}>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                </select>
                <select name="aprobado" className="Alumnos-input" defaultValue={String(aprobado)}>
                    <option value="true">Aprobado</option>
                    <option value="false">Suspenso</option>
                </select>
                <div className="Alumnos-actions">
                    <input type="submit" value="Guardar" className="Alumnos-send Alumnos-send--mini"/>
                    <button type="button" className="Alumnos-send Alumnos-send--mini Alumnos-send--secundario" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    )
}


const Tarjeta = ( props ) => {

    const { setEditando, deleteAlumno } = useContext(AlumnosContext)

    const { _id, nombre, curso, edad, aprobado } = props

    return (
        <article className={`Tarjeta Tarjeta--${curso.toLowerCase()}`}>
            <img className="Tarjeta-img" src={getImagen(nombre)} alt={nombre} />
            <h3 className="Tarjeta-h3">{nombre}</h3>

            <p className="Tarjeta-p">
                <span className="Tarjeta-pLabel">Curso:</span> {curso}
            </p>
            <p className="Tarjeta-p">
                <span className="Tarjeta-pLabel">Edad:</span> {edad}
            </p>
            <p className="Tarjeta-p">
                <span className="Tarjeta-pLabel">Estado:</span> { aprobado ? `Aprobado` : `Suspenso` }
            </p>

            <div className="Tarjeta-actions">
                <button className="Alumnos-send Alumnos-send--mini" onClick={() => setEditando(props)}>Editar</button>
                <button className="Alumnos-send Alumnos-send--mini Alumnos-send--red" onClick={() => deleteAlumno(_id)}>Borrar</button>
            </div>

        </article>
    )
}

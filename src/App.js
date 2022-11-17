import React, { useEffect, useState } from "react";

import { firebase } from "./firebase";
import Swal from "sweetalert2";

//rafce
function App() {
  //hooks
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [id, setId] = useState("");
  const [lista, setLista] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {

      try {

        const db = firebase.firestore()
        const data = await db.collection('usuarios').get()
        console.log(data.docs);
        const arrayData = data.docs.map((documento) => ({ id: documento.id, ...documento.data() }))
        setLista(arrayData);
      } catch (error) {

        console.log(error);

      }

    }
    obtenerDatos();
  }, []);

  const guardarDatos = async (e) => {

    e.preventDefault()

    if (!nombre.trim()) {
      window.Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por Favor, Ingrese Un Nombre',
      })
      return
    }


    if (!apellido.trim()) {

      window.Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por Favor, Ingrese Un Apellido',
      })
      return
    }

    try {

      const db = firebase.firestore()
      const nuevoUsuario = {
        nombre, apellido
      }
      //agregar a bd en firebase
      const dato = await db.collection('usuarios').add(nuevoUsuario)
      //agregar a lista
      setLista([
        ...lista,
        { id: dato.id, ...nuevoUsuario }
      ]);

    } catch (error) {

      console.log(error);

    }

    //alerta success
    window.Swal.fire({
      icon: 'success',
      title: 'Agregado!',
      text: 'Se Agrego Correctamente A La Lista',
    });

    //limpiar los estados
    setNombre("");
    setApellido("");
    setId("");
    //setError(null);
  };

  //Eliminar
  const eliminarDato = async (id) => {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estas Seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Bórralo!',
      cancelButtonText: 'No, Cancelalo!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {

          const db = firebase.firestore()
          await db.collection('usuarios').doc(id).delete()
          const listaFiltrada = lista.filter((elemento) => elemento.id !== id)
          setLista(listaFiltrada);

        } catch (error) {
          console.log(error);
        }

        swalWithBootstrapButtons.fire(
          '¡Eliminado!',
          'Su archivo ha sido eliminado',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          '¡Cancelado!',
          'Tu archivo está a salvo :)',
          'error'
        )
      }
    })

  }


  //funcion para activar el modo edicion
  const editar = (elemento) => {
    setModoEdicion(true);
    setNombre(elemento.nombre)
    setApellido(elemento.apellido)
    setId(elemento.id)
  };

  const editarDatos = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      window.Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por Favor, Ingrese Un Nombre',
      })
      return
    }

    if (!apellido.trim()) {
      window.Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por Favor, Ingrese Un Apellido',
      })
      return
    }

    try {

      const db = firebase.firestore()
      await db.collection('usuarios').doc(id).update({ nombre, apellido })
      const listaEditada = lista.map((elemento) => elemento.id === id ? { id, nombre, apellido } : elemento)
      setLista(listaEditada)
      setModoEdicion(false)
      setNombre("");
      setApellido("");
      setId("");
      //setError(null);

    } catch (error) {
      console.log(error);
    }

    //alerta success
    window.Swal.fire({
      icon: 'success',
      title: 'Editado!',
      text: 'Se Agrego Correctamente A La Lista',
    });
  };



  return (
    <div className="container">
      <div className="row">
        <div className="col-12">

          <h2 className="text-center">{modoEdicion ? 'Edicion Del Usuario' : 'Registro De Usuarios'}</h2>

          {/* {
            error ? (<div className="alert alert-danger" role="alert">
              {error}
            </div>) : null
          } */}

          <form onSubmit={modoEdicion ? editarDatos : guardarDatos}>

            <input type="text" placeholder="Ingrese Nombre" className="form-control my-2 input"
              onChange={(e) => { setNombre(e.target.value) }} value={nombre} />

            <input type="text" placeholder="Ingrese Apellido" className="form-control my-2 input"
              onChange={(e) => { setApellido(e.target.value) }} value={apellido} />

            <div className="d-grip gap-2">
              {
                modoEdicion ? <button className="btn btn-danger center" type="submit">Editar</button> :
                  <button className="btn btn-success center" type="submit">Agregar</button>
              }
            </div>

          </form>
        </div>
      </div>

      <hr />
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">Listado De Usuarios Registrados</h2>

          <ul className="list-group">
            {
              lista.map((elemento) => (

                <li className="list-group-item" key={elemento.id}> {elemento.nombre} - {elemento.apellido}

                  <button className="btn btn-warning float-end mx-3"
                    onClick={() => editar(elemento)}>Editar</button>

                  <button className="btn btn-danger float-end mx-3"
                    onClick={() => eliminarDato(elemento.id)} >Eliminar</button>
                </li>

              ))
            }
          </ul>

        </div>
      </div>
    </div>
  );
}
export default App;

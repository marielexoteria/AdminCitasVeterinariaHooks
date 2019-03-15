import React, { useState, Fragment, useEffect } from 'react';

function Cita({cita, index, eliminarCita}) { //haciendo destructuring para pasar a los valores "cita" del state local llamado "cita"
    return (
        <div className="cita">
            <p>Mascota: <span>{cita.mascota}</span></p>
            <p>Dueño: <span>{cita.propietario}</span></p>
            <p>Fecha: <span>{cita.fecha}</span></p>
            <p>Hora: <span>{cita.hora}</span></p>
            <p>Síntomas: <span>{cita.sintomas}</span></p>
            <button onClick={() => eliminarCita(index)} type="button" className="button eliminar u-full-width">Eliminar X</button>

        </div>
    )
}

function Formulario({crearCita}) { //haciendo destructuring del prop que se manda desde App()
    const stateInicial = {
      mascota: '',
      propietario: '',
      fecha: '',
      hora: '',
      sintomas: ''
  }


    //useState retorna 2 funciones (que puedo nombrar como yo quiera)
    //cita = el state local con la info del formulario, equivalente a this.state
    //actualizarCita = función que actualiza el state, equivalente a this.setState()
    // useState({}) = para iniciar un objeto vacío
    const [cita, actualizarCita] = useState(stateInicial);

    const actualizarState = e => { //arrow function con parámetro de evento para leer el formulario, y puede ir sin ()
        actualizarCita({
            ...cita, //tomando una copia del state llamado cita para actualizarlo sin que se pierda la info en las diferentes propiedades
            [e.target.name]: e.target.value //e.target.name va a leer lo que se escriba en los diferentes campos del formulario (name="mascota", etc.) y lo va a agregar al state "cita" - value siendo lo que se escribe en los campos
        })
    }

    const enviarCita = e => {
        e.preventDefault();
        console.log(cita);

        //pasar la cita al componente principal
        crearCita(cita);

        //reiniciar el state y el form
        actualizarCita(stateInicial);
    }


    return (
      <Fragment>
          <h2>Crear Cita</h2>
          <form onSubmit={enviarCita}>
                <label>Nombre de la mascota</label>
                <input type="text" name="mascota" className="u-full-width" placeholder="Nombre de tu mascota" 
                  onChange={actualizarState} value={cita.mascota} />

                <label>Nombre del dueño de la mascota</label>
                <input type="text" name="propietario" className="u-full-width" placeholder="Nombre del dueño de la mascota" onChange={actualizarState} value={cita.propietario} />

                <label>Fecha</label>
                <input type="date" className="u-full-width" name="fecha" onChange={actualizarState} value={cita.fecha} />               

                <label>Hora</label>
                <input type="time" className="u-full-width" name="hora" onChange={actualizarState} value={cita.hora} />

                <label>Síntomas</label>
                <textarea className="u-full-width" name="sintomas" onChange={actualizarState} value={cita.sintomas}></textarea>

                <button type="submit" className="button-primary u-full-width">Agregar Cita</button>
            </form>
      </Fragment>
    )
}

function App() {
    //cargando las citas del localStorage del browser como state inicial
    let citasIniciales = JSON.parse(localStorage.getItem('citas')); //localStorage solamente almacena strings

    if (!citasIniciales) { //si no hay citas, que la variable se inicialice con un arreglo vacío
        citasIniciales = [];
    } 


    //useState retorna 2 funciones (que puedo nombrar como yo quiera)
    //citas = el state actual de toda la aplicación, equivalente a this.state
    //guardarCita = función que actualiza el state, equivalente a this.setState()
    /* useState([]) = los corchetes vacíos simbolizan el valor inicial del state si éste fuera un array, equivalente a
      state = {
          citas: []
      }
    */
    const [citas, guardarCita] = useState(citasIniciales); //leyendo las citas que hayan del localStorage

    //agregando las nuevas citas al state
    const crearCita = cita => {
        //tomando una copia del state y agregando el nuevo cliente
        const nuevaCita = [...citas, cita];
        //almacenando la nueva cita en el state de la aplicación
        guardarCita(nuevaCita);

    }

    //borrando las citas del state
    const eliminarCita = index => {
        //tomando una copia del state
        const nuevaCita = [...citas];
        //borrando la cita
        nuevaCita.splice(index, 1);
        //actualizando el state
        guardarCita(nuevaCita);
    }

    //almacenando las citas en localStorage utilizando useEffect()
    useEffect(
        () => {
            let citasIniciales = JSON.parse(localStorage.getItem('citas')); //localStorage solamente almacena strings

            if (citasIniciales) {
                localStorage.setItem('citas', JSON.stringify(citas)); //este state "citas" es el que se crea en App()
            } else {
                localStorage.setItem('citas', JSON.stringify([])); //en caso de que no haya citas se crea el local storage con un arreglo vacío
            }
        },[citas] //agregando [citas] como una dependencia se asegura que useEffect solamente se ejecute cuando una cita se agregue o se elimine (en caso de que hubiera otros componentes, si [citas] no está entonces useEffect se ejecutaría siempre)
    );
    

    //cargando el título según si hay citas a administrar o no
    const titulo = Object.keys(citas).length === 0 ? "No hay citas" : "Administrar citas"; //if Object.keys ... = 0 (revisa si el state citas está vacío o contiene info) then titulo = "No hay citas" else titulo = "Administrar"

    return (
        <Fragment>
            <h1>Administrador de Pacientes de Veterinaria</h1>
            <div className="container">
                <div className="row">
                    <div className="one-half column">
                        <Formulario 
                            crearCita = {crearCita}
                        />
                    </div>
                    <div className="one-half column">
                        <h2>{titulo}</h2>
                        {citas.map((cita, index) => (
                            <Cita
                                key = {index}
                                index = {index}
                                cita = {cita} 
                                eliminarCita = {eliminarCita}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
        
    )
}

export default App;

import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Table } from 'react-bootstrap';
import { DivTable } from '../Styles/styles'

const urlLocalidad = "https://localhost:44357/api/localidad";
const urlPartido = "https://localhost:44357/api/partido";





export default class Localidad extends Component {

  state = {
    dataProv: [],
    dataPartido: [],
    mensajeGetApiGob: [],
    modalInsertar: false,
    modalEliminar: false,
    modalGetApiGob: false,
    habilitarbtnInsertar: true,
    form: {
      id: '',
      nombre: '',
      idpartido: '',
      tipoModal: '',

    }
  }

  configAxios = {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*',
      'Acces-Control-Allow-Origin': '*'
    },
  };


  peticionGet = () => {
    axios.get(urlLocalidad, this.configAxios).then(response => {
      this.setState({ dataProv: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetApiGob = () => {
    axios.get(urlLocalidad + "/getdatagobtodb", this.configAxios).then(response => {
      this.setState({ mensajeGetApiGob: response.data });
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetPartido = () => {
    axios.get(urlPartido, this.configAxios).then(response => {
      this.setState({ dataPartido: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }



  peticionPost = async () => {
    delete this.state.form.id;
    await axios.post(urlLocalidad, this.state.form, this.configAxios).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPut = () => {
    axios.put(urlLocalidad, this.state.form, this.configAxios).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete = () => {
    axios.delete(urlLocalidad + "/" + this.state.form.id, this.configAxios).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar, habilitarbtnInsertar: !this.state.habilitarbtnInsertar });
  }

  seleccionarLocalidad = (localidad) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: localidad.id,
        nombre: localidad.nombre,
        idpartido: localidad.idpartido
      }

    })
  }


  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
    if (this.state.form.idpartido > 0) {
      var aux = this.state.form.nombre
      if (this.state.form.nombre != null && aux.length > 0) {
        this.setState({ habilitarbtnInsertar: true });
      }
    } else {
      this.setState({ habilitarbtnInsertar: false });
    }
  }

  componentDidMount() {
    this.peticionGet();
    this.peticionGetPartido();

  }


  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ modalGetApiGob: true }); this.peticionGetApiGob() }}>Get API Gob</button>
        {"        "}
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Localidad</button>
        <br /><br />
        <DivTable>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>ID de Partido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataProv.map(localidad => {
                return (
                  <tr>
                    <td>{localidad.id}</td>
                    <td>{localidad.nombre}</td>
                    {this.state.dataPartido.map(partido => {

                      if (partido.id === localidad.idpartido) {
                        return (
                          <td>{partido.nombre}</td>
                        )
                      }

                    })}
                    <td>
                      <button className="btn btn-primary" onClick={() => { this.seleccionarLocalidad(localidad); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                      {"   "}
                      <button className="btn btn-danger" onClick={() => { this.seleccionarLocalidad(localidad); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </DivTable>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.dataProv[this.state.dataProv.length - 1].id + 1} />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
              <br />

              <select defaultValue={this.state.form ? this.state.form.idpartido : ''} name="idpartido" id="idpartido" className="form-control" onChange={this.handleChange}>

                {this.state.tipoModal == 'insertar' ? <option value="0">Seleccione un partido </option> : ''}
                {this.state.dataPartido.map(partido => {


                  return (

                    <option value={partido.id}>{partido.nombre} </option>

                  )


                })}



              </select>

            </div>
          </ModalBody>

          <ModalFooter>

            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" disabled={!this.state.habilitarbtnInsertar} onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" disabled={!this.state.habilitarbtnInsertar} onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalGetApiGob}>
          <ModalBody>
            <h1>{this.state.mensajeGetApiGob}</h1>
          </ModalBody>
          <ModalFooter>
            <div >
              <button className="btn btn-danger" onClick={() => this.setState({ modalGetApiGob: false })}>Aceptar</button>
            </div>

          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar la localidad {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>
      </div>



    );
  }
}

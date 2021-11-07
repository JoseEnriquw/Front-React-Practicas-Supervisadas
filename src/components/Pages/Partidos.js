import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Table } from 'react-bootstrap';
import { DivTable } from '../Styles/styles'

const urlPartido = "https://localhost:44357/api/partido";
const urlPartidoincia = "https://localhost:44357/api/provincia";





export default class Partido extends Component {

  state = {
    dataPartido: [],
    dataProvincia: [],
    mensajeGetApiGob: [],
    modalInsertar: false,
    modalEliminar: false,
    modalGetApiGob: false,
    habilitarbtnInsertar: true,
    form: {
      id: '',
      nombre: '',
      idprovincia: '',
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
    axios.get(urlPartido, this.configAxios).then(response => {
      this.setState({ dataPartido: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetApiGob = () => {
    axios.get(urlPartido + "/getdatagobtodb", this.configAxios).then(response => {
      this.setState({ mensajeGetApiGob: response.data });
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetProvincia = () => {
    axios.get(urlPartidoincia, this.configAxios).then(response => {
      this.setState({ dataProvincia: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }



  peticionPost = async () => {
    delete this.state.form.id;
    await axios.post(urlPartido, this.state.form, this.configAxios).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPut = () => {
    axios.put(urlPartido, this.state.form, this.configAxios).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete = () => {
    axios.delete(urlPartido + "/" + this.state.form.id, this.configAxios).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar, habilitarbtnInsertar: !this.state.habilitarbtnInsertar });
  }

  seleccionarPartido = (partido) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: partido.id,
        nombre: partido.nombre,
        idprovincia: partido.idprovincia
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
    if (this.state.form.idprovincia > 0) {
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
    this.peticionGetProvincia();

  }


  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ modalGetApiGob: true }); this.peticionGetApiGob() }}>Get API Gob</button>
        {"        "}
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Partido</button>
        <br /><br />
        <DivTable>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>ID de Provincia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataPartido.map(partido => {
                return (
                  <tr>
                    <td>{partido.id}</td>
                    <td>{partido.nombre}</td>
                    {this.state.dataProvincia.map(provincia => {

                      if (provincia.id === partido.idprovincia) {
                        return (
                          <td>{provincia.nombre}</td>
                        )
                      }

                    })}
                    <td>
                      <button className="btn btn-primary" onClick={() => { this.seleccionarPartido(partido); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                      {"   "}
                      <button className="btn btn-danger" onClick={() => { this.seleccionarPartido(partido); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
              <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.dataPartido[this.state.dataPartido.length - 1].id + 1} />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
              <br />

              <select defaultValue={this.state.form ? this.state.form.idprovincia : ''} name="idprovincia" id="idprovincia" className="form-control" onChange={this.handleChange}>

                {this.state.tipoModal == 'insertar' ? <option value="0">Seleccione un provincia </option> : ''}
                {this.state.dataProvincia.map(provincia => {


                  return (

                    <option value={provincia.id}>{provincia.nombre} </option>

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
            Estás seguro que deseas eliminar la partido {form && form.nombre}
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
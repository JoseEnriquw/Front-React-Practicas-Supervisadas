import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Table} from 'react-bootstrap';
import { DivTable, DivSideBar, DivCenter } from '../Styles/styles'


const urlProv = "https://localhost:44357/api/Provincia";
const urlPais = "https://localhost:44357/api/pais";





export default class Provincia extends Component {

  state = {
    dataProv: [],
    dataPais: [],
    mensajeGetApiGob: [],
    modalInsertar: false,
    modalEliminar: false,
    modalGetApiGob: false,
    habilitarbtnInsertar: true,
    filters: {
      paisNombre: ''
    },
    form: {
      id: '',
      nombre: '',
      idpais: '',
      tipoModal: ''
    },
  }

  

  ErrorMsj = "NO HUBO INGRESO DE DATOS, DEBIDO A QUE YA ESTAN EN LA BASE DE DATOS O NO HAY DATOS PARA MIGRAR"

  configAxios = {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*',
      'Acces-Control-Allow-Origin': '*',
      'Acces-Control-Allow-Method': '*'
    },
  };


  peticionGet = () => {

    var pais = JSON.stringify(this.state.filters)

    axios.post(urlProv + "/get", pais, this.configAxios).then(response => {
      this.setState({ dataProv: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetApiGob = () => {
    axios.get(urlProv + "/getdatagobtodb", this.configAxios).then(response => {
      this.setState({ mensajeGetApiGob: response.data });

      this.peticionGet();



    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetPais = () => {
    
    axios.get(urlPais, this.configAxios).then(response => {
      this.setState({ dataPais: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }



  peticionPost = async () => {
    delete this.state.form.id;
    await axios.post(urlProv, this.state.form, this.configAxios).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPut = () => {
    axios.put(urlProv, this.state.form, this.configAxios).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete = () => {
    axios.delete(urlProv + "/" + this.state.form.id, this.configAxios).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar, habilitarbtnInsertar: !this.state.habilitarbtnInsertar });
  }

  seleccionarProvincia = (provincia) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: provincia.id,
        nombre: provincia.nombre,
        idpais: provincia.idpais
      }

    })
  }
 
  handleSubmitPais = async e =>{
    await this.setState({
      filters: {
        ...this.state.filters,
        [e.target.name]: e.target.value
      }
    })
    console.log(this.state.filters);
    this.peticionGet();
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
    if (this.state.form.idpais > 0) {
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
    this.peticionGetPais();

  }


  render() {
    const { form } = this.state;
    return (

      <DivCenter>
        <DivSideBar>
          <select name="paisNombre" id="paisNombre" title="Pais" onChange={this.handleSubmitPais}>
            <option value="" >Todos los pa??ses</option>
            {this.state.dataPais.map(pais => {
                return (
                  <option value={pais.nombre} >{pais.nombre}</option>
                );
                })}
          </select>
        </DivSideBar>
        <DivCenter>
          <DivTable>
            <br /><br /><br />
            <button className="btn btn-success" onClick={() => { this.setState({ modalGetApiGob: true }); this.peticionGetApiGob() }}>Obtener datos de API Gobierno</button>
            {"        "}
            <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Provincia</button>
            <br /><br />
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>ID de Pais</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {this.state.dataProv.map(provincia => {
                  return (
                    <tr>
                      <td>{provincia.id}</td>
                      <td>{provincia.nombre}</td>
                      {this.state.dataPais.map(pais => {

                        if (pais.id === provincia.idpais) {
                          return (
                            <td>{pais.nombre}</td>
                          )
                        }

                      })}
                      <td>
                        <button className="btn btn-primary" onClick={() => { this.seleccionarProvincia(provincia); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                        {"   "}
                        <button className="btn btn-danger" onClick={() => { this.seleccionarProvincia(provincia); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
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

                <select defaultValue={this.state.form ? this.state.form.idpais : ''} name="idpais" id="idpais" className="form-control" onChange={this.handleChange}>

                  {this.state.tipoModal == 'insertar' ? <option value="0">Seleccione un pais </option> : ''}
                  {this.state.dataPais.map(pais => {


                    return (

                      <option value={pais.id}>{pais.nombre} </option>

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
                <button className="btn btn-danger" onClick={() => {
                  this.setState({ modalGetApiGob: false });
                  this.state.mensajeGetApiGob === this.ErrorMsj ? this.setState({ modalGetApiGob: false }) : window.location.replace('');
                }}>
                  Aceptar
                </button>
              </div>

            </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
              Est??s seguro que deseas eliminar la provincia {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={() => this.peticionDelete()}>S??</button>
              <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
            </ModalFooter>
          </Modal>
        </DivCenter>
      </DivCenter>



    );
  }
}

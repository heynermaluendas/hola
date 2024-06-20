import { QuestionCircleOutlined,BellOutlined  } from '@ant-design/icons';
import React, { useState,useEffect } from 'react';
import { Badge, Button,Modal,Table,Form,Input } from 'antd';
import ExportToExcel from './ExportToExcel';
import axios from 'axios';



 const baseURl= 'http://localhost:3001/artista'
const {Item} = Form;
 const layout={
   labelCol:{
     span: 8
   },
   wrapperCol:{
     span:16
   }
 }

export type SiderTheme = 'light' | 'dark';



export const CustomBell = ({ count = 0 }) => {
  const [modal,setModal] =useState(false)
  const [localCount, setLocalCount] = useState(count);
  const [notifications, setNotifications] =  useState<string[]>([]);;
  
  const abrirModal=()=>{
    setModal(true)
  }
  const cerrarModal=()=>{
    setModal(false)
  }
  const mensaje=()=>{
    console.log('hiola')
  }

  const incrementCount = () => {
    setLocalCount(localCount + 1);
    setNotifications([...notifications, `Notificación ${localCount + 1}`])

  };
  return (<>
    <div onClick={abrirModal}  onMouseEnter={incrementCount} style={{height:'26px',width: '26px' ,display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',}}>
      <Badge
      count={localCount}
      overflowCount={99}
      style={{
        fontSize: '9px', // Tamaño de la insignia más pequeño
        height: '14px',
        minWidth: '14px',
        lineHeight: '14px',
        transform: 'translate(50%, -50%)',
        padding: '0',
        margin: '0'
        }}
        >
      <BellOutlined style={{ padding: 0, fontSize: '18px', color: 'gray' }} />
    </Badge>
    </div>
    <Modal open={modal}  onCancel={cerrarModal } onOk={mensaje}>
    {notifications.map((notification, index) => (
          <p key={index}>{notification}</p>
        ))}
    </Modal>
      </>
    

    )
    
  }

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

export const Tabla = () =>{

  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [artista, setArtista] = useState({
    id: '',
    artista: '',
    pais: '',
    periodo: ''
  });

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };
  
  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setArtista({ ...artista, [name]: value });
    console.log(artista);
  };

  const seleccionarArtista = (artista, caso) => {
    setArtista(artista);
    (caso === 'Editar') ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Artista',
      dataIndex: 'artista',
      key: 'artista'
    },
    {
      title: 'País',
      dataIndex: 'pais',
      key: 'pais'
    },
    {
      title: 'Periodo de Actividad',
      dataIndex: 'periodo',
      key: 'periodo'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: fila => (
        <>
          <Button type='primary' onClick={() => seleccionarArtista(fila, 'Editar')}>Editar</Button>
          <Button type='primary' danger onClick={() => seleccionarArtista(fila, 'Eliminar')}>Eliminar</Button>
        </>
      )
    },
  ];

  const peticionGet = async () => {
    await axios.get(baseURl)
      .then(response => {
        setData(response.data);
      }).catch(error => {
        console.log(error);
      });
  };

  const peticionPost = async () => {
    delete artista.id;
    await axios.post(baseURl, artista)
      .then(response => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      }).catch(error => {
        console.log(error);
      });
  };

  const peticionPut = async () => {
    await axios.put(`${baseURl}/${artista.id}`, artista)
      .then(response => {
        const dataAuxiliar = data.map(elemento => {
          if (elemento.id === artista.id) {
            elemento.artista = artista.artista;
            elemento.pais = artista.pais;
            elemento.periodo = artista.periodo;
          }
          return elemento;
        });
        setData(dataAuxiliar);
        abrirCerrarModalEditar();
      }).catch(error => {
        console.log(error);
      });
  };

  const peticionDelete = async () => {
    await axios.delete(`${baseURl}/${artista.id}`)
      .then(response => {
        setData(data.filter(elemento => elemento.id !== artista.id));
        abrirCerrarModalEliminar();
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    peticionGet();
  }, []);

  return (
    <div className='app'>
      <Button type='primary' className='botonInsertar' onClick={abrirCerrarModalInsertar}>Insertar nuevo artista</Button>
      <ExportToExcel fileName='data' data={data} />
      <br />
      <br />
      <br />
      <Table columns={columns} dataSource={data}></Table>
      <br />
      <br />
      <br />

      <Modal
        open={modalInsertar}
        title="Insertar artista"
        destroyOnClose={true}
        onCancel={abrirCerrarModalInsertar}
        centered
        footer={[
          <Button onClick={abrirCerrarModalInsertar}>Cancelar</Button>,
          <Button type='primary' onClick={peticionPost}>Insertar</Button>
        ]}
      >
        <Form {...layout}>
          <Item label='Artista'>
            <Input name='artista' onChange={handleChange} />
          </Item>
          <Item label='País'>
            <Input name='pais' onChange={handleChange} />
          </Item>
          <Item label='Periodo de actividad'>
            <Input name='periodo' onChange={handleChange} />
          </Item>
        </Form>
      </Modal>

      <Modal
        open={modalEditar}
        title="Editar artista"
        onCancel={abrirCerrarModalEditar}
        centered
        footer={[
          <Button onClick={abrirCerrarModalEditar}>Cancelar</Button>,
          <Button type='primary' onClick={peticionPut}>Editar</Button>
        ]}
      >
        <Form {...layout}>
          <Item label='Artista'>
            <Input name='artista' onChange={handleChange} value={artista.artista} />
          </Item>
          <Item label='País'>
            <Input name='pais' onChange={handleChange} value={artista.pais} />
          </Item>
          <Item label='Periodo de actividad'>
            <Input name='periodo' onChange={handleChange} value={artista.periodo} />
          </Item>
        </Form>
      </Modal>

      <Modal
        open={modalEliminar}
        title="Eliminar artista"
        onCancel={abrirCerrarModalEliminar}
        centered
        footer={[
          <Button onClick={abrirCerrarModalEliminar}>No</Button>,
          <Button type='primary' danger onClick={peticionDelete}>Sí</Button>
        ]}
      >
        <p>¿Estás seguro de que deseas eliminar al artista <b>{artista && artista.artista}</b>?</p>
      </Modal>
    </div>
  );
}



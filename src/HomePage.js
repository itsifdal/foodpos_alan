import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMenu, setDeletingMenu] = useState(null);

  const [menus, setMenus] = useState([]);
  const [nama_menu, setNamaMenu] = useState("");
  const [harga, setHarga] = useState("");
  const [file, setFile] = useState("");

  const handleChange = (e) => {
    const image = e.target.files[0];
    setFile(image);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = () => {
    axios.get('http://localhost:8000/api/menu')
      .then((response) => {
        const menusWithImageUrls = response.data.map((menu) => ({
          ...menu,
          gambar: `http://localhost:8000/images/${menu.gambar}`,
        }));
        setMenus(menusWithImageUrls);
      })
      .catch((error) => console.error('Error fetching menu data:', error));
  };

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_menu", nama_menu);
    formData.append("harga", harga);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/menu", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      handleCreateModalClose();
      fetchMenus();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateModalShow = () => {
    setShowCreateModal(true);
    setEditingMenu(null);
    setNamaMenu("");
    setHarga("");
    setFile("");
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleUpdateMenu = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama_menu", nama_menu);
    formData.append("harga", harga);

    try {
      await axios.put(`http://localhost:8000/api/menu/${editingMenu.id}`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      handleUpdateModalClose();
      fetchMenus();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateModalShow = (menu) => {
    setShowUpdateModal(true);
    setEditingMenu(menu);
    setNamaMenu(menu.nama_menu);
    setHarga(menu.harga);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setEditingMenu(null);
    setNamaMenu("");
    setHarga("");
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/menu/${deletingMenu.id}`);
      setShowDeleteModal(false);
        fetchMenus();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingMenu(null);
  };

  const handleDeletModalShow = (menu) => {
    setShowDeleteModal(true);
    setDeletingMenu(menu);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeletingMenu(null);
  };

  return (
    <Container className="mt-4">
      <h4>List Menu</h4><hr />
      <Link to="/order-page">
        <Button variant="secondary" className="mb-4">
          Order Page
        </Button>
      </Link>{' '}
      <Button variant="primary" className="mb-4" onClick={handleCreateModalShow}>
        Create New Menu
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nama Menu</th>
            <th>Harga</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{menu.nama_menu}</td>
              <td>{menu.harga}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => handleUpdateModalShow(menu)}>
                  Edit
                </Button>{'  '}
                <Button variant="danger" size="sm" onClick={() => handleDeletModalShow(menu)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Modal Create */}
      <Modal show={showCreateModal} onHide={handleCreateModalClose}>
          <Modal.Header closeButton>
              <Modal.Title>Create New Menu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form>
                  <Form.Group controlId="formNamaMenu">
                      <Form.Label>Nama Menu</Form.Label>
                      <Form.Control
                      type="text"
                      name="nama_menu"
                      value={nama_menu}
                      placeholder="Enter Nama Menu"
                      onChange={(e) => setNamaMenu(e.target.value)}
                      />
                  </Form.Group>

                  <Form.Group controlId="formHarga">
                      <Form.Label>Harga</Form.Label>
                      <Form.Control
                      type="text"
                      name="harga"
                      value={harga}
                      placeholder="Enter Harga"
                      onChange={(e) => setHarga(e.target.value)}
                      />
                  </Form.Group>

                  <Form.Group controlId="formGambar">
                      <Form.Label>Gambar</Form.Label>
                      <Form.Control
                        type="file"
                        name="gambar"
                        onChange={handleChange}
                      />
                      {file && file.name && <p>Selected File: {file.name}</p>}
                  </Form.Group>
              </Form>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleCreateModalClose}>
                  Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateMenu}>
                  Save
              </Button>
          </Modal.Footer>
      </Modal>

      {/* Modal Update */}
      <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNamaMenu">
              <Form.Label>Nama Menu</Form.Label>
              <Form.Control
                type="text"
                name="nama_menu"
                value={nama_menu}
                placeholder="Enter Nama Menu"
                onChange={(e) => setNamaMenu(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formHarga">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="text"
                name="harga"
                value={harga}
                placeholder="Enter Harga"
                onChange={(e) => setHarga(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUpdateModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateMenu}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingMenu && (
            <p>
              Hapus menu "{deletingMenu.nama_menu}"?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>


    </Container>
  );
};

export default HomePage;

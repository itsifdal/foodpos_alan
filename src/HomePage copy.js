import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';


const HomePage = () => {

  const [menus, setMenus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMenu, setNewMenu] = useState({ nama_menu: '', harga: '', gambar: '' });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editMenu, setEditMenu] = useState({ id: '', nama_menu: '', harga: '' });

  useEffect(() => {
    // Fetch menu data from the API using Axios
    axios.get('http://localhost:8000/api/menu') // Replace 'your-express-api-url' with the actual URL of your Express API
      .then((response) => setMenus(response.data))
      .catch((error) => console.error('Error fetching menu data:', error));
  }, []);

  // Handle Delete Menu
  const handleDelete = (menu) => {
    setSelectedMenu(menu);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    // Call the API endpoint to delete the selected menu
    axios.delete(`http://localhost:8000/api/menu/${selectedMenu.id}`)
      .then(() => {
        // Update the list of menus after successful deletion
        setMenus(menus.filter(menu => menu.id !== selectedMenu.id));
      })
      .catch((error) => console.error('Error deleting menu:', error))
      .finally(() => {
        setShowModal(false);
        setSelectedMenu(null);
      });
  };


  // Handle Create New Menu
  const handleCreateModalShow = () => {
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
    setNewMenu({ nama_menu: '', harga: '', gambar: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value,
    }));
  };
  
  const handleCreateMenu = () => {
    
    // Call the API endpoint to create a new menu
    axios.post('http://localhost:8000/api/menu', menus, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(() => {
        // After successful creation, refetch menu data to get the latest data from the server
        axios.get('http://localhost:8000/api/menu')
          .then((response) => {
            setMenus(response.data);
            setShowCreateModal(false);
            setNewMenu({ nama_menu: '', harga: '', gambar: '' });
          })
          .catch((error) => console.error('Error fetching menu data:', error));
      })
      .catch((error) => console.error('Error creating menu:', error));
  };

  // Handle Edit Menu
  const handleEdit = (menu) => {
    setEditMenu(menu);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditMenu({ id: '', nama_menu: '', harga: '' });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value,
    }));
  };

  const handleUpdateMenu = () => {
    // Call the API endpoint to update the menu
    axios.put(`http://localhost:8000/api/menu/${editMenu.id}`, editMenu)
      .then(() => {
        // Update the list of menus after successful update
        setMenus((prevMenus) =>
          prevMenus.map((menu) => (menu.id === editMenu.id ? editMenu : menu))
        );
        setShowEditModal(false);
        setEditMenu({ id: '', nama_menu: '', harga: '' });
      })
      .catch((error) => console.error('Error updating menu:', error));
  };
  

  return (
    <Container className="mt-4">
      <h4>List Menu</h4><hr></hr>
      <Link to="/order-page"> {/* Use the Link component to navigate to the "Order Page" */}
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
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu, index) => (
            <tr key={index}>
                <td>{index + 1}</td>
              <td>{menu.nama_menu}</td>
              <td>{menu.harga}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(menu)}
                >
                  Hapus
                </Button>{" "}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(menu)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    
    {/* Modal Delete */}
    <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are you sure you want to delete {selectedMenu?.nama_menu}?
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
                Delete
            </Button>
        </Modal.Footer>
    </Modal>

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
                    value={newMenu.nama_menu}
                    onChange={handleInputChange}
                    placeholder="Enter Nama Menu"
                    />
                </Form.Group>

                <Form.Group controlId="formHarga">
                    <Form.Label>Harga</Form.Label>
                    <Form.Control
                    type="text"
                    name="harga"
                    value={newMenu.harga}
                    onChange={handleInputChange}
                    placeholder="Enter Harga"
                    />
                </Form.Group>

                <Form.Group controlId="formGambar">
                    <Form.Label>Gambar</Form.Label>
                    <Form.Control
                    type="file"
                    name="gambar"
                    value={newMenu.gambar}
                    onChange={handleInputChange}
                    />
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

    {/* Modal for editing menu */}
    <Modal show={showEditModal} onHide={handleEditModalClose}>
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
                value={editMenu.nama_menu}
                onChange={handleEditInputChange}
                placeholder="Enter Nama Menu"
              />
            </Form.Group>

            <Form.Group controlId="formHarga">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="text"
                name="harga"
                value={editMenu.harga}
                onChange={handleEditInputChange}
                placeholder="Enter Harga"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateMenu}>
            Save
          </Button>
        </Modal.Footer>
    </Modal>

    </Container>
  );
};

export default HomePage;

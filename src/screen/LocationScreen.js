// LocationScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles.css';

const LocationScreen = () => {
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({});
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/locations')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении сущностей Location:', error);
      });
  }, []);

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedLocation(null);
  };

  const handleCreate = () => {
    axios.post('http://localhost:8080/locations', newLocation)
      .then(response => {
        setLocations([...locations, response.data]);
        setNewLocation({});
        closeModal();
      })
      .catch(error => {
        console.error('Ошибка при создании сущности Location:', error);
      });
  };

  const handleUpdate = () => {
    if (!selectedLocation) return;

    axios.put(`http://localhost:8080/locations/${selectedLocation.id}`, selectedLocation)
      .then(response => {
        setLocations(locations.map(location => (location.id === response.data.id ? response.data : location)));
        closeModal();
      })
      .catch(error => {
        console.error('Ошибка при обновлении сущности Location:', error);
      });
  };

  const handleDelete = () => {
    if (!selectedLocation) return;

    axios.delete(`http://localhost:8080/locations/${selectedLocation.id}`)
      .then(() => {
        setLocations(locations.filter(location => location.id !== selectedLocation.id));
        closeModal();
      })
      .catch(error => {
        console.error('Ошибка при удалении сущности Location:', error);
      });
  };

  const toggleSelection = (location) => {
    setSelectedLocation(prevSelected => (prevSelected === location ? null : location));
  };

  return (
    <div>
      <h2>Location Entity</h2>

      <div className="actions">
        <button onClick={() => { setNewLocation({}); openModal(); }}>Create</button>
        <button onClick={() => { openModal(); }} disabled={!selectedLocation}>Edit</button>
        <button onClick={handleDelete} disabled={!selectedLocation} className="deleteButton">Delete</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Icon Path</th>
            <th>URL</th>
            <th>Title</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(location => (
            <tr key={location.id} className={selectedLocation === location ? 'selected' : ''} onClick={() => toggleSelection(location)}>
              <td>{location.id}</td>
              <td>{location.iconPath}</td>
              <td>{location.url}</td>
              <td>{location.title}</td>
              <td>{location.section}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Location Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
        >
            <h3>{selectedLocation ? 'Edit Entity' : 'Create New Entity'}</h3>
            <form>
                <label className="form-label">
                Icon Path:
                <input
                    type="text"
                    className="form-input"
                    value={(selectedLocation && selectedLocation.iconPath) || newLocation.iconPath || ''}
                    onChange={(e) => (selectedLocation ? setSelectedLocation({ ...selectedLocation, iconPath: e.target.value }) : setNewLocation({ ...newLocation, iconPath: e.target.value }))}
                />
                </label>
                <label className="form-label">
                URL:
                <input
                    type="text"
                    className="form-input"
                    value={(selectedLocation && selectedLocation.url) || newLocation.url || ''}
                    onChange={(e) => (selectedLocation ? setSelectedLocation({ ...selectedLocation, url: e.target.value }) : setNewLocation({ ...newLocation, url: e.target.value }))}
                />
                </label>
                <label className="form-label">
                Title:
                <input
                    type="text"
                    className="form-input"
                    value={(selectedLocation && selectedLocation.title) || newLocation.title || ''}
                    onChange={(e) => (selectedLocation ? setSelectedLocation({ ...selectedLocation, title: e.target.value }) : setNewLocation({ ...newLocation, title: e.target.value }))}
                />
                </label>
                <label className="form-label">
                Section:
                <input
                    type="text"
                    className="form-input"
                    value={(selectedLocation && selectedLocation.section) || newLocation.section || ''}
                    onChange={(e) => (selectedLocation ? setSelectedLocation({ ...selectedLocation, section: e.target.value }) : setNewLocation({ ...newLocation, section: e.target.value }))}
                />
                </label>
                <div className="modal-buttons">
                <button type="button" onClick={selectedLocation ? handleUpdate : handleCreate} disabled={!selectedLocation && !newLocation}>
                    {selectedLocation ? 'Edit' : 'Create'}
                </button>
                <button type="button" onClick={closeModal}>Close</button>
                </div>
            </form>
        </Modal>
    </div>
  );
};

export default LocationScreen;

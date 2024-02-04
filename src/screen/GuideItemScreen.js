// GuideItemScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles.css';

const GuideItemScreen = () => {
  const [guideItems, setGuideItems] = useState([]);
  const [newGuideItem, setNewGuideItem] = useState({});
  const [selectedGuideItem, setSelectedGuideItem] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/guideitems')
      .then(response => {
        setGuideItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching GuideItems entities:', error);
      });
  }, []);

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedGuideItem(null);
  };

  const handleCreate = () => {
    axios.post('http://localhost:8080/guideitems', newGuideItem)
      .then(response => {
        setGuideItems([...guideItems, response.data]);
        setNewGuideItem({});
        closeModal();
      })
      .catch(error => {
        console.error('Error creating GuideItem entity:', error);
      });
  };

  const handleUpdate = () => {
    if (!selectedGuideItem) return;

    axios.put(`http://localhost:8080/guideitems/${selectedGuideItem.id}`, selectedGuideItem)
      .then(response => {
        setGuideItems(guideItems.map(item => (item.id === response.data.id ? response.data : item)));
        closeModal();
      })
      .catch(error => {
        console.error('Error updating GuideItem entity:', error);
      });
  };

  const handleDelete = () => {
    if (!selectedGuideItem) return;

    axios.delete(`http://localhost:8080/guideitems/${selectedGuideItem.id}`)
      .then(() => {
        setGuideItems(guideItems.filter(item => item.id !== selectedGuideItem.id));
        closeModal();
      })
      .catch(error => {
        console.error('Error deleting GuideItem entity:', error);
      });
  };

  const toggleSelection = (item) => {
    setSelectedGuideItem(prevSelected => (prevSelected === item ? null : item));
  };

  return (
    <div>
      <h2>GuideItem Entity</h2>

      <div className="actions">
        <button onClick={() => { setNewGuideItem({}); openModal(); }}>Create</button>
        <button onClick={() => { openModal(); }} disabled={!selectedGuideItem}>Edit</button>
        <button onClick={handleDelete} disabled={!selectedGuideItem} className="deleteButton">Delete</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Smile</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {guideItems.map(item => (
            <tr key={item.id} className={selectedGuideItem === item ? 'selected' : ''} onClick={() => toggleSelection(item)}>
              <td>{item.id}</td>
              <td>{item.smile}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="GuideItem Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h3>{selectedGuideItem ? 'Edit Entity' : 'Create New Entity'}</h3>
        <form>
          <label className="form-label">
            Smile:
            <input
              type="text"
              className="form-input"
              value={(selectedGuideItem && selectedGuideItem.smile) || newGuideItem.smile || ''}
              onChange={(e) => (selectedGuideItem ? setSelectedGuideItem({ ...selectedGuideItem, smile: e.target.value }) : setNewGuideItem({ ...newGuideItem, smile: e.target.value }))}
            />
          </label>
          <label className="form-label">
            Title:
            <input
              type="text"
              className="form-input"
              value={(selectedGuideItem && selectedGuideItem.title) || newGuideItem.title || ''}
              onChange={(e) => (selectedGuideItem ? setSelectedGuideItem({ ...selectedGuideItem, title: e.target.value }) : setNewGuideItem({ ...newGuideItem, title: e.target.value }))}
            />
          </label>
          <label className="form-label">
            Description:
            <input
              type="text"
              className="form-input"
              value={(selectedGuideItem && selectedGuideItem.description) || newGuideItem.description || ''}
              onChange={(e) => (selectedGuideItem ? setSelectedGuideItem({ ...selectedGuideItem, description: e.target.value }) : setNewGuideItem({ ...newGuideItem, description: e.target.value }))}
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={selectedGuideItem ? handleUpdate : handleCreate} disabled={!selectedGuideItem && !newGuideItem}>
              {selectedGuideItem ? 'Edit' : 'Create'}
            </button>
            <button type="button" onClick={closeModal}>Close</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GuideItemScreen;

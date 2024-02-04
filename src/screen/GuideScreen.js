// GuideScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Select from 'react-select'; // Import react-select
import '../styles.css';

const GuideScreen = () => {
  const [guides, setGuides] = useState([]);
  const [guideItems, setGuideItems] = useState([]);
  const [newGuide, setNewGuide] = useState({});
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedGuideItems, setSelectedGuideItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/guides')
      .then(response => {
        setGuides(response.data);
      })
      .catch(error => {
        console.error('Error fetching Guide entities:', error);
      });

    axios.get('http://localhost:8080/guideitems')
      .then(response => {
        setGuideItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching GuideItems entities:', error);
      });
  }, []);

  useEffect(() => {
    // Set initial selectedGuideItems when selectedGuide changes
    if (selectedGuide) {
      setSelectedGuideItems(selectedGuide.items || []);
    }
  }, [selectedGuide]);

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedGuide(null);
    setSelectedGuideItems([]);
  };

  const handleCreate = () => {
    axios.post('http://localhost:8080/guides', {
      ...newGuide,
      items: selectedGuideItems.map(item => ({ id: item.id, title: item.title })),
    })
    .then(response => {
      setGuides([...guides, response.data]);
      setNewGuide({});
      closeModal();
    })
    .catch(error => {
      console.error('Error creating Guide entity:', error);
    });
  };

  const handleUpdate = () => {
    if (!selectedGuide) return;

    axios.put(`http://localhost:8080/guides/${selectedGuide.id}`, {
      ...selectedGuide,
      items: selectedGuideItems.map(item => ({ id: item.id, title: item.title })),
    })
    .then(response => {
      setGuides(guides.map(guide => (guide.id === response.data.id ? response.data : guide)));
      closeModal();
    })
    .catch(error => {
      console.error('Error updating Guide entity:', error);
    });
  };

  const handleDelete = () => {
    if (!selectedGuide) return;

    axios.delete(`http://localhost:8080/guides/${selectedGuide.id}`)
      .then(() => {
        setGuides(guides.filter(guide => guide.id !== selectedGuide.id));
        closeModal();
      })
      .catch(error => {
        console.error('Error deleting Guide entity:', error);
      });
  };

  const toggleSelection = (guide) => {
    setSelectedGuide(prevSelected => (prevSelected === guide ? null : guide));
    setSelectedGuideItems(guide.items || []);
  };

  return (
    <div>
      <h2>Guide Entity</h2>

      <div className="actions">
        <button onClick={() => { setNewGuide({}); openModal(); }}>Create</button>
        <button onClick={() => { openModal(); }} disabled={!selectedGuide}>Edit</button>
        <button onClick={handleDelete} disabled={!selectedGuide} className="deleteButton">Delete</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Group</th>
            <th>Icon</th>
          </tr>
        </thead>
        <tbody>
          {guides.map(guide => (
            <tr key={guide.id} className={selectedGuide === guide ? 'selected' : ''} onClick={() => toggleSelection(guide)}>
              <td>{guide.id}</td>
              <td>{guide.group}</td>
              <td>{guide.icon}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Guide Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h3>{selectedGuide ? 'Edit Entity' : 'Create New Entity'}</h3>
        <form>
          <label className="form-label">
            Group:
            <input
              type="text"
              className="form-input"
              value={(selectedGuide && selectedGuide.group) || newGuide.group || ''}
              onChange={(e) => (selectedGuide ? setSelectedGuide({ ...selectedGuide, group: e.target.value }) : setNewGuide({ ...newGuide, group: e.target.value }))}
            />
          </label>
          <label className="form-label">
            Icon:
            <input
              type="text"
              className="form-input"
              value={(selectedGuide && selectedGuide.icon) || newGuide.icon || ''}
              onChange={(e) => (selectedGuide ? setSelectedGuide({ ...selectedGuide, icon: e.target.value }) : setNewGuide({ ...newGuide, icon: e.target.value }))}
            />
          </label>
          <label className="form-label">
            Guide Items:
            <Select
                isMulti
                options={guideItems.map(item => ({ value: item.id, label: item.title }))}
                value={selectedGuideItems.map(item => ({ value: item.id, label: item.title }))}
                onChange={(selectedOptions) => {
                    setSelectedGuideItems(selectedOptions.map(option => ({ id: option.value, title: option.label })));
                }}
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={selectedGuide ? handleUpdate : handleCreate} disabled={!selectedGuide && !newGuide}>
              {selectedGuide ? 'Edit' : 'Create'}
            </button>
            <button type="button" onClick={closeModal}>Close</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GuideScreen;

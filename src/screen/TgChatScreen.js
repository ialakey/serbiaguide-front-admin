// TgChatScreeen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles.css';

const TgChatScreeen = () => {
  const [tgchats, setTgChats] = useState([]);
  const [newTgChat, setNewTgChat] = useState({});
  const [selectedTgChat, setSelectedTgChat] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/tgchats')
      .then(response => {
        setTgChats(response.data);
      })
      .catch(error => {
        console.error('Error fetching TgChats entities:', error);
      });
  }, []);

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedTgChat(null);
  };

  const handleCreate = () => {
    axios.post('http://localhost:8080/tgchats', newTgChat)
      .then(response => {
        setTgChats([...tgchats, response.data]);
        setNewTgChat({});
        closeModal();
      })
      .catch(error => {
        console.error('Error creating TgChat entity:', error);
      });
  };

  const handleUpdate = () => {
    if (!selectedTgChat) return;

    axios.put(`http://localhost:8080/tgchats/${selectedTgChat.id}`, selectedTgChat)
      .then(response => {
        setTgChats(tgchats.map(tgchat => (tgchat.id === response.data.id ? response.data : tgchat)));
        closeModal();
      })
      .catch(error => {
        console.error('Error updating TgChat entity:', error);
      });
  };

  const handleDelete = () => {
    if (!selectedTgChat) return;

    axios.delete(`http://localhost:8080/tgchats/${selectedTgChat.id}`)
      .then(() => {
        setTgChats(tgchats.filter(tgchat => tgchat.id !== selectedTgChat.id));
        closeModal();
      })
      .catch(error => {
        console.error('Error deleting TgChat entity:', error);
      });
  };

  const toggleSelection = (tgchat) => {
    setSelectedTgChat(prevSelected => (prevSelected === tgchat ? null : tgchat));
  };

  return (
    <div>
      <h2>TgChat Entity</h2>

      <div className="actions">
        <button onClick={() => { setNewTgChat({}); openModal(); }}>Create</button>
        <button onClick={() => { openModal(); }} disabled={!selectedTgChat}>Edit</button>
        <button onClick={handleDelete} disabled={!selectedTgChat} className="deleteButton">Delete</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>URL</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          {tgchats.map(tgchat => (
            <tr key={tgchat.id} className={selectedTgChat === tgchat ? 'selected' : ''} onClick={() => toggleSelection(tgchat)}>
              <td>{tgchat.id}</td>
              <td>{tgchat.name}</td>
              <td>{tgchat.url}</td>
              <td>{tgchat.group}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="TgChat Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h3>{selectedTgChat ? 'Edit Entity' : 'Create New Entity'}</h3>
        <form>
          <label className="form-label">
            Name:
            <input
              type="text"
              className="form-input"
              value={(selectedTgChat && selectedTgChat.name) || newTgChat.name || ''}
              onChange={(e) => (selectedTgChat ? setSelectedTgChat({ ...selectedTgChat, name: e.target.value }) : setNewTgChat({ ...newTgChat, name: e.target.value }))}
            />
          </label>
          <label className="form-label">
            URL:
            <input
              type="text"
              className="form-input"
              value={(selectedTgChat && selectedTgChat.url) || newTgChat.url || ''}
              onChange={(e) => (selectedTgChat ? setSelectedTgChat({ ...selectedTgChat, url: e.target.value }) : setNewTgChat({ ...newTgChat, url: e.target.value }))}
            />
          </label>
          <label className="form-label">
            Group:
            <input
              type="text"
              className="form-input"
              value={(selectedTgChat && selectedTgChat.group) || newTgChat.group || ''}
              onChange={(e) => (selectedTgChat ? setSelectedTgChat({ ...selectedTgChat, group: e.target.value }) : setNewTgChat({ ...newTgChat, group: e.target.value }))}
            />
          </label>
          <div className="modal-buttons">
            <button type="button" onClick={selectedTgChat ? handleUpdate : handleCreate} disabled={!selectedTgChat && !newTgChat}>
              {selectedTgChat ? 'Edit' : 'Create'}
            </button>
            <button type="button" onClick={closeModal}>Close</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TgChatScreeen;

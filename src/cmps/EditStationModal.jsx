import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { uploadService } from '../services/upload.service'

export function EditStationModal({ station, isOpen, onClose, onSave, fileInputRef }) {
  const [editedStation, setEditedStation] = useState({
    name: '',
    description: '',
    imgUrl: '',
  })
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (isOpen && station) {
      setEditedStation({
        name: station.name,
        description: station.description,
        imgUrl: station.imgUrl,
      })
    } else {
      setEditedStation({
        name: '',
        description: '',
        imgUrl: '',
      })
    }
  }, [station, isOpen])

  async function handleImageUpload(event) {
    try {
      setIsUploading(true)
      const imgUrl = await uploadService.uploadImg(event)

      if (imgUrl) {
        setEditedStation((prev) => ({
          ...prev,
          imgUrl,
        }))
      }
    } catch (err) {
      console.error('Failed to upload image:', err)
    } finally {
      setIsUploading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(editedStation)
    onClose()
  }

  function handleClose() {
    setEditedStation({
      name: '',
      description: '',
      imgUrl: '',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='modal-overlay'>
      <div className='edit-modal'>
        <header className='edit-modal__header'>
          <h2>Edit details</h2>
          <button className='edit-modal__close' onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className='edit-modal__content'>
          <form onSubmit={handleSubmit}>
            <div className='edit-modal__layout'>
              <div className='edit-modal__image-section'>
                <div className='edit-modal__image-container'>
                  <img src={editedStation.imgUrl} alt='Playlist cover' />
                  <div className='edit-modal__image-overlay'>
                    <label htmlFor='imageInput' className='edit-modal__image-label'>
                      <span>Choose photo</span>
                    </label>
                    <input
                      ref={fileInputRef}
                      id='imageInput'
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='edit-modal__image-input'
                    />
                  </div>
                </div>
              </div>

              <div className='edit-modal__fields'>
                <input
                  type='text'
                  value={editedStation.name}
                  onChange={(e) => setEditedStation((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder='Add a name'
                  className='edit-modal__input'
                />
                <textarea
                  value={editedStation.description}
                  onChange={(e) => setEditedStation((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder='Add an optional description'
                  className='edit-modal__textarea'
                />
              </div>
            </div>
            <footer className='edit-modal__footer'>
              <button type='submit' className='edit-modal__save'>
                Save
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { uploadService } from '../services/upload.service'
import { TextField } from '@mui/material'

export function EditStationModal({ station , onSave, onClose, fileInputRef, onOverlayClick }) {

  const [stationToEdit, setStationToEdit] = useState({ name: station.name ,description: station.description, imgUrl: station.imgUrl,})
  const [isUploading, setIsUploading] = useState(false)

  async function handleImageUpload(event) {
    try {
      setIsUploading(true)
      const imgUrl = await uploadService.uploadImg(event)

      if (imgUrl) {
        setStationToEdit((prev) => ({...prev, imgUrl,}))
        onSave({...station, imgUrl})
      }
    } catch (err) {
      console.error('Failed to upload image:', err)
    } finally {
      setIsUploading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(stationToEdit)
    onClose()
  }

  return (
    <div className='modal-overlay' onClick={onOverlayClick}>
      <div
        className='edit-modal'
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
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
                  <img src={stationToEdit.imgUrl} alt='Playlist cover' />
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
                <TextField
                  className='edit-modal__input'
                  value={stationToEdit.name}
                  onChange={(e) =>
                    setStationToEdit((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  label='Name'
                  variant='outlined'
                  fullWidth
                />
                <TextField
                  className='edit-modal__textarea'
                  value={stationToEdit.description}
                  onChange={(e) =>
                    setStationToEdit((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  label='Add an optional description'
                  variant='outlined'
                  multiline
                  rows={4}
                  fullWidth
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

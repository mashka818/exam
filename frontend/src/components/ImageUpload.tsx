import { useState, useRef } from 'react'
import { FaCloudUploadAlt, FaImage } from 'react-icons/fa'
import './ImageUpload.css'

interface ImageUploadProps {
  onFileSelect: (file: File) => void
  currentImage?: string
}

export default function ImageUpload({ onFileSelect, currentImage }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение')
      return
    }

    onFileSelect(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="image-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        {preview ? (
          <div className="preview">
            <img src={preview} alt="Preview" />
            <div className="preview-overlay">
              <FaCloudUploadAlt />
              <p>Нажмите или перетащите для замены</p>
            </div>
          </div>
        ) : (
          <div className="upload-prompt">
            <FaImage className="upload-icon" />
            <p>Нажмите или перетащите изображение</p>
            <small>PNG, JPG, GIF, WEBP до 5MB</small>
          </div>
        )}
      </div>
    </div>
  )
}



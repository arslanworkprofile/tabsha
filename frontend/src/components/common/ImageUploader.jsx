import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiStar, FiImage } from 'react-icons/fi';
import { uploadImage } from '../../utils/api';
import toast from 'react-hot-toast';

/**
 * Reusable image uploader for admin forms
 * Props:
 *   images: array of { url, publicId, alt, isPrimary }
 *   onChange: (newImages) => void
 *   maxImages: number (default 8)
 *   single: boolean (default false) - single image mode
 */
export default function ImageUploader({
  images = [],
  onChange,
  maxImages = 8,
  single = false,
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = files.slice(0, remaining);
    setUploading(true);

    try {
      const uploaded = await Promise.all(
        filesToUpload.map(async (file) => {
          const fd = new FormData();
          fd.append('image', file);
          const { data } = await uploadImage(fd);
          return {
            url: data.url,
            publicId: data.publicId || '',
            alt: '',
            isPrimary: images.length === 0,
          };
        })
      );

      const newImages = [...images, ...uploaded].map((img, i) => ({
        ...img,
        isPrimary: i === 0,
      }));

      onChange(newImages);
      toast.success(`${filesToUpload.length} image${filesToUpload.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      toast.error('Upload failed. Please check your Cloudinary settings.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (idx) => {
    const newImages = images
      .filter((_, i) => i !== idx)
      .map((img, i) => ({ ...img, isPrimary: i === 0 }));
    onChange(newImages);
  };

  const setPrimary = (idx) => {
    const newImages = images.map((img, i) => ({ ...img, isPrimary: i === idx }));
    onChange(newImages);
  };

  if (single) {
    // Single image mode (for categories)
    const img = images[0];
    return (
      <div>
        {img && (
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <img
              src={img.url}
              alt=""
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <button
              type="button"
              onClick={() => onChange([])}
              style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '28px', height: '28px',
                background: 'var(--error)',
                border: 'none', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}
            >
              <FiX size={14} />
            </button>
          </div>
        )}
        <label style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px',
          border: '1.5px dashed var(--gray-300)',
          borderRadius: '6px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          color: 'var(--gray-500)',
          transition: 'var(--transition)',
        }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          {uploading
            ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Uploading...</>
            : <><FiUpload size={15} /> {img ? 'Replace Image' : 'Upload Image'}</>
          }
        </label>
      </div>
    );
  }

  // Multi-image mode
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: '12px',
        marginBottom: '12px',
      }}>
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              border: `2px solid ${img.isPrimary ? 'var(--gold)' : 'var(--gray-200)'}`,
              aspectRatio: '3/4',
              transition: 'var(--transition)',
            }}
          >
            <img
              src={img.url}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <div style={{
              position: 'absolute', top: '6px', right: '6px',
              display: 'flex', flexDirection: 'column', gap: '4px',
            }}>
              <button
                type="button"
                onClick={() => setPrimary(i)}
                title="Set as primary"
                style={{
                  width: '22px', height: '22px',
                  background: img.isPrimary ? 'var(--gold)' : 'rgba(255,255,255,0.9)',
                  border: 'none', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <FiStar size={10} color={img.isPrimary ? '#000' : '#999'} fill={img.isPrimary ? '#000' : 'none'} />
              </button>
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{
                  width: '22px', height: '22px',
                  background: 'var(--error)',
                  border: 'none', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <FiX size={10} color="#fff" />
              </button>
            </div>

            {img.isPrimary && (
              <span style={{
                position: 'absolute', bottom: '6px', left: '6px',
                background: 'var(--gold)', color: '#000',
                fontSize: '8px', fontWeight: 700,
                padding: '2px 6px', borderRadius: '2px',
                letterSpacing: '0.06em',
              }}>
                PRIMARY
              </span>
            )}
          </div>
        ))}

        {/* Upload slot */}
        {images.length < maxImages && (
          <label style={{
            border: '2px dashed var(--gray-300)',
            borderRadius: '6px',
            aspectRatio: '3/4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'var(--transition)',
            color: 'var(--gray-400)',
          }}>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading
              ? <span className="spinner" style={{ width: 20, height: 20 }} />
              : <>
                  <FiImage size={20} />
                  <span style={{ fontSize: '11px', textAlign: 'center', lineHeight: 1.4 }}>
                    Upload<br />Image
                  </span>
                </>
            }
          </label>
        )}
      </div>

      <p style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
        ⭐ Click star to set primary · Max {maxImages} images · JPG, PNG · Recommended 800×1000px
      </p>
    </div>
  );
}

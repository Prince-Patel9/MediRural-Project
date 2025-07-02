import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Input,
  InputLabel,
  FormControl
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function UpdateMedicine() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    manufacturer: '',
    expiryDate: '',
    prescriptionRequired: false,
    isActive: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await axios.get(`https://medirural.onrender.com/api/medicines/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const med = response.data.medicine;
          setFormData({
            name: med.name,
            description: med.description,
            price: med.price,
            stock: med.stock,
            category: med.category,
            manufacturer: med.manufacturer,
            expiryDate: med.expiryDate.slice(0, 10), 
            prescriptionRequired: med.prescriptionRequired || false,
            isActive: med.isActive ?? true
          });
          setCurrentImageUrl(med.imageUrl);
          setPreviewUrl(med.imageUrl);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to load medicine details');
      }
    };

    fetchMedicine();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      let response;
      
      if (selectedFile) {
        // If new file is selected, upload with file
        const formDataToSend = new FormData();
        formDataToSend.append('image', selectedFile);
        formDataToSend.append('medicine', JSON.stringify(updated));

        response = await axios.put(
          `https://medirural.onrender.com/api/medicines/${id}`,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // If no new file, just update the data
        response = await axios.put(
          `https://medirural.onrender.com/api/medicines/${id}`,
          { medicine: updated },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }

      if (response.data.success) {
        alert('Medicine updated successfully!');
        navigate('/admin/medicines'); // change as per your admin routes
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Medicine
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required fullWidth label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required fullWidth multiline rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required fullWidth label="Price"
              name="price" type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required fullWidth label="Stock"
              name="stock" type="number"
              value={formData.stock}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required fullWidth label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required fullWidth label="Manufacturer"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required fullWidth label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="image-upload">Medicine Image (Optional - leave empty to keep current image)</InputLabel>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </FormControl>
          </Grid>
          {previewUrl && (
            <Grid item xs={12}>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="subtitle2" gutterBottom>
                  {selectedFile ? 'New Image Preview:' : 'Current Image:'}
                </Typography>
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
          )}
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Saving...' : 'Update Medicine'}
        </Button>
      </Box>
    </Container>
  );
}

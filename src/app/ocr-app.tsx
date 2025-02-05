import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert, CircularProgress, Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import { createWorker } from 'tesseract.js';

const OCRFormReader = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });

  const extractFields = (text) => {
    const fields = {
      name: text.match(/name[:\s]+([^\n]+)/i)?.[1]?.trim() || '',
      email: text.match(/email[:\s]+([^\n]+)/i)?.[1]?.trim() || '',
      phone: text.match(/phone[:\s]+([^\n]+)/i)?.[1]?.trim() || '',
      address: text.match(/address[:\s]+([^\n]+)/i)?.[1]?.trim() || '',
      dateOfBirth: text.match(/date of birth[:\s]+([^\n]+)/i)?.[1]?.trim() || ''
    };

    // Clean extracted data
    if (fields.email) {
      fields.email = fields.email.toLowerCase().replace(/\s/g, '');
    }
    if (fields.phone) {
      fields.phone = fields.phone.replace(/[^\d-]/g, '');
    }
    if (fields.dateOfBirth) {
      const date = new Date(fields.dateOfBirth);
      if (!isNaN(date.getTime())) {
        fields.dateOfBirth = date.toISOString().split('T')[0];
      }
    }

    return fields;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        performOCR(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const performOCR = async (imageData) => {
    setIsProcessing(true);
    setError('');
    const worker = await createWorker();

    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(imageData);
      console.log('Extracted text:', text); // For debugging
      
      const extractedData = extractFields(text);
      setFormData(extractedData);
    } catch (err) {
      setError('Error processing form: ' + err.message);
      console.error('OCR Error:', err);
    } finally {
      await worker.terminate();
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          OCR Form Reader
        </Typography>

        <Stack spacing={3}>
          <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                Upload Form
              </Button>
            </label>
          </Box>

          {imageUrl && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Form Preview
              </Typography>
              <img
                src={imageUrl}
                alt="Form Preview"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
              />
            </Box>
          )}

          {isProcessing && (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography sx={{ mt: 1 }}>
                Processing form...
              </Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
              />

              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
              />

              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />

              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isProcessing}
                startIcon={<SaveIcon />}
                fullWidth
              >
                Save Form Data
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default OCRFormReader;
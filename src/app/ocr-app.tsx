import React, { useState } from 'react';
import { Upload, Camera, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    try {
      // Simulated OCR processing with field detection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, use Tesseract.js:
      // const worker = await createWorker();
      // await worker.loadLanguage('eng');
      // await worker.initialize('eng');
      // const { data: { text } } = await worker.recognize(imageData);
      
      // Example form field detection logic
      const extractedData = {
        name: 'John Doe', // In real app, use regex or ML to detect fields
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St',
        dateOfBirth: '1990-01-01'
      };
      
      setFormData(extractedData);
    } catch (err) {
      setError('Error processing form. Please try again.');
      console.error('OCR Error:', err);
    } finally {
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
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-6 h-6" />
            OCR Form Reader
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <span className="mt-2 text-sm text-gray-600">
                  Upload scanned form
                </span>
              </label>
            </div>

            {/* Preview */}
            {imageUrl && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Form Preview</h3>
                <img
                  src={imageUrl}
                  alt="Form Preview"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-pulse">Processing form...</div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Editable Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2"
                disabled={isProcessing}
              >
                <Save className="w-4 h-4" />
                Save Form Data
              </button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OCRFormReader;
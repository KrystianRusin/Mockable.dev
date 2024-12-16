import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid
} from '@mui/material';
import { Add } from '@mui/icons-material';
import EndpointItem from '../components/EndpointItem.tsx';
import useApi from '../hooks/useApi.ts';
import { Endpoint } from '../types/Endpoint.ts';

//TODO: Fix why JSON schema is not being correctly saved in database
//TODO: add dynamically generated endpoints upon endpoint creation

const Endpoints: React.FC = () => {
  const { get, post, deleteApi } = useApi();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [open, setOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    method: 'GET',
    url: '',
    description: '',
    requestSchema: '', 
    responseSchema: '', 
    userSlug: localStorage.getItem('userSlug') || '',
    statusCode: '200',
  })
  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      const data = await get('/api/endpoints/all');
      setEndpoints(data.endpoints);
    } catch (err) {
      console.error('Failed to fetch endpoints:', err);
    }
  };

  const handleOpen = () => {
    setEditingEndpoint(null);
    setFormData({
      name: '',
      method: 'GET',
      url: '',
      description: '',
      responseSchema: '',
      requestSchema: '',
      userSlug: localStorage.getItem('userSlug') || '',
      statusCode: '200',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (endpoint: Endpoint) => {
    setEditingEndpoint(endpoint);
    setFormData({
      name: endpoint.name,
      method: endpoint.method,
      url: endpoint.url,
      description: endpoint.description || '',
      responseSchema: endpoint.responseSchema || '',
      requestSchema: endpoint.requestSchema || '',
      userSlug: localStorage.getItem('userSlug') ||'',
      statusCode: endpoint.statusCode.toString(),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      try {
        await deleteApi(`/api/endpoints/delete/${id}`);
        setEndpoints(endpoints.filter((ep) => ep._id !== id));
      } catch (err) {
        console.error('Failed to delete endpoint:', err);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log('Form Data:', formData);
    const userSlug = localStorage.getItem('userSlug');
    if (!userSlug) {
        console.error('User slug not found in local storage');
        return;
    }
    try {
        if (editingEndpoint) {
            // Update existing endpoint
            const updatedEndpoint = await post(
                `/api/endpoints/edit/${editingEndpoint._id}`,
                formData
            );
            setEndpoints(
                endpoints.map((ep) =>
                    ep._id === editingEndpoint._id ? updatedEndpoint : ep
                )
            );
        } else {
            const newEndpoint = await post('/api/endpoints/create', formData);
            setEndpoints([...endpoints, newEndpoint]);
        }
        setOpen(false);
    } catch (err: any) {
        console.error('Failed to save endpoint:', err);
        if (err.response && err.response.data && err.response.data.message) {
            alert(err.response.data.message);
        } else {
            alert('An unexpected error occurred.');
        }
    }
    fetchEndpoints();
};

return (
  <Box sx={{ padding: 4 }}>
    <Typography variant="h4" gutterBottom>
      Your Mock API Endpoints
    </Typography>
    <Button variant="contained" startIcon={<Add />} onClick={handleOpen} sx={{ mb: 3 }}>
      Add Endpoint
    </Button>
    <Box>
      {endpoints.map((endpoint) => (
        <EndpointItem
          key={endpoint._id}
          endpoint={endpoint}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </Box>

    {/* Add/Edit Endpoint Dialog */}
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{editingEndpoint ? 'Edit Endpoint' : 'Add New Endpoint'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Endpoint Name */}
          <Grid item xs={12}>
            <TextField
              label="Endpoint Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Method */}
          <Grid item xs={6}>
            <TextField
              select
              label="Method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              SelectProps={{
                native: true,
              }}
              fullWidth
              required
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </TextField>
          </Grid>

          {/* URL */}
          <Grid item xs={6}>
            <TextField
              label="URL"
              name="url"
              value={formData.url}
              onChange={handleChange}
              fullWidth
              required
              placeholder="/api/users"
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>

          {/* Status Code */}
          <Grid item xs={12}>
            <TextField
              select
              label="Status Code"
              name="statusCode"
              value={formData.statusCode}
              onChange={handleChange}
              SelectProps={{
                native: true,
              }}
              fullWidth
              required
              helperText="Select the HTTP status code this endpoint should return"
            >
              <option value={200}>200 - OK</option>
              <option value={201}>201 - Created</option>
              <option value={202}>202 - Accepted</option>
              <option value={204}>204 - No Content</option>
              <option value={400}>400 - Bad Request</option>
              <option value={401}>401 - Unauthorized</option>
              <option value={403}>403 - Forbidden</option>
              <option value={404}>404 - Not Found</option>
              <option value={409}>409 - Conflict</option>
              <option value={422}>422 - Unprocessable Entity</option>
              <option value={500}>500 - Internal Server Error</option>
            </TextField>
          </Grid>

          {/* Conditionally render Request JSON Schema */}
          {(formData.method === 'POST' || formData.method === 'PUT') && (
            <Grid item xs={12}>
              <TextField
                label="Request JSON Schema"
                name="requestSchema"
                value={formData.requestSchema}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder='{"type": "object", "properties": {...}}'
                helperText="Enter the JSON schema for the request body"
                required
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Response JSON Schema"
              name="responseSchema"
              value={formData.responseSchema}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder='{"type": "object", "properties": {...}}'
              helperText="Enter the JSON schema for the response body"
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingEndpoint ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
};

export default Endpoints;

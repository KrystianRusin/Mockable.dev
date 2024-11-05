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
import { jwtDecode } from 'jwt-decode';

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
    jsonSchema: '',
    userSlug: '',
  });

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
      jsonSchema: '',
      userSlug: localStorage.getItem('userSlug') || '',
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
      jsonSchema: endpoint.JSONSchema || '',
      userSlug: localStorage.getItem('userSlug') ||'',
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
                <option value="PATCH">PATCH</option>
              </TextField>
            </Grid>
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
            <Grid item xs={12}>
              <TextField
                label="JSON Schema"
                name="jsonSchema"
                value={formData.jsonSchema}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder='{"type": "object", "properties": {...}}'
                helperText="Enter the JSON schema for the mock API response"
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

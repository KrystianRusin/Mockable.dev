import React from 'react';
import { Card, CardContent, Typography, IconButton, CardActions } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Endpoint } from '../types/Endpoint.ts';

interface EndpointItemProps {
  endpoint: Endpoint;
  onEdit: (endpoint: Endpoint) => void;
  onDelete: (id: string) => void;
}

const EndpointItem: React.FC<EndpointItemProps> = ({ endpoint, onEdit, onDelete }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {endpoint.name}
        </Typography>
        <Typography color="text.secondary">
          {endpoint.method} {endpoint.url}
        </Typography>
        {endpoint.description && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {endpoint.description}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <IconButton color="primary" onClick={() => onEdit(endpoint)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => onDelete(endpoint._id)}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default EndpointItem;

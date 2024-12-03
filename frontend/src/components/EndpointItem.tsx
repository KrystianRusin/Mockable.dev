import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, CardActions, Collapse, Box } from '@mui/material';
import { Edit, Delete, ExpandMore } from '@mui/icons-material';
import { Endpoint } from '../types/Endpoint.ts';

interface EndpointItemProps {
  endpoint: Endpoint;
  onEdit: (endpoint: Endpoint) => void;
  onDelete: (id: string) => void;
}

const EndpointItem: React.FC<EndpointItemProps> = ({ endpoint, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, position: 'relative' }}>
      <CardContent onClick={handleExpandClick} sx={{ cursor: 'pointer' }}>
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
      <CardActions disableSpacing>
        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMore />
        </IconButton>
      </CardActions>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconButton color="primary" onClick={() => onEdit(endpoint)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => onDelete(endpoint._id)}>
          <Delete />
        </IconButton>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Display Request Schema if it exists */}
          {endpoint.requestSchema && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Request Schema:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {endpoint.requestSchema}
              </Typography>
            </>
          )}
          {/* Display Response Schema */}
          {endpoint.responseSchema && (
            <>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Response Schema:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {endpoint.responseSchema}
              </Typography>
            </>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default EndpointItem;

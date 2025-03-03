import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Box,
} from '@mui/material';
import { Edit, Delete, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { IconButtonProps } from '@mui/material';
import { Endpoint } from '../types/Endpoint.ts';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface EndpointItemProps {
  endpoint: Endpoint;
  onEdit: (endpoint: Endpoint) => void;
  onDelete: (id: string) => void;
}

const EndpointItem: React.FC<EndpointItemProps> = ({ endpoint, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        position: 'relative',
        borderRadius: 2,
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 6 },
        pb: 10, // extra padding at the bottom
      }}
    >
      <CardContent onClick={handleExpandClick} sx={{ cursor: 'pointer' }}>
        <Typography variant="h6" component="div">
          {endpoint.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {endpoint.method} {endpoint.url}
        </Typography>
        {endpoint.description && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {endpoint.description}
          </Typography>
        )}
      </CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <IconButton color="primary" onClick={() => onEdit(endpoint)}>
          <Edit />
        </IconButton>
        <IconButton color="error" onClick={() => onDelete(endpoint._id)}>
          <Delete />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {endpoint.requestSchema && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Request Schema:
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
              >
                {endpoint.requestSchema}
              </Typography>
            </>
          )}
          {endpoint.responseSchema && (
            <>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Response Schema:
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
              >
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
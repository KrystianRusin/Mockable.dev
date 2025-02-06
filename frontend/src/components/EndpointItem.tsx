import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  CardActions,
  Collapse,
  Box,
} from '@mui/material';
import { Edit, Delete, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { IconButtonProps } from '@mui/material';
import { Endpoint } from '../types/Endpoint.ts';

// Extend IconButtonProps to include the custom "expand" prop.
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

// Create a styled component for the expand button.
const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
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

      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      {/* Action Icons positioned in the top-right */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
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

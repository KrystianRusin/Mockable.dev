import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Grid } from '@mui/material';
import Ajv, { ErrorObject } from 'ajv';
import ajvModule from 'ajv';
import * as addFormats from 'ajv-formats';

const SchemaValidator: React.FC = () => {
  
    return (
        <Box>
            <Typography variant="h1">Schema Validator</Typography>
        </Box>
    );
    
    };
    
    export default SchemaValidator;
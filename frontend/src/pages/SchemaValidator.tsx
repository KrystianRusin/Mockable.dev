import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import Ajv, { ErrorObject } from 'ajv';
import ajvModule from 'ajv';
import _addFormats from 'ajv-formats';

const SchemaValidator: React.FC = () => {
    const [schema, setSchema] = useState('');
    const [data, setData] = useState('');
    const [jsonData, setJsonData] = useState('');
    const [errors, setErrors] = useState<ErrorObject[]>([]);
    const [validationResult, setValidationResult] = useState<string | null>(null);
    

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'schema' | 'data') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                if (type === 'schema') {
                    setSchema(content);
                } else if (type === 'data') {
                    setData(content);
                }
            };
            reader.readAsText(file);
        }
    };
     
    const handleValidate = () => {
        const ajv = new Ajv.default()
        const addFormats = _addFormats as unknown as typeof _addFormats.default;
        addFormats(ajv)
        if (!schema) {
            setValidationResult('❌ Please upload a schema file.')
            return;
        }

        let parsedSchema;
        try {
            parsedSchema = JSON.parse(schema)
        } catch (error) {
            setValidationResult('❌ Invalid JSON schema.')
            return;
        }
        const validate = ajv.compile(parsedSchema)
        if (!data){
            setValidationResult('❌ Please upload a JSON data file.')
            return;
        }
        let parsedData;
        try {
            parsedData = JSON.parse(data)
        } catch (error) {
            setValidationResult('❌ Invalid JSON data.')
            return;
        }
        const valid = validate(parsedData)
        if (valid) {
            setValidationResult('✅ JSON data is valid.')
        } else {
            setErrors(validate.errors || [])
            setValidationResult('❌ JSON data is not valid.')
        }


    }
    
    
    // TODO: Fix indentation on placeholder text
    return (
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" gutterBottom>
            JSON Schema Validator
          </Typography>

          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={4}
            
          >
            <Box flex={1}>
              <Typography variant="h6">JSON Schema</Typography>
              <TextField
                multiline
                rows={10} // Fixed number of rows
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder={`{
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "type": "object",
                    "properties": {
                        "name": {
                        "type": "string"
                        },
                        "age": {
                        "type": "integer",
                        "minimum": 0
                        },
                        "email": {
                        "type": "string",
                        "format": "email" // Example of using "email" format
                        }
                    },
                    "required": ["name", "age", "email"]
                    }`}
                sx={{
                    height: '300px',     
                    overflowY: 'auto',      
                    resize: 'none',         
                }}
              />
              <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                Upload Schema File
                <input type="file" accept=".json" hidden onChange={(e) => handleFileUpload(e, 'schema')} />
              </Button>
            </Box>

            <Box flex={1}>
              <Typography variant="h6">JSON Data</Typography>
              <TextField
                multiline
                rows={10} 
                value={data}
                onChange={(e) => setData(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder={`
                {
                    "name": "John Doe",
                    "age": 30,
                    "email": "john.doe@example.com"
                  }`}
                sx={{
                    height: '300px',     
                    overflowY: 'auto',      
                    resize: 'none',         
                }}
              />
              <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                Upload JSON File
                <input type="file" accept=".json" hidden onChange={(e) => handleFileUpload(e, 'data')} />
              </Button>
            </Box>
          </Box>

          <Button variant="contained" color="primary" onClick={handleValidate} sx={{ mt: 4 }}>
            Validate JSON
          </Button>

          {validationResult && (
            <Alert severity={validationResult.startsWith('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>
              {validationResult}
            </Alert>
          )}

          {errors.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" color="error">
                Validation Errors:
              </Typography>
              {errors.map((error, index) => (
                <Typography key={index} color="error">
                  {error.instancePath || '/'} {error.message}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      );
    };
    
    export default SchemaValidator;

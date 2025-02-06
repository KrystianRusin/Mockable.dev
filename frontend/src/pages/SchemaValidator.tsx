import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import AjvImport from 'ajv';
import { ErrorObject } from 'ajv';
import addFormatsImport from 'ajv-formats';
// Import the meta schema for JSON Schema Draft 2020-12
import metaSchema2020 from 'ajv';

// Cast our imports to the appropriate types
const Ajv = AjvImport as unknown as typeof AjvImport.default;
const addFormats = addFormatsImport as unknown as typeof addFormatsImport.default;

const SchemaValidator: React.FC = () => {
  const [schema, setSchema] = useState('');
  const [data, setData] = useState('');
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
    // Create an Ajv instance
    const ajv = new Ajv();
    // Add the 2020-12 meta schema so that any schema referencing it can be resolved.
    ajv.addMetaSchema(metaSchema2020);
    // Add format validations.
    addFormats(ajv);

    if (!schema) {
      setValidationResult('❌ Please upload a schema file.');
      return;
    }

    let parsedSchema;
    try {
      parsedSchema = JSON.parse(schema);
    } catch (error) {
      setValidationResult('❌ Invalid JSON schema.');
      return;
    }

    const validate = ajv.compile(parsedSchema);

    if (!data) {
      setValidationResult('❌ Please upload a JSON data file.');
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (error) {
      setValidationResult('❌ Invalid JSON data.');
      return;
    }

    const valid = validate(parsedData);
    if (valid) {
      setValidationResult('✅ JSON data is valid.');
      setErrors([]);
    } else {
      setErrors(validate.errors || []);
      setValidationResult('❌ JSON data is not valid.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 1000,
          mx: 'auto',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          JSON Schema Validator
        </Typography>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={4}
          sx={{ mb: 2 }}
        >
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              JSON Schema
            </Typography>
            <TextField
              multiline
              rows={10}
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              variant="outlined"
              fullWidth
              placeholder={`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer", "minimum": 0 },
    "email": { "type": "string", "format": "email" }
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
            <Typography variant="h6" gutterBottom>
              JSON Data
            </Typography>
            <TextField
              multiline
              rows={10}
              value={data}
              onChange={(e) => setData(e.target.value)}
              variant="outlined"
              fullWidth
              placeholder={`{
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

        <Button variant="contained" color="primary" onClick={handleValidate} sx={{ mt: 2 }}>
          Validate JSON
        </Button>

        {validationResult && (
          <Alert
            severity={validationResult.startsWith('✅') ? 'success' : 'error'}
            sx={{ mt: 2 }}
          >
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
      </Paper>
    </Box>
  );
};

export default SchemaValidator;

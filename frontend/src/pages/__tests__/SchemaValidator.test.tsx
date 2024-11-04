import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import SchemaValidator from '../SchemaValidator.tsx'
import { userEvent } from '@testing-library/user-event'
import Ajv from 'ajv'

// Mock Ajv
jest.mock('ajv')

describe('SchemaValidator Component', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    jest.clearAllMocks()
    user = userEvent.setup()
  })

  test('renders SchemaValidator component correctly', () => {
    render(<SchemaValidator />)

    expect(screen.getByText(/JSON Schema Validator/i)).toBeInTheDocument()
    expect(screen.getByText(/JSON Schema/i)).toBeInTheDocument()
    expect(screen.getByText(/JSON Data/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Validate JSON/i })).toBeInTheDocument()
  })

  test('shows error when schema file is not uploaded', async () => {
    render(<SchemaValidator />)

    const validateButton = screen.getByRole('button', { name: /Validate JSON/i })
    await user.click(validateButton)

    expect(await screen.findByText(/❌ Please upload a schema file./i)).toBeInTheDocument()
  })

  test('shows error for invalid JSON schema', async () => {
    render(<SchemaValidator />)

    const schemaInput = screen.getByPlaceholderText(/"type": "object"/i)
    await user.type(schemaInput, 'Invalid JSON Schema')

    const validateButton = screen.getByRole('button', { name: /Validate JSON/i })
    await user.click(validateButton)

    expect(await screen.findByText(/�� Invalid JSON schema./i)).toBeInTheDocument()
  })

  test('validates correct JSON data successfully', async () => {
    // Create a mock validate function that returns true
    const mockValidate = jest.fn().mockReturnValue(true)

    // Create a mock Ajv instance with the compile method
    const mockAjvInstance = {
      compile: jest.fn().mockReturnValue(mockValidate),
    }

    // Cast Ajv to jest.MockedClass<typeof Ajv> and mock its implementation
    const MockAjv = Ajv as any
    MockAjv.mockImplementation(() => mockAjvInstance as any)

    render(<SchemaValidator />)

    const schema = `
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
          "name": { "type": "string" },
          "age": { "type": "integer", "minimum": 0 },
          "email": { "type": "string", "format": "email" }
      },
      "required": ["name", "age", "email"]
    }
    `
    const data = `
    {
      "name": "John Doe",
      "age": 30,
      "email": "john.doe@example.com"
    }
    `

    const schemaInput = screen.getByPlaceholderText(/"type": "object"/i)
    const dataInput = screen.getByPlaceholderText(/"name": "John Doe"/i)

    await user.clear(schemaInput)
    await user.type(schemaInput, schema)

    await user.clear(dataInput)
    await user.type(dataInput, data)

    const validateButton = screen.getByRole('button', { name: /Validate JSON/i })
    await user.click(validateButton)

    await waitFor(() => {
      expect(mockAjvInstance.compile).toHaveBeenCalledWith(JSON.parse(schema))
      expect(mockValidate).toHaveBeenCalledWith(JSON.parse(data))
    })

    expect(await screen.findByText(/✅ JSON data is valid./i)).toBeInTheDocument()
    expect(screen.queryByText(/❌ JSON data is not valid./i)).not.toBeInTheDocument()
  })

  test('shows validation errors when JSON data is invalid', async () => {
    // Create a mock validate function that returns false
    const mockValidate = jest.fn().mockReturnValue(false)

    // Define mock errors
    const mockErrors = [
      { instancePath: '/age', message: 'must be >= 0' },
      { instancePath: '/email', message: 'must match format "email"' },
    ]

    // Create a mock Ajv instance with the compile method and errors
    const mockAjvInstance = {
      compile: jest.fn().mockReturnValue(mockValidate),
      errors: mockErrors,
    }

    // Cast Ajv to jest.MockedClass<typeof Ajv> and mock its implementation
    const MockAjv = Ajv as any
    MockAjv.mockImplementation(() => mockAjvInstance as any)

    render(<SchemaValidator />)

    const schema = `
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
          "name": { "type": "string" },
          "age": { "type": "integer", "minimum": 0 },
          "email": { "type": "string", "format": "email" }
      },
      "required": ["name", "age", "email"]
    }
    `
    const invalidData = `
    {
      "name": "John Doe",
      "age": -5,
      "email": "invalid-email"
    }
    `

    const schemaInput = screen.getByPlaceholderText(/"type": "object"/i)
    const dataInput = screen.getByPlaceholderText(/"name": "John Doe"/i)

    await user.clear(schemaInput)
    await user.type(schemaInput, schema)

    await user.clear(dataInput)
    await user.type(dataInput, invalidData)

    const validateButton = screen.getByRole('button', { name: /Validate JSON/i })
    await user.click(validateButton)

    await waitFor(() => {
      expect(mockAjvInstance.compile).toHaveBeenCalledWith(JSON.parse(schema))
      expect(mockValidate).toHaveBeenCalledWith(JSON.parse(invalidData))
    })

    expect(await screen.findByText(/❌ JSON data is not valid./i)).toBeInTheDocument()
    expect(screen.getByText(/\/age must be >= 0/i)).toBeInTheDocument()
    expect(screen.getByText(/\/email must match format "email"/i)).toBeInTheDocument()
  })

  test('handles missing data file upload', async () => {
    render(<SchemaValidator />)

    const schema = `
    {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
          "name": { "type": "string" },
          "age": { "type": "integer", "minimum": 0 },
          "email": { "type": "string", "format": "email" }
      },
      "required": ["name", "age", "email"]
    }
    `
    const schemaInput = screen.getByPlaceholderText(/"type": "object"/i)
    await user.clear(schemaInput)
    await user.type(schemaInput, schema)

    const validateButton = screen.getByRole('button', { name: /Validate JSON/i })
    await user.click(validateButton)

    expect(await screen.findByText(/❌ Please upload a JSON data file./i)).toBeInTheDocument()
  })
})

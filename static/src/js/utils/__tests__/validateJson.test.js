import {
  describe,
  test,
  expect,
  vi
} from 'vitest'
import Ajv from 'ajv'
import { validateJson } from '../validateJson'

vi.mock('ajv')
vi.mock('ajv-formats')

describe('validateJson', () => {
  const mockSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' }
    },
    required: ['name']
  }

  beforeEach(() => {
    // Suppress console.error
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console.error
    vi.restoreAllMocks()
  })

  test('When given valid JSON data, should return validated data with no errors', () => {
    const mockJsonData = {
      name: 'John',
      age: 30
    }
    const mockValidate = vi.fn().mockReturnValue(true)
    Ajv.mockImplementation(() => ({
      compile: () => mockValidate
    }))

    const result = validateJson({
      jsonData: mockJsonData,
      schema: mockSchema
    })

    expect(result).toEqual({
      data: mockJsonData,
      errors: null
    })

    expect(mockValidate).toHaveBeenCalledWith(mockJsonData)
  })

  test('When given invalid JSON data, should return data with error messages', () => {
    const mockJsonData = {
      name: 'John',
      age: 'thirty'
    }
    const mockValidate = vi.fn().mockReturnValue(false)
    mockValidate.errors = [
      {
        instancePath: '/age',
        message: 'should be number'
      }
    ]

    Ajv.mockImplementation(() => ({
      compile: () => mockValidate
    }))

    const result = validateJson({
      jsonData: mockJsonData,
      schema: mockSchema
    })

    expect(result).toEqual({
      data: mockJsonData,
      errors: ['/age should be number']
    })
  })

  test('When validation throws an error, should return data with error message', () => {
    const mockJsonData = { name: 'John' }
    const mockError = new Error('Validation failed')
    Ajv.mockImplementation(() => ({
      compile: () => {
        throw mockError
      }
    }))

    const result = validateJson({
      jsonData: mockJsonData,
      schema: mockSchema
    })

    expect(result).toEqual({
      data: mockJsonData,
      errors: ['Error during validation: Validation failed']
    })
  })

  test('When given invalid JSON data with missing required property, should not include required error', () => {
    const mockJsonData = { age: 30 }
    const mockValidate = vi.fn().mockReturnValue(false)
    mockValidate.errors = [
      {
        keyword: 'required',
        message: 'should have required property \'name\''
      },
      {
        instancePath: '/age',
        message: 'should be string'
      }
    ]

    Ajv.mockImplementation(() => ({
      compile: () => mockValidate
    }))

    const result = validateJson({
      jsonData: mockJsonData,
      schema: mockSchema
    })

    expect(result).toEqual({
      data: mockJsonData,
      errors: ['/age should be string']
    })
  })

  test('When given invalid JSON data with both required and non-required errors, should only return non-required errors', () => {
    const mockJsonData = { name: 123 }
    const mockValidate = vi.fn().mockReturnValue(false)
    mockValidate.errors = [
      {
        keyword: 'required',
        instancePath: '',
        message: "must have required property 'age'"
      },
      {
        keyword: 'type',
        instancePath: '/name',
        message: 'must be string'
      }
    ]

    Ajv.mockImplementation(() => ({
      compile: () => mockValidate
    }))

    const result = validateJson({
      jsonData: mockJsonData,
      schema: mockSchema
    })

    expect(result).toEqual({
      data: mockJsonData,
      errors: ['/name must be string']
    })
  })

  test('When all errors are about required properties, should return null for errors', () => {
    const mockJsonData = {}
    const mockValidate = vi.fn().mockReturnValue(false)
    mockValidate.errors = [
      {
        keyword: 'required',
        instancePath: '',
        message: "must have required property 'name'"
      },
      {
        keyword: 'required',
        instancePath: '',
        message: "must have required property 'age'"
      }
    ]

    Ajv.mockImplementation(() => ({
      compile: () => mockValidate
    }))

    const result = validateJson({
      jsonData: mockJsonData,
      schema: mockSchema
    })

    expect(result).toEqual({
      data: mockJsonData,
      errors: null
    })
  })
})

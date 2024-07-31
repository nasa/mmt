import removeMetadataKeys from '../removeMetadataKeys'

describe('removeMetadataKeys', () => {
  test('should remove Name and LongName from the metadata', () => {
    const metadata = {
      Name: 'test name',
      LongName: 'test long name',
      Description: 'test description'
    }
    const keys = ['Name', 'LongName']

    const removeKeys = removeMetadataKeys(metadata, keys)

    expect(removeKeys).toMatchObject({ Description: 'test description' })
  })

  test('should remove ShortName and EntryTitle from the metadata', () => {
    const metadata = {
      ShortName: 'test short name',
      EntryTitle: 'test entry title',
      Description: 'test description'
    }
    const keys = ['ShortName', 'EntryTitle']

    const removeKeys = removeMetadataKeys(metadata, keys)

    expect(removeKeys).toMatchObject({ Description: 'test description' })
  })
})

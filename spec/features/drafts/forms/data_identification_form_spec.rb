# MMT-53, MMT-293

require 'rails_helper'

describe 'Data identification form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Data Identification'
      end

      fill_in 'draft_entry_id', with: '12345'
      fill_in 'Entry Title', with: 'Draft Title'
      fill_in 'Abstract', with: 'This is a long description of the collection'
      fill_in 'Purpose', with: 'This is the purpose field'
      fill_in 'Data Language', with: 'English'

      # Data Dates
      add_dates

      # Organization
      within '.organization' do
        add_responsibilities('organization')
      end
      # Personnel
      within '.personnel' do
        add_responsibilities('personnel')
      end

      # Processing level
      within '.processing-level-fields' do
        fill_in 'ID', with: 'Level 1'
        fill_in 'Description', with: 'Level 1 Description'
      end

      # Resource Citation
      add_resource_citation

      select 'In work', from: 'Collection Progress'
      fill_in 'Quality', with: 'Metadata quality summary'
      fill_in 'Use Constraints', with: 'These are some use constraints'

      # Access Constraints
      within '.access-constraints' do
        fill_in 'Value', with: 42.0
        fill_in 'Description', with: 'Access constraint description'
      end

      # Metadata Association
      add_metadata_association

      # Publication Reference
      add_publication_reference

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('Draft Title')
    end

    it 'shows pre-entered values in the draft preview page' do
      expect(page).to have_content('10-2, M-W', count: 2)
      expect(page).to have_content('12345', count: 3)
      expect(page).to have_content('1234567890123', count: 1)
      expect(page).to have_content('123abc', count: 1)
      expect(page).to have_content('2015-07-01T00:00:00Z', count: 3)
      expect(page).to have_content('2015-07-02T00:00:00Z', count: 1)
      expect(page).to have_content('20546', count: 4)
      expect(page).to have_content('20771', count: 4)
      expect(page).to have_content('300 E Street Southwest', count: 4)
      expect(page).to have_content('8800 Greenbelt Road', count: 4)
      expect(page).to have_content('9-5, M-F', count: 2)
      expect(page).to have_content('9876543210987', count: 1)
      expect(page).to have_content('Access constraint description', count: 1)
      expect(page).to have_content('Authority', count: 3)
      expect(page).to have_content('Create', count: 1)
      expect(page).to have_content('Citation DOI Authority', count: 2)
      expect(page).to have_content('Citation DOI', count: 2)
      expect(page).to have_content('Citation creator 1', count: 1)
      expect(page).to have_content('Citation creator', count: 2)
      expect(page).to have_content('Citation data presentation form', count: 1)
      expect(page).to have_content('Citation editor', count: 1)
      expect(page).to have_content('Citation issue identification', count: 1)
      expect(page).to have_content('Citation other details', count: 1)
      expect(page).to have_content('Citation publisher', count: 1)
      expect(page).to have_content('Citation release place', count: 1)
      expect(page).to have_content('Citation series name', count: 1)
      expect(page).to have_content('Citation title 1', count: 1)
      expect(page).to have_content('Citation title', count: 2)
      expect(page).to have_content('DC', count: 4)
      expect(page).to have_content('Draft Title', count: 3)
      expect(page).to have_content('Editor', count: 1)
      expect(page).to have_content('Email only', count: 4)
      expect(page).to have_content('Email', count: 12)
      expect(page).to have_content('English', count: 1)
      expect(page).to have_content('Example Caption', count: 7)
      expect(page).to have_content('Example Description', count: 7)
      expect(page).to have_content('Example Title', count: 7)
      expect(page).to have_content('FTP', count: 7)
      expect(page).to have_content('First Name', count: 4)
      expect(page).to have_content('Greenbelt', count: 8)
      expect(page).to have_content('In work', count: 1)
      expect(page).to have_content('LARGER CITATION WORKS', count: 1)
      expect(page).to have_content('LPDAAC_ECS', count: 1)
      expect(page).to have_content('Last Name', count: 4)
      expect(page).to have_content('Level 1 Description')
      expect(page).to have_content('Level 1', count: 2)
      expect(page).to have_content('MB', count: 7)
      expect(page).to have_content('MD', count: 4)
      expect(page).to have_content('Metadata association description', count: 1)
      expect(page).to have_content('Metadata quality summary', count: 1)
      expect(page).to have_content('Middle Name', count: 4)
      expect(page).to have_content('ORG_SHORT', count: 2)
      expect(page).to have_content('ORNL_DAAC', count: 1)
      expect(page).to have_content('Owner', count: 2)
      expect(page).to have_content('Organization Long Name', count: 2)
      expect(page).to have_content('Publication reference DOI', count: 1)
      expect(page).to have_content('Publication reference author', count: 2)
      expect(page).to have_content('Publication reference authority', count: 1)
      expect(page).to have_content('Publication reference details', count: 1)
      expect(page).to have_content('Publication reference edition', count: 1)
      expect(page).to have_content('Publication reference issue', count: 1)
      expect(page).to have_content('Publication reference pages', count: 1)
      expect(page).to have_content('Publication reference publication place', count: 1)
      expect(page).to have_content('Publication reference publisher', count: 1)
      expect(page).to have_content('Publication reference report number', count: 1)
      expect(page).to have_content('Publication reference series', count: 1)
      expect(page).to have_content('Publication reference title 1', count: 1)
      expect(page).to have_content('Publication reference title', count: 2)
      expect(page).to have_content('Publication reference volume', count: 1)
      expect(page).to have_content('Resource Provider', count: 2)
      expect(page).to have_content('Review', count: 1)
      expect(page).to have_content('Room 203', count: 4)
      expect(page).to have_content('SCIENCE ASSOCIATED', count: 1)
      expect(page).to have_content('Subtype', count: 14)
      expect(page).to have_content('These are some use constraints', count: 1)
      expect(page).to have_content('This is a long description of the collection', count: 1)
      expect(page).to have_content('This is the purpose field', count: 1)
      expect(page).to have_content('User', count: 1)
      expect(page).to have_content('United States', count: 8)
      expect(page).to have_content('Washington', count: 4)
      expect(page).to have_content('example2@example.com', count: 4)
      expect(page).to have_content('example@example.com', count: 4)
      expect(page).to have_content('http://another-example.com', count: 7)
      expect(page).to have_content('http://example.com', count: 11)
      expect(page).to have_content('http://example.com/1', count: 4)
      expect(page).to have_content('text/html', count: 7)
      expect(page).to have_content('v1', count: 1)
      expect(page).to have_content('v2', count: 1)
      expect(page).to have_content('42.0', count: 8)

      expect(page).to have_content('No Temporal Coverages found')
      expect(page).to have_content('No Spatial Coordinates found')

      expect(page).to have_content('de135797-8539-4c3a-bc20-17a83d75aa49')
      expect(page).to have_content('351bb40b-0287-44ce-ba73-83e47f4945f8')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Data Identification'
        end

        open_accordions
      end

      it 'populates the form with the values' do
        expect(page).to have_field('Entry Id', with: '12345')
        expect(page).to have_field('Entry Title', with: 'Draft Title')
        expect(page).to have_field('Abstract', with: 'This is a long description of the collection')
        expect(page).to have_field('Purpose', with: 'This is the purpose field')
        expect(page).to have_field('Data Language', with: 'English')

        within '.multiple.dates' do
          within '.multiple-item-0' do
            expect(page).to have_field('Type', with: 'CREATE')
            expect(page).to have_field('Date', with: '2015-07-01T00:00:00Z')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Type', with: 'REVIEW')
            expect(page).to have_field('Date', with: '2015-07-02T00:00:00Z')
          end
        end

        #### Organization
        within '.row.organization' do
          within '.multiple.responsibilities > .multiple-item-0' do
            expect(page).to have_field('Role', with: 'RESOURCEPROVIDER')
            expect(page).to have_field('Short Name', with: 'ORG_SHORT')
            expect(page).to have_field('Long Name', with: 'Organization Long Name')
            expect(page).to have_field('Uuid', with: 'de135797-8539-4c3a-bc20-17a83d75aa49')
            expect(page).to have_field('Service Hours', with: '9-5, M-F')
            expect(page).to have_field('Contact Instructions', with: 'Email only')
            within '.multiple.contacts' do
              within '.multiple-item-0' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example@example.com')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example2@example.com')
              end
            end
            within '.multiple.addresses' do
              within first('.multiple.addresses-street-addresses') do
                within first('.multiple-item') do
                  expect(page).to have_field('Street Address', with: '300 E Street Southwest')
                end
                  expect(page).to have_field('Street Address', with: 'Room 203')
                  expect(page).to have_field('City', with: 'Washington')
                  expect(page).to have_field('State / Province', with: 'DC')
                  expect(page).to have_field('Postal Code', with: '20546')
                  expect(page).to have_field('Country', with: 'United States')
              end
              within '.multiple-item.accordion.multiple-item-1' do
                expect(page).to have_field('Street Address', with: '8800 Greenbelt Road')
                expect(page).to have_field('City', with: 'Greenbelt')
                expect(page).to have_field('State / Province', with: 'MD')
                expect(page).to have_field('Postal Code', with: '20771')
                expect(page).to have_field('Country', with: 'United States')
              end
            end
            within '.multiple.related-urls > .multiple-item-0' do
              expect(page).to have_selector('input.url[value="http://example.com"]')
              expect(page).to have_selector('input.url[value="http://another-example.com"]')
              expect(page).to have_field('Description', with: 'Example Description')
              expect(page).to have_field('Protocol', with: 'FTP')
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Caption', with: 'Example Caption')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
              expect(page).to have_field('Type', with: 'Type')
              expect(page).to have_field('Subtype', with: 'Subtype')
            end
            within '.multiple.related-urls> .multiple-item-1' do
              expect(page).to have_selector('input.url[value="http://example.com/1"]')
            end
          end
          within '.multiple.responsibilities > .multiple-item-1' do
            expect(page).to have_field('Role', with: 'OWNER')
            expect(page).to have_field('Short Name', with: 'ORG_SHORT')
            expect(page).to have_field('Long Name', with: 'Organization Long Name')
            expect(page).to have_field('Uuid', with: 'de135797-8539-4c3a-bc20-17a83d75aa49')
            expect(page).to have_field('Service Hours', with: '10-2, M-W')
            expect(page).to have_field('Contact Instructions', with: 'Email only')
            within '.multiple.contacts' do
              within '.multiple-item-0' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example@example.com')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example2@example.com')
              end
            end
            within '.multiple.addresses' do
              within '.multiple-item-0' do
                expect(page).to have_field('Street Address', with: '300 E Street Southwest')
                expect(page).to have_field('Street Address', with: 'Room 203')
                expect(page).to have_field('City', with: 'Washington')
                expect(page).to have_field('State / Province', with: 'DC')
                expect(page).to have_field('Postal Code', with: '20546')
                expect(page).to have_field('Country', with: 'United States')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Street Address', with: '8800 Greenbelt Road')
                expect(page).to have_field('City', with: 'Greenbelt')
                expect(page).to have_field('State / Province', with: 'MD')
                expect(page).to have_field('Postal Code', with: '20771')
                expect(page).to have_field('Country', with: 'United States')
              end
            end
            within '.multiple.related-urls > .multiple-item-0' do
              expect(page).to have_selector('input.url[value="http://example.com"]')
              expect(page).to have_selector('input.url[value="http://another-example.com"]')
              expect(page).to have_field('Description', with: 'Example Description')
              expect(page).to have_field('Protocol', with: 'FTP')
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Caption', with: 'Example Caption')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
              expect(page).to have_field('Type', with: 'Type')
              expect(page).to have_field('Subtype', with: 'Subtype')
            end
            within '.multiple.related-urls> .multiple-item-1' do
              expect(page).to have_selector('input.url[value="http://example.com/1"]')
            end
          end
        end

        #### Personnel
        within '.row.personnel' do
          within '.multiple.responsibilities > .multiple-item-0' do
            expect(page).to have_field('Role', with: 'RESOURCEPROVIDER')
            expect(page).to have_field('First Name', with: 'First Name')
            expect(page).to have_field('Middle Name', with: 'Middle Name')
            expect(page).to have_field('Last Name', with: 'Last Name')
            expect(page).to have_field('Uuid', with: '351bb40b-0287-44ce-ba73-83e47f4945f8')
            expect(page).to have_field('Service Hours', with: '9-5, M-F')
            expect(page).to have_field('Contact Instructions', with: 'Email only')
            within '.multiple.contacts' do
              within '.multiple-item-0' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example@example.com')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example2@example.com')
              end
            end
            within '.multiple.addresses' do
              within '.multiple-item-0' do
                expect(page).to have_field('Street Address', with: '300 E Street Southwest')
                expect(page).to have_field('Street Address', with: 'Room 203')
                expect(page).to have_field('City', with: 'Washington')
                expect(page).to have_field('State / Province', with: 'DC')
                expect(page).to have_field('Postal Code', with: '20546')
                expect(page).to have_field('Country', with: 'United States')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Street Address', with: '8800 Greenbelt Road')
                expect(page).to have_field('City', with: 'Greenbelt')
                expect(page).to have_field('State / Province', with: 'MD')
                expect(page).to have_field('Postal Code', with: '20771')
                expect(page).to have_field('Country', with: 'United States')
              end
            end
            within '.multiple.related-urls > .multiple-item-0' do
              expect(page).to have_selector('input.url[value="http://example.com"]')
              expect(page).to have_selector('input.url[value="http://another-example.com"]')
              expect(page).to have_field('Description', with: 'Example Description')
              expect(page).to have_field('Protocol', with: 'FTP')
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Caption', with: 'Example Caption')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
              expect(page).to have_field('Type', with: 'Type')
              expect(page).to have_field('Subtype', with: 'Subtype')
            end
            within '.multiple.related-urls> .multiple-item-1' do
              expect(page).to have_selector('input.url[value="http://example.com/1"]')
            end
          end
          within '.multiple.responsibilities > .multiple-item-1' do
            expect(page).to have_field('Role', with: 'OWNER')
            expect(page).to have_field('First Name', with: 'First Name')
            expect(page).to have_field('Middle Name', with: 'Middle Name')
            expect(page).to have_field('Last Name', with: 'Last Name')
            expect(page).to have_field('Uuid', with: '351bb40b-0287-44ce-ba73-83e47f4945f8')
            expect(page).to have_field('Service Hours', with: '10-2, M-W')
            expect(page).to have_field('Contact Instructions', with: 'Email only')
            within '.multiple.contacts' do
              within '.multiple-item-0' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example@example.com')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Type', with: 'Email')
                expect(page).to have_field('Value', with: 'example2@example.com')
              end
            end
            within '.multiple.addresses' do
              within '.multiple-item-0' do
                expect(page).to have_field('Street Address', with: '300 E Street Southwest')
                expect(page).to have_field('Street Address', with: 'Room 203')
                expect(page).to have_field('City', with: 'Washington')
                expect(page).to have_field('State / Province', with: 'DC')
                expect(page).to have_field('Postal Code', with: '20546')
                expect(page).to have_field('Country', with: 'United States')
              end
              within '.multiple-item-1' do
                expect(page).to have_field('Street Address', with: '8800 Greenbelt Road')
                expect(page).to have_field('City', with: 'Greenbelt')
                expect(page).to have_field('State / Province', with: 'MD')
                expect(page).to have_field('Postal Code', with: '20771')
                expect(page).to have_field('Country', with: 'United States')
              end
            end
            within '.multiple.related-urls > .multiple-item-0' do
              expect(page).to have_selector('input.url[value="http://example.com"]')
              expect(page).to have_selector('input.url[value="http://another-example.com"]')
              expect(page).to have_field('Description', with: 'Example Description')
              expect(page).to have_field('Protocol', with: 'FTP')
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Caption', with: 'Example Caption')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
              expect(page).to have_field('Type', with: 'Type')
              expect(page).to have_field('Subtype', with: 'Subtype')
            end
            within '.multiple.related-urls> .multiple-item-1' do
              expect(page).to have_selector('input.url[value="http://example.com/1"]')
            end
          end
        end

        within '.processing-level-fields' do
          expect(page).to have_field('ID', with: 'Level 1')
          expect(page).to have_field('Description', with: 'Level 1 Description')
        end

        #### ResourceCitation
        within '.multiple.resource-citations' do
          within first('.multiple-item-0') do
            expect(page).to have_field('Version', with: 'v1')
            expect(page).to have_field('Title', with: 'Citation title')
            expect(page).to have_field('Creator', with: 'Citation creator')
            expect(page).to have_field('Editor', with: 'Citation editor')
            expect(page).to have_field('Series Name', with: 'Citation series name')
            expect(page).to have_field('Release Date', with: '2015-07-01T00:00:00Z')
            expect(page).to have_field('Release Place', with: 'Citation release place')
            expect(page).to have_field('Publisher', with: 'Citation publisher')
            expect(page).to have_field('Issue Identification', with: 'Citation issue identification')
            expect(page).to have_field('Data Presentation Form', with: 'Citation data presentation form')
            expect(page).to have_field('Other Citation Details', with: 'Citation other details')
            expect(page).to have_field('DOI', with: 'Citation DOI')
            expect(page).to have_field('Authority', with: 'Citation DOI Authority')

            within '.related-url' do
              expect(page).to have_selector('input.url[value="http://example.com"]')
              expect(page).to have_selector('input.url[value="http://another-example.com"]')
              expect(page).to have_field('Description', with: 'Example Description')
              expect(page).to have_field('Protocol', with: 'FTP')
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Caption', with: 'Example Caption')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
              expect(page).to have_field('Type', with: 'Type')
              expect(page).to have_field('Subtype', with: 'Subtype')
            end
          end
          within all('.multiple-item-1')[1] do
            expect(page).to have_field('Version', with: 'v2')
            expect(page).to have_field('Title', with: 'Citation title 1')
            expect(page).to have_field('Creator', with: 'Citation creator 1')

            within '.related-url' do
              expect(page).to have_selector('input.url[value="http://example.com"]')
              expect(page).to have_selector('input.url[value="http://another-example.com"]')
              expect(page).to have_field('Description', with: 'Example Description')
              expect(page).to have_field('Protocol', with: 'FTP')
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Caption', with: 'Example Caption')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
              expect(page).to have_field('Type', with: 'Type')
              expect(page).to have_field('Subtype', with: 'Subtype')
            end
          end
        end

        expect(page).to have_field('Collection Progress', with: 'IN WORK')
        expect(page).to have_field('Quality', with: 'Metadata quality summary')
        expect(page).to have_field('Use Constraints', with: 'These are some use constraints')

        # Access constraints
        within '.row.access-constraints' do
          expect(page).to have_field('Value', with: '42.0')
          expect(page).to have_field('Description', with: 'Access constraint description')
        end

        ##### Metadata Association
        within '.multiple.metadata-associations' do
          within '.multiple-item-0' do
            expect(page).to have_field('Type', with: 'SCIENCE ASSOCIATED')
            expect(page).to have_field('Description', with: 'Metadata association description')
            expect(page).to have_field('Entry Id', with: '12345')
            expect(page).to have_field('Provider ID', with: 'LPDAAC_ECS')
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Type', with: 'LARGER CITATION WORKS')
            expect(page).to have_field('Entry Id', with: '123abc')
            expect(page).to have_field('Provider ID', with: 'ORNL_DAAC')
          end
        end

        #### PublicationReference
        within '.multiple.publication-references' do
          within first('.multiple-item-0') do
            expect(page).to have_field('draft_publication_references_0_title', with: 'Publication reference title') # Title
            expect(page).to have_field('Publisher', with: 'Publication reference publisher')
            expect(page).to have_field('DOI', with: 'Publication reference DOI')
            expect(page).to have_field('Authority', with: 'Publication reference authority')
            expect(page).to have_field('Author', with: 'Publication reference author')
            expect(page).to have_field('Publication Date', with: '2015-07-01T00:00:00Z')
            expect(page).to have_field('Series', with: 'Publication reference series')
            expect(page).to have_field('Edition', with: 'Publication reference edition')
            expect(page).to have_field('Volume', with: 'Publication reference volume')
            expect(page).to have_field('Issue', with: 'Publication reference issue')
            expect(page).to have_field('Report Number', with: 'Publication reference report number')
            expect(page).to have_field('Publication Place', with: 'Publication reference publication place')
            expect(page).to have_field('Pages', with: 'Publication reference pages')
            expect(page).to have_field('ISBN', with: '1234567890123')
            expect(page).to have_field('Other Reference Details', with: 'Publication reference details')
            within '.related-url' do
              expect(page).to have_selector('input.url[value="http://example.com"]')
              expect(page).to have_selector('input.url[value="http://another-example.com"]')
              expect(page).to have_field('Description', with: 'Example Description')
              expect(page).to have_field('Protocol', with: 'FTP')
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Caption', with: 'Example Caption')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
              expect(page).to have_field('Type', with: 'Type')
              expect(page).to have_field('Subtype', with: 'Subtype')
            end
          end
          within all('.multiple-item-1').last do
            expect(page).to have_field('draft_publication_references_1_title', with: 'Publication reference title 1') # Title
            expect(page).to have_field('ISBN', with: '9876543210987')
          end
        end
      end
    end
  end
end

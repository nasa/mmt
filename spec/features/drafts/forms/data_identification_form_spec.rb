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

      open_accordions

      # Data Dates
      add_dates

      # CollectionDataType
      within '#collection-data-type' do
        select 'Other', from: 'Collection Data Type'
      end

      # Processing level
      within '.processing-level-fields' do
        select 'Level 1A', from: 'ID'
        fill_in 'Description', with: 'Level 1 Description'
      end

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
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it 'shows pre-entered values in the draft preview page' do
      within '.preview' do
        # Data Dates
        expect(page).to have_content('Creation')
        expect(page).to have_content('2015-07-01T00:00:00Z')

        expect(page).to have_content('Future Review')
        expect(page).to have_content('2015-07-02T00:00:00Z')

        # CollectionDataType
        expect(page).to have_content('Other')

        # Processing Level
        expect(page).to have_content('Level 1A')
        expect(page).to have_content('Level 1 Description')

        expect(page).to have_content('In work')
        expect(page).to have_content('Metadata quality summary')
        expect(page).to have_content('These are some use constraints')

        # Access constraints
        expect(page).to have_content('42.0')
        expect(page).to have_content('Access constraint description')

        ##### Metadata Association
        expect(page).to have_content('Science Associated')
        expect(page).to have_content('Metadata association description')
        expect(page).to have_content('12345')

        expect(page).to have_content('Larger Citation Works')
        expect(page).to have_content('123abc')

        #### PublicationReference
        expect(page).to have_content('Publication reference title')
        expect(page).to have_content('Publication reference publisher')
        expect(page).to have_content('Publication reference DOI')
        expect(page).to have_content('Publication reference authority')
        expect(page).to have_content('Publication reference author')
        expect(page).to have_content('2015-07-01T00:00:00Z')
        expect(page).to have_content('Publication reference series')
        expect(page).to have_content('Publication reference edition')
        expect(page).to have_content('Publication reference volume')
        expect(page).to have_content('Publication reference issue')
        expect(page).to have_content('Publication reference report number')
        expect(page).to have_content('Publication reference publication place')
        expect(page).to have_content('Publication reference pages')
        expect(page).to have_content('1234567890123')
        expect(page).to have_content('Publication reference details')

        expect(page).to have_content('http://example.com')
        expect(page).to have_content('http://another-example.com')
        expect(page).to have_content('Example Description')
        expect(page).to have_content('text/html')
        expect(page).to have_content('Example Title')
        expect(page).to have_content('42.0')
        expect(page).to have_content('MB')

        expect(page).to have_content('Publication reference title 1')
        expect(page).to have_content('9876543210987')
      end

      expect(page).to have_content('No Temporal Coverages found')
      expect(page).to have_content('No Spatial Coordinates found')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Data Identification'
        end

        open_accordions
      end

      it 'populates the form with the values' do
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

        # CollectionDataType
        expect(page).to have_field('Collection Data Type', with: 'OTHER')

        # Processing Level
        within '.processing-level-fields' do
          expect(page).to have_field('ID', with: 'Level 1A')
          expect(page).to have_field('Description', with: 'Level 1 Description')
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
          end
          within '.multiple-item-1' do
            expect(page).to have_field('Type', with: 'LARGER CITATION WORKS')
            expect(page).to have_field('Entry Id', with: '123abc')
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
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
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

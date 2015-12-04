# MMT-381

require 'rails_helper'

describe 'Resource citations form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Resource Citations'
      end

      open_accordions

      # Resource Citations
      add_resource_citations

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
        expect(page).to have_content('v1')
        expect(page).to have_content('Citation title')
        expect(page).to have_content('Citation creator')
        expect(page).to have_content('Citation editor')
        expect(page).to have_content('Citation series name')
        expect(page).to have_content('2015-07-01T00:00:00Z')
        expect(page).to have_content('Citation release place')
        expect(page).to have_content('Citation publisher')
        expect(page).to have_content('Citation issue identification')
        expect(page).to have_content('Citation data presentation form')
        expect(page).to have_content('Citation other details')
        expect(page).to have_content('Citation DOI')
        expect(page).to have_content('Citation DOI Authority')

        expect(page).to have_content('http://example.com')
        expect(page).to have_content('http://another-example.com')
        expect(page).to have_content('Example Description')
        expect(page).to have_content('FTP')
        expect(page).to have_content('text/html')
        expect(page).to have_content('Example Caption')
        expect(page).to have_content('Example Title')
        expect(page).to have_content('42.0')
        expect(page).to have_content('MB')
        expect(page).to have_content('Type')
        expect(page).to have_content('Subtype')
        expect(page).to have_content('v2')
        expect(page).to have_content('Citation title 1')
        expect(page).to have_content('Citation creator 1')

        expect(page).to have_content('http://example.com')
        expect(page).to have_content('http://another-example.com')
        expect(page).to have_content('Example Description')
        expect(page).to have_content('FTP')
        expect(page).to have_content('text/html')
        expect(page).to have_content('Example Caption')
        expect(page).to have_content('Example Title')
        expect(page).to have_content('42.0')
        expect(page).to have_content('MB')
        expect(page).to have_content('Type')
        expect(page).to have_content('Subtype')
      end

      expect(page).to have_content('No Temporal Coverages found')
      expect(page).to have_content('No Spatial Coordinates found')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Resource Citations'
        end

        open_accordions
      end

      it 'populates the form with the values' do
        #### Resource Citations
        within '.multiple.collection-citations' do
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
      end
    end
  end
end

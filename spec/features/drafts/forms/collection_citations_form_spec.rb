# MMT-381

require 'rails_helper'

describe 'Collection citations form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Collection Citations', match: :first
      end

      # Collection Citations
      add_collection_citations

      within '.nav-top' do
        click_on 'Save & Done'
      end
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Draft was successfully updated')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Collection Citations', match: :first
        end

        open_accordions
      end

      it 'populates the form with the values' do
        #### Collection Citations
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
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
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
              expect(page).to have_field('Mime Type', with: 'text/html')
              expect(page).to have_field('Title', with: 'Example Title')
              expect(page).to have_field('Size', with: '42.0')
              expect(page).to have_field('Unit', with: 'MB')
            end
          end
        end
      end
    end
  end
end

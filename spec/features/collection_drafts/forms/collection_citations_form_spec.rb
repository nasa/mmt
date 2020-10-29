# MMT-381

require 'rails_helper'

describe 'Collection citations form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when checking the accordion headers for required icons' do
    before do
      within '.metadata' do
        click_on 'Collection Citations', match: :first
      end
    end

    it 'does not display required icons for accordions in Collection Citations section' do
      expect(page).to have_no_css('h3.eui-required-o.always-required')
    end
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Collection Citations', match: :first
      end
      open_accordions

      # Collection Citations
      add_collection_citations

      within '.nav-top' do
        click_on 'Save'
      end
      expect(page).to have_content('Collection Citations')
      # output_schema_validation Draft.first.draft
      open_accordions
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      #### Collection Citations
      within '.multiple.collection-citations' do
        within '.multiple-item-0' do
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

          within '.online-resource' do
            expect(page).to have_field('Name', with: 'Online Resource Name')
            expect(page).to have_field('Linkage', with: 'http://www.example.com')
            expect(page).to have_field('Description', with: 'Online Resource Description')
            expect(page).to have_field('Protocol', with: 'http')
            expect(page).to have_field('Application Profile', with: 'website')
            expect(page).to have_field('Function', with: 'information')
          end
        end
        within '.multiple-item-1' do
          expect(page).to have_field('Version', with: 'v2')
          expect(page).to have_field('Title', with: 'Citation title 1')
          expect(page).to have_field('Creator', with: 'Citation creator 1')

          within '.online-resource' do
            expect(page).to have_field('Name', with: 'Online Resource Name 1')
            expect(page).to have_field('Linkage', with: 'http://www.example.com/1')
            expect(page).to have_field('Description', with: 'Online Resource Description 1')
          end
        end
      end
    end
  end
end

# MMT-292, MMT-299

require 'rails_helper'

describe 'Related URLs information form', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Related URLs', match: :first
      end

      click_on 'Expand All'

      # Complete RelatedUrl fields
      add_related_urls

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Updated Successfully!')
    end

    it 'populates the form with the values' do
      within '.multiple.related-urls > .multiple-item-0' do
        expect(page).to have_field('Description', with: 'Example Description')
        expect(page).to have_field('URL Content Type', with: 'CollectionURL')
        expect(page).to have_field('Type', with: 'DATA SET LANDING PAGE')
        expect(page).to have_field('URL', with: 'http://example.com')
      end

      within '.multiple.related-urls> .multiple-item-1' do
        expect(page).to have_field('Description', with: 'Example Description 2')
        expect(page).to have_field('URL Content Type', with: 'DistributionURL')
        expect(page).to have_field('Type', with: 'GET SERVICE')
        expect(page).to have_field('Subtype', with: 'DIF')
        expect(page).to have_field('URL', with: 'https://example.com/')

        expect(page).to have_field('Mime Type', with: 'Not provided')
        expect(page).to have_field('Protocol', with: 'HTTPS')
        expect(page).to have_field('Full Name', with: 'Service name')
        expect(page).to have_field('Data ID', with: 'data id')
        expect(page).to have_field('Data Type', with: 'data type')
        expect(page).to have_selector('input.uri[value="uri1"]')
        expect(page).to have_selector('input.uri[value="uri2"]')
      end
    end
  end
end

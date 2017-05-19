# MMT-292, MMT-299

require 'rails_helper'

describe 'Distribution information form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      within '.metadata' do
        click_on 'Distribution Information'
      end

      click_on 'Expand All'

      # Complete RelatedUrl fields
      add_related_urls

      # Complete Distribution fields
      within '.multiple.distributions' do
        fill_in 'Distribution Media', with: 'Online Download'
        within '.multiple.sizes' do
          fill_in 'Size', with: '42'
          select 'KB', from: 'Unit'

          click_on 'Add another Size'
          within '.multiple-item-1' do
            fill_in 'Size', with: '9001'
            select 'MB', from: 'Unit'
          end
        end
        fill_in 'Distribution Format', with: 'HDF'
        fill_in 'Fees', with: '0'

        # Add another Distribution
        click_on 'Add another Distribution'

        within '.multiple-item-1' do
          fill_in 'Distribution Media', with: 'Floppy disc'
          within '.multiple.sizes' do
            fill_in 'Size', with: '25'
            select 'TB', from: 'Unit'
          end
          fill_in 'Distribution Format', with: '.txt'
          fill_in 'Fees', with: '12.34'
        end
      end

      within '.nav-top' do
        click_on 'Save'
      end
      # output_schema_validation Draft.first.draft
      click_on 'Expand All'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Draft was successfully updated')
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

      within '.multiple.distributions > .multiple-item-0' do
        expect(page).to have_field('Distribution Media', with: 'Online Download')
        within '.multiple.sizes > .multiple-item-0' do
          expect(page).to have_field('Size', with: '42.0')
          expect(page).to have_field('Unit', with: 'KB')
        end
        within '.multiple.sizes > .multiple-item-1' do
          expect(page).to have_field('Size', with: '9001.0')
          expect(page).to have_field('Unit', with: 'MB')
        end
        expect(page).to have_field('Distribution Format', with: 'HDF')
        expect(page).to have_field('Fees', with: '0')
      end

      within '.multiple.distributions > .multiple-item-1' do
        expect(page).to have_field('Distribution Media', with: 'Floppy disc')
        within '.multiple.sizes > .multiple-item-0' do
          expect(page).to have_field('Size', with: '25.0')
          expect(page).to have_field('Unit', with: 'TB')
        end
        expect(page).to have_field('Distribution Format', with: '.txt')
        expect(page).to have_field('Fees', with: '12.34')
      end
    end
  end
end

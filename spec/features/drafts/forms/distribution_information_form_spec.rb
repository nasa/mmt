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

      open_accordions

      # Complete RelatedUrl fields
      add_related_urls(RelatedUrlFieldsHelper::DISTRIBUTION_FORM)

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
          click_on 'Distribution Information'
        end

        open_accordions
      end

      it 'populates the form with the values' do
        within '.multiple.related-urls > .multiple-item-0' do
          expect(page).to have_selector('input.url[value="http://example.com"]')
          expect(page).to have_selector('input.url[value="http://another-example.com"]')
          expect(page).to have_field('Description', with: 'Example Description')
          expect(page).to have_field('Mime Type', with: 'text/html')
          expect(page).to have_field('Title', with: 'Example Title')
          within '.file-size' do
            expect(page).to have_field('Size', with: '42.0')
            expect(page).to have_field('Unit', with: 'MB')
          end
        end

        within '.multiple.related-urls> .multiple-item-1' do
          expect(page).to have_selector('input.url[value="http://example.com/1"]')
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
end

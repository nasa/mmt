# MMT-292

require 'rails_helper'

describe 'Distribution information form', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when submitting the form' do
    before do
      click_on 'Distribution Information'

      # Complete RelatedUrl fields
      add_related_urls

      # Complete Distribution fields
      within '.multiple.distribution' do
        fill_in 'Distribution Media', with: 'Online Download'
        fill_in 'Distribution Size', with: '42 MB'
        fill_in 'Distribution Format', with: 'HDF'
        fill_in 'Fees', with: '0'

        # Add another Distribution
        click_on 'Add another Distribution'

        within '.multiple-item-1' do
          fill_in 'Distribution Media', with: 'Floppy disc'
          fill_in 'Distribution Size', with: '1.44 MB'
          fill_in 'Distribution Format', with: '.txt'
          fill_in 'Fees', with: '0'
        end
      end

      within '.nav-top' do
        click_on 'Save & Done'
      end
    end

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    # TODO MMT-299
    it 'shows the values in the draft preview page'

    context 'when returning to the form' do
      before do
        click_on 'Distribution Information'

        # Open all accordions
        script = "$('.multiple-item.is-closed').removeClass('is-closed');"
        page.evaluate_script script
      end

      it 'populates the form with the values' do
        within '.multiple.related-url' do
          within '.multiple-item-0' do
            expect(page).to have_field('URL', with: 'http://example.com')
            expect(page).to have_field('URL', with: 'http://another-example.com')
            expect(page).to have_field('Description', with: 'Example Description')
            expect(page).to have_field('Protocol', with: 'FTP')
            expect(page).to have_field('Mime Type', with: 'text/html')
            expect(page).to have_field('Caption', with: 'Example Caption')
            expect(page).to have_field('Title', with: 'Example Title')
            within '.file-size' do
              expect(page).to have_field('Size', with: '42')
              expect(page).to have_field('Unit', with: 'MB')
            end
            within '.content-type' do
              expect(page).to have_field('Type', with: 'Type')
              expect(page).to have_field('Subtype', with: 'Subtype')
            end
          end

          within '.multiple-item-1' do
            expect(page).to have_field('URL', with: 'http://example.com/1')
          end
        end

        within '.multiple.distribution' do
          within '.multiple-item-0' do
            expect(page).to have_field('Distribution Media', with: 'Online Download')
            expect(page).to have_field('Distribution Size', with: '42 MB')
            expect(page).to have_field('Distribution Format', with: 'HDF')
            expect(page).to have_field('Fees', with: '0')
          end

          within '.multiple-item-1' do
            expect(page).to have_field('Distribution Media', with: 'Floppy disc')
            expect(page).to have_field('Distribution Size', with: '1.44 MB')
            expect(page).to have_field('Distribution Format', with: '.txt')
            expect(page).to have_field('Fees', with: '0')
          end
        end

      end

    end
  end
end

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

      # Complete RelatedUrl fields
      add_related_urls

      # Complete Distribution fields
      within '.multiple.distributions' do
        fill_in 'Distribution Media', with: 'Online Download'
        fill_in 'Distribution Size', with: 4.2
        fill_in 'Distribution Format', with: 'HDF'
        fill_in 'Fees', with: '0'

        # Add another Distribution
        click_on 'Add another Distribution'

        within '.multiple-item-1' do
          fill_in 'Distribution Media', with: 'Floppy disc'
          fill_in 'Distribution Size', with: 7.5
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

    it 'shows the draft preview page' do
      expect(page).to have_content('<Untitled Collection Record> DRAFT RECORD')
    end

    it "shows pre-entered values in the draft preview page" do
      # Related URL 1
      expect(page).to have_content('http://example.com')
      expect(page).to have_content('http://another-example.com')
      expect(page).to have_content('Example Description')
      expect(page).to have_content('FTP')
      expect(page).to have_content('text/html')
      expect(page).to have_content('Example Caption')
      expect(page).to have_content('Example Title')
      expect(page).to have_content('42')
      expect(page).to have_content('MB')
      expect(page).to have_content('Type')
      expect(page).to have_content('Subtype')
      # Related Url 2
      expect(page).to have_content('http://example.com/1')

      # Distribution 1
      expect(page).to have_content('Online Download')
      expect(page).to have_content('4.2')
      expect(page).to have_content('HDF')
      expect(page).to have_content('0.0')
      # Distribution 2
      expect(page).to have_content('Floppy disc')
      expect(page).to have_content('7.5')
      expect(page).to have_content('.txt')
      expect(page).to have_content('12.34')

      expect(page).to have_content('No Temporal Coverages found')
      expect(page).to have_content('No Spatial Coordinates found')
    end

    context 'when returning to the form' do
      before do
        within '.metadata' do
          click_on 'Distribution Information'
        end

        open_accordions
      end

      it 'populates the form with the values' do
        within '.multiple.related-urls' do
          within '.multiple-item-0' do
            expect(page).to have_field('URL', with: 'http://example.com')
            expect(page).to have_field('URL', with: 'http://another-example.com')
            expect(page).to have_field('Description', with: 'Example Description')
            expect(page).to have_field('Protocol', with: 'FTP')
            expect(page).to have_field('Mime Type', with: 'text/html')
            expect(page).to have_field('Caption', with: 'Example Caption')
            expect(page).to have_field('Title', with: 'Example Title')
            within '.file-size' do
              expect(page).to have_field('Size', with: '42.0')
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

        within '.multiple.distributions' do
          within '.multiple-item-0' do
            expect(page).to have_field('Distribution Media', with: 'Online Download')
            expect(page).to have_field('Distribution Size', with: '4.2')
            expect(page).to have_field('Distribution Format', with: 'HDF')
            expect(page).to have_field('Fees', with: '0.0')
          end

          within '.multiple-item-1' do
            expect(page).to have_field('Distribution Media', with: 'Floppy disc')
            expect(page).to have_field('Distribution Size', with: '7.5')
            expect(page).to have_field('Distribution Format', with: '.txt')
            expect(page).to have_field('Fees', with: '12.34')
          end
        end

      end

    end
  end
end

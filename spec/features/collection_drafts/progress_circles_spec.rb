# MMT-32

require 'rails_helper'

describe 'Progress circles', js: true do
  context 'when viewing the preview page of an empty draft' do
    before do
      login

      visit manage_collections_path
      click_on 'Create New Record'

      within '.metadata-cta.nav-top' do
        click_on 'Done'
      end

      click_on 'Yes'
    end

    it 'displays all circles as empty' do
      expect(page).to have_no_css('.eui-icon.eui-fa-circle')
      expect(page).to have_no_css('.eui-icon.eui-check.icon-green')
      expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
    end

    context 'when viewing a form and clicking Cancel' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end

        within '.nav-top' do
          find('a.cancel').trigger('click')
          # sleep 0.1
        end
      end

      it 'displays all circles as empty' do
        expect(page).to have_no_css('.eui-icon.eui-fa-circle')
        expect(page).to have_no_css('.eui-icon.eui-check.icon-green')
        expect(page).to have_no_css('.eui-icon.eui-required.icon-green')
      end
    end

    context 'when completing a required field' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end

        fill_in 'Short Name', with: 'short_name'

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'
      end

      it 'fills in that correct circle in green' do
        within '#collection-information a[title="Short Name - Required field complete"]' do
          expect(page).to have_css('.eui-required.icon-green')
        end
      end
    end

    context 'when completing an optional field' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end

        fill_in 'Version Description', with: 'Version Description'

        within '.nav-top' do
          click_on 'Done'
        end

        click_on 'Yes'
      end

      it 'fills in that correct circle in grey' do
        within '#collection-information a[title="Version Description"]' do
          expect(page).to have_css('.eui-fa-circle.icon-grey')
        end
      end
    end

    context 'when filling in a field with invalid data' do
      before do
        within '.metadata' do
          click_on 'Related URLs', match: :first
        end

        open_accordions

        # fill in related urls wrong
        within '.multiple.related-urls' do
          fill_in 'Description', with: 'Example Description'
        end

        within '.nav-top' do
          click_on 'Done'
        end
        # Accept modal
        click_on 'Yes'
      end

      it 'fills in the correct circle in red' do
        within '#related-urls a[title="Related URLs - Invalid"]' do
          expect(page).to have_css('.eui-fa-minus-circle.icon-red')
        end
      end
    end

    context 'when clicking a circle' do
      before do
        within '#metadata-information' do
          click_on 'Metadata Language'
        end
      end

      it 'displays the correct form' do
        expect(page).to have_content('Metadata Information')
      end

      it 'opens the accordion to show the selected field' do
        expect(page).to have_content('Metadata Language')
      end
    end
  end
end

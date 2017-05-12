# MMT-32

require 'rails_helper'

describe 'Progress circles', js: true do
  context 'when viewing the preview page of an empty draft' do
    before do
      login
      create_new_draft
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
          click_on 'Distribution Information'
        end

        open_accordions

        within '.multiple.distributions' do
          fill_in 'Distribution Media', with: 'Online Download'
          within '.multiple.sizes' do
            fill_in 'Size', with: '42'
            select 'KB', from: 'Unit'
          end
          fill_in 'Distribution Format', with: 'HDF'
          fill_in 'Fees', with: '0'
        end

        within '.nav-top' do
          click_on 'Done'
        end
      end

      it 'fills in that correct circle in grey' do
        within '#distribution-information a[title="Distributions"]' do
          expect(page).to have_css('.eui-fa-circle.icon-grey')
        end
      end
    end

    context 'when filling in a field with invalid data' do
      before do
        within '.metadata' do
          click_on 'Distribution Information'
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
        within '#distribution-information a[title="Related Urls - Invalid"]' do
          expect(page).to have_css('.eui-fa-minus-circle.icon-red')
        end
      end
    end

    context 'when clicking a circle' do
      before do
        within '#distribution-information' do
          click_on 'Distributions'
        end
      end

      it 'displays the correct form' do
        expect(page).to have_content('Distribution Information')
      end

      it 'opens the accordion to show the selected field' do
        expect(page).to have_content('Distribution 1')
      end
    end
  end
end

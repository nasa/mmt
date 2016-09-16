require 'rails_helper'

describe 'Conditionally required fields', js: true do
  before do
    login
  end

  context 'when viewing an empty form' do
    before do
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    context 'when viewing a form with always required fields' do
      before do
        within '.metadata' do
          click_on 'Collection Information', match: :first
        end
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 4)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        within '.metadata' do
          click_on 'Data Contacts', match: :first
        end

        choose 'draft_data_contacts_0_data_contact_type_DataCenterContactPerson'
      end

      it 'does not display required icons' do
        expect(page).to have_no_css('label.eui-required-o')
      end

      context 'when filling in a form field that causes fields to become required' do
        before do
          fill_in 'First Name', with: 'First'
        end

        it 'displays the required icons' do
          expect(page).to have_css('label.eui-required-o', count: 2)
        end

        context 'when clearing a field that causes fields to become required' do
          before do
            fill_in 'First Name', with: ''
          end

          it 'removes the required icons' do
            expect(page).to have_no_css('label.eui-required-o')
          end
        end
      end
    end
  end

  context 'when viewing a form with data' do
    before do
      draft = create(:full_draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)
    end

    context 'when viewing a form with always required fields' do
      before do
        within '.metadata' do
          click_on 'Collection Information', match: :first
        end
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 4)
      end
    end

    context 'when viewing a form with conditionally required fields' do
      before do
        within '.metadata' do
          click_on 'Data Contacts', match: :first
        end
      end

      it 'displays the required icons' do
        expect(page).to have_css('label.eui-required-o', count: 5)
      end
    end
  end
end

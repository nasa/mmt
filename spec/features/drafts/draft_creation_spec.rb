# MMT-57

require 'rails_helper'

describe 'Draft creation', js: true do
  before do
    login
  end

  context 'when creating a new draft from scratch' do
    before do
      create_new_draft
    end

    it 'does not display a confirmation message' do
      expect(page).to have_no_content('Draft was successfully created')
    end

    it 'creates a new blank draft record' do
      expect(page).to have_content('Untitled Collection Record')
    end

    it 'does not create a new draft in the database' do
      expect(Draft.count).to eq(0)
    end

    context 'when saving data into the draft' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end

        fill_in 'Short Name', with: '123'

        within '.nav-top' do
          click_on 'Save & Done'
        end
        # Accept
        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      it 'creates a new draft in the database' do
        expect(Draft.count).to eq(1)
      end

      it 'saves the provider id into the draft' do
        expect(Draft.first.provider_id).to eq('MMT_2')
      end

      context 'when viewing the dashboard page' do
        before do
          visit '/dashboard'
        end

        it 'displays the new draft' do
          within('.open-drafts') do
            expect(page).to have_content("#{today_string} | 123")
            expect(page).to have_content('<Untitled Collection Record>')
          end
        end

        context 'when clicking on the draft title' do
          before do
            within('.open-drafts') do
              click_on '123'
            end
          end

          it 'displays the draft record page' do
            expect(page).to have_content('DRAFT RECORD')
          end
        end
      end
    end

    context 'when viewing the dashboard page' do
      before do
        visit '/dashboard'
      end

      it 'does not show any open drafts' do
        expect(page).to have_no_content('<Untitled Collection Record>')
      end
    end
  end
end

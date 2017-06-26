# MMT-57

require 'rails_helper'

describe 'Draft creation', js: true do
  before do
    login
  end

  context 'when creating a new draft from scratch' do
    before do
      visit '/manage_metadata'
      choose 'New Collection Record'
      click_on 'Create Record'
    end

    # it 'does not display a confirmation message' do
    #   expect(page).to have_no_content('Draft was successfully created')
    # end

    it 'creates a new blank draft record' do
      expect(page).to have_content('Entry Title Not Provided')
    end

    # it 'does not create a new draft in the database' do
    #   expect(Draft.count).to eq(0)
    # end

    context 'when saving data into the draft' do
      before do
        within '.metadata' do
          click_on 'Collection Information'
        end

        fill_in 'Short Name', with: '123'

        within '.nav-top' do
          click_on 'Done'
        end
        # Accept
        click_on 'Yes'
      end

      it 'displays a confirmation message' do
        expect(page).to have_content('Draft was successfully updated')
      end

      # it 'creates a new draft in the database' do
      #   expect(Draft.count).to eq(1)
      # end

      # it 'saves the provider id into the draft' do
      #   expect(Draft.first.provider_id).to eq('MMT_2')
      # end

      context 'when viewing the manage metadata page' do
        before do
          visit '/manage_metadata'
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

          it 'displays the drafts preview page' do
            expect(page).to have_content('Drafts')
            expect(page).to have_content('123')
          end
        end
      end
    end

    context 'when viewing the manage metadata page' do
      before do
        visit '/manage_metadata'
      end

      it 'does not show any open drafts' do
        expect(page).to have_no_content('<Untitled Collection Record>')
      end
    end
  end
end

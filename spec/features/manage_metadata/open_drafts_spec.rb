# MMT-57

require 'rails_helper'
# Basic draft creation and retrieval via the list on the Manage Metadata page are tested in draft_creation_spec.rb

describe 'Open Drafts listings on the Manage Metadata page', reset_provider: true do
  draft_display_max_count = 5 # Should agree with @draft_display_max_count found in manage_metadata_controller

  before do
    login
  end

  context 'when no drafts exist' do
    it 'no drafts are displayed' do # Test correct display of edge condition of zero drafts
      expect(page).to have_content('Your MMT_2 Drafts')
      within('.open-drafts') do
        expect(page).to_not have_content('|')
      end
    end
  end

  context "when more than #{draft_display_max_count} open drafts exist" do
    before do
      current_user_id = User.where(urs_uid: 'testuser').first.id
      (draft_display_max_count + 1).times do
        create(:draft, user_id: current_user_id)
      end

      visit manage_metadata_path
    end

    it '"More" is displayed' do
      within('.open-drafts') do
        expect(page).to have_link('More')
      end
    end

    context 'when "More" is clicked on' do
      before do
        within '.open-drafts' do
          click_on 'More'
        end
      end

      it 'the Your Open Drafts Page is displayed with all the open drafts' do
        expect(page).to have_content('<Blank Short Name>', count: draft_display_max_count + 1)
      end

      context 'when "<Blank Short Name>" is clicked on' do
        before do
          click_on '<Blank Short Name>', match: :first
        end

        it 'the record is opened for view/edit' do
          within '.eui-breadcrumbs' do
            expect(page).to have_content('Drafts')
          end
          expect(page).to have_content('Entry Title Not Provided')
        end
      end
    end
  end
end

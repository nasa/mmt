#MMT-57

require 'rails_helper'

draft_display_max_count = 5 # Should agree with @draft_display_max_count found in pages_controller


# Basic draft creation and retrieval via the Dashboard list are tested in draft_creation_spec.rb

describe 'Open Drafts listings' do
  before do
    login
  end

  context 'when zero open drafts exist' do
    before do
      visit '/dashboard'
    end

    it 'zero are displayed' do # Test correct display of edge condition of zero drafts
      expect(page).to have_content('Your Open Drafts')
      within('.open-drafts') do
        expect(page).to_not have_content('|')
      end
    end
  end


  context "when more than #{draft_display_max_count} open drafts exist" do
    before do
      (0..draft_display_max_count).each do
          create_new_draft
      end
      visit '/dashboard'
    end

    it '"More" is displayed' do
      within('.open-drafts') do
        expect(page).to have_content('More')
      end
    end

    context 'when "More" is clicked on' do
      before do
        within('.open-drafts') do
          click_on 'More'
        end
      end

      it 'the Your Open Drafts Page is displayed with all the open drafts' do
        expect(page.current_path).to eq '/open_drafts'
        expect(page).to have_content('<Blank Entry Id>', :count=>draft_display_max_count+1)
      end

      context 'when "<Blank Entry Id>" is clicked on' do
        before do
          click_on '<Blank Entry Id>', :match => :first
        end

        it 'the record is opened for view/edit' do
          expect(page).to have_content('Draft Record')
          expect(page).to have_content('<Untitled Collection Record>')
        end
      end

    end

  end

end

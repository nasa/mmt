require 'rails_helper'

describe 'Add another button behavior', js: true do
  context 'when viewing a form with an add another button' do
    before do
      login
      draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
      visit draft_path(draft)

      within '.metadata' do
        click_on 'Distributions'
      end
    end

    it 'displays the header index as 1' do
      expect(page).to have_content 'Distribution 1'
    end

    context 'when clicking the add another button' do
      before do
        click_on 'Add another Distribution'
      end

      it 'increments the header index' do
        expect(page).to have_content 'Distribution 2'
      end

      context 'when clicking the add another button again' do
        before do
          click_on 'Add another Distribution'
        end

        it 'increments the header index again' do
          expect(page).to have_content 'Distribution 3'
        end
      end
    end
  end
end

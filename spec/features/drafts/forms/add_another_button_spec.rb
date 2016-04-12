require 'rails_helper'

describe 'Add another button behavior', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when viewing a form with an add another button' do
    before do
      within '.metadata' do
        click_on 'Distributions'
      end
    end

    it 'displays the header index as 1' do
      expect(page).to have_content('Distribution 1')
    end

    it 'sets the toggle link index to 1' do
      expect(page).to have_css('span', text: 'Toggle Distribution 1', visible: false)
    end

    context 'when clicking the add another button' do
      before do
        find('button', text: 'Add another Distribution').trigger('click')
      end

      it 'increments the header index' do
        expect(page).to have_content('Distribution 2')
      end

      it 'increments the toggle link index' do
        expect(page).to have_css('span', text: 'Toggle Distribution 2', visible: false)
      end

      context 'when clicking the add another button again' do
        before do
          find('button', text: 'Add another Distribution').trigger('click')
        end

        it 'increments the header index again' do
          expect(page).to have_content('Distribution 3')
        end

        it 'increments the toggle link index again' do
          expect(page).to have_css('span', text: 'Toggle Distribution 3', visible: false)
        end
      end
    end
  end
end

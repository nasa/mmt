require 'rails_helper'

describe 'Add another button behavior', js: true do
  before do
    login
    draft = create(:collection_draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when viewing a form with an add another button' do
    before do
      within '.metadata' do
        click_on 'Related URLs', match: :first
      end
    end

    it 'displays the header index as 1' do
      expect(page).to have_content('Related URL 1')
    end

    it 'sets the toggle link index to 1' do
      expect(page).to have_css('span', text: 'Toggle Related URL 1', visible: false)
    end

    context 'when clicking the add another button' do
      before do
        find('button', text: 'Add another Related URL').trigger('click')
      end

      it 'increments the header index' do
        expect(page).to have_content('Related URL 2')
      end

      it 'increments the toggle link index' do
        expect(page).to have_css('span', text: 'Toggle Related URL 2', visible: false)
      end

      context 'when clicking the add another button again' do
        before do
          find('button', text: 'Add another Related URL').trigger('click')
        end

        it 'increments the header index again' do
          expect(page).to have_content('Related URL 3')
        end

        it 'increments the toggle link index again' do
          expect(page).to have_css('span', text: 'Toggle Related URL 3', visible: false)
        end
      end
    end
  end
end

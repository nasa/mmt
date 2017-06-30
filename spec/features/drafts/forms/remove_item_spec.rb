require 'rails_helper'

describe 'Remove item link behavior', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit collection_draft_path(draft)
  end

  context 'when viewing a form with add another buttons' do
    before do
      within '.metadata' do
        click_on 'Data Centers', match: :first
      end
    end

    it 'does not display the remove button for a single item' do
      within '.multiple.data-centers > .multiple-item-0' do
        within '.multiple.contact-mechanisms' do
          expect(page).to have_no_css('a.remove')
        end
      end
    end

    context 'when adding additional items to the form' do
      before do
        click_on 'Add another Contact Mechanism'

        open_accordions
      end

      it 'adds the additional item to the form' do
        within '.multiple.data-centers > .multiple-item-0' do
          within '.multiple.contact-mechanisms' do
            expect(page).to have_css('.multiple-item', count: 2)
          end
        end
      end

      context 'when removing additional items from the form' do
        before do
          within '.multiple.data-centers > .multiple-item-0' do
            within '.multiple.contact-mechanisms' do
              find('a.remove', match: :first).trigger(:click)
            end
          end
        end

        it 'removes the item and remove button from the form' do
          within '.multiple.data-centers > .multiple-item-0' do
            within '.multiple.contact-mechanisms' do
              expect(page).to have_css('.multiple-item', count: 1)
              expect(page).to have_no_css('a.remove')
            end
          end
        end
      end
    end
  end
end

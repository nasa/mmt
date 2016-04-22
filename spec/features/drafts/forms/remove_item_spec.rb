require 'rails_helper'

describe 'Remove item link behavior', js: true do
  before do
    login
    draft = create(:draft, user: User.where(urs_uid: 'testuser').first)
    visit draft_path(draft)
  end

  context 'when viewing a form with add another buttons' do
    before do
      within '.metadata' do
        click_on 'Personnel', match: :first
      end
    end

    context 'when adding additional items to the form' do
      before do
        click_on 'Add another Contact Method'
        click_on 'Add another URL'
        click_on 'Add another Related URL'

        open_accordions
      end

      it 'adds the additional items to the form' do
        within '.multiple.personnel > .multiple-item-0' do
          within '.multiple.contacts' do
            expect(page).to have_css('.multiple-item', count: 2)
          end

          within '.multiple.related-urls > .multiple-item-0' do
            expect(page).to have_css('input.url', count: 2)
          end

          expect(page).to have_css('.multiple.related-urls > .multiple-item', count: 2)
        end
      end

      context 'when removing additional items from the form' do
        before do
          within '.multiple.personnel > .multiple-item-0' do
            within '.multiple.contacts' do
              find('a.remove', match: :first).click
            end

            within '.multiple.related-urls > .multiple-item-0 .simple-multiple.urls' do
              find('a.remove', match: :first).click
            end

            within '.multiple.related-urls' do
              within '.multiple-item-1 > .eui-accordion__header' do
                find('a.remove').click
              end
            end
          end
        end

        it 'removes the items from the form' do
          within '.multiple.personnel > .multiple-item-0' do
            within '.multiple.contacts' do
              expect(page).to have_css('.multiple-item', count: 1)
            end

            within '.multiple.related-urls > .multiple-item-0' do
              expect(page).to have_css('input.url', count: 1)
            end

            expect(page).to have_css('.multiple.related-urls > .multiple-item', count: 1)
          end
        end

        it 'does not display remove links for the remaining multipe items' do
          within '.multiple.personnel > .multiple-item-0' do
            within '.multiple.contacts' do
              expect(page).to have_no_css('a.remove')
            end

            within '.multiple.related-urls' do
              within '.multiple-item-0 .simple-multiple.urls' do
                expect(page).to have_no_css('a.remove')
              end
              within '.multiple-item-0 > .eui-accordion__header' do
                expect(page).to have_no_css('a.remove')
              end
            end
          end
        end
      end
    end
  end
end

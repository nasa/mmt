require 'rails_helper'

describe 'Add members filtering', js: true do
  context 'when viewing the add members form' do
    before do
      login
      visit new_group_path
    end

    context 'when filtering with a name' do
      context 'when adding text to the filter members text field' do
        before do
          fill_in 'Filter Members', with: 'QUAIL'
        end

        it 'filters the members directory list' do
          within '#members_directory' do
            expect(page).to have_selector('option', visible: true, count: 1)
          end
        end

        context 'when removing the text from the filter members text field' do
          before do
            fill_in 'Filter Members', with: ''
          end

          it 'resets the members directory list' do
            within '#members_directory' do
              expect(page).to have_selector('option', visible: false, count: 7)
            end
          end
        end
      end
    end

    context 'when filtering with an email' do
      context 'when adding text to the filter members text field' do
        before do
          fill_in 'Filter Members', with: 'qqqq.rrrr@nasa.gov'
        end

        it 'filters the members directory list' do
          within '#members_directory' do
            expect(page).to have_selector('option', visible: true, count: 1)
          end
        end

        context 'when removing the text from the filter members text field' do
          before do
            fill_in 'Filter Members', with: ''
          end

          it 'resets the members directory list' do
            within '#members_directory' do
              expect(page).to have_selector('option', visible: true, count: 7)
            end
          end
        end
      end
    end

    context 'when filtering with a uid' do
      context 'when adding text to the filter members text field' do
        before do
          fill_in 'Filter Members', with: 'qrst'
        end

        it 'filters the members directory list' do
          within '#members_directory' do
            expect(page).to have_selector('option', visible: true, count: 1)
          end
        end

        context 'when removing the text from the filter members text field' do
          before do
            fill_in 'Filter Members', with: ''
          end

          it 'resets the members directory list' do
            within '#members_directory' do
              expect(page).to have_selector('option', visible: true, count: 7)
            end
          end
        end
      end
    end
  end
end

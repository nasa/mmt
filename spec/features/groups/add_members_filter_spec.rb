require 'rails_helper'

describe 'Groups Member Filtering', js: true do
  context 'when viewing the group form' do
    before do
      login
      
      visit new_group_path
    end

    context 'when filtering by a uid' do
      context 'when adding text to the filter members text field' do
        before do
          VCR.use_cassette('urs/search/q6ddmkhivmuhk', record: :none) do
            page.find('.select2-search__field').native.send_keys('q6ddmkhivmuhk')
            
            page.find('ul#select2-group_members-results li.select2-results__option--highlighted').click
          end
        end

        it 'filters the members directory list' do
          expect(page).to have_css('li.select2-selection__choice', count: 1)
        end
      end
    end
  end
end

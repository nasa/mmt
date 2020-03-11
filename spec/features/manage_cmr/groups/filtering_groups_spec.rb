require 'rails_helper'

describe 'Filtering groups', reset_provider: true, js: true do
  before :all do
    create_group(
      name: 'Group 1',
      description: 'test group',
      provider_id: 'MMT_2',
      members: %w(qhw5mjoxgs2vjptmvzco)
    )

    create_group(
      name: 'Group 2',
      description: 'test group 2',
      provider_id: 'MMT_2',
      members: %w(qhw5mjoxgs2vjptmvzco rarxd5taqea q6ddmkhivmuhk)
    )
  end

  context 'when viewing the groups page' do
    before do
      login

      visit groups_path
    end

    context 'when searching' do
      context 'by provider' do
        before do
          select 'MMT_2', from: 'provider-group-filter'
          click_on 'Apply Filter'
        end

        it 'displays the search params' do
          expect(page).to have_css('li.select2-selection__choice', text: 'MMT_2')

          within '.groups-table' do
            within all('tr')[1] do
              expect(page).to have_content('Group 1 test group MMT_2 1')
            end
            within all('tr')[2] do
              expect(page).to have_content('Group 2 test group 2 MMT_2 3')
            end
          end
        end
      end

      context 'by member' do
        before do
          VCR.use_cassette('urs/search/rarxd5taqea', record: :none) do
            within '#groups-member-filter' do
              page.find('.select2-search__field').native.send_keys('rarxd5taqea')
            end

            page.find('ul#select2-member-group-filter-results li.select2-results__option--highlighted').click
          end

          VCR.use_cassette('urs/search/qhw5mjoxgs2vjptmvzco', record: :none) do
            within '#groups-member-filter' do
              page.find('.select2-search__field').native.send_keys('qhw5mjoxgs2vjptmvzco')
            end

            page.find('ul#select2-member-group-filter-results li.select2-results__option--highlighted').click
          end

          VCR.use_cassette('urs/search/q6ddmkhivmuhk', record: :none) do
            within '#groups-member-filter' do
              page.find('.select2-search__field').native.send_keys('q6ddmkhivmuhk')
            end

            page.find('ul#select2-member-group-filter-results li.select2-results__option--highlighted').click
          end

          VCR.use_cassette('urs/multiple_users', record: :none) do
            click_on 'Apply Filter'
          end
        end

        it 'displays the search params' do
          expect(page).to have_css('li.select2-selection__choice', text: '06dutmtxyfxma Sppfwzsbwz ')
          expect(page).to have_css('li.select2-selection__choice', text: 'Rvrhzxhtra Vetxvbpmxf')

          within '.groups-table' do
            within all('tr')[1] do
              expect(page).to have_content('Group 2 test group 2 MMT_2 3')
            end
          end
          expect(page).to have_no_content('SEDAC Test Group')
        end
      end
    end
  end
end

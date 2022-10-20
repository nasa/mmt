require 'rails_helper'

# EDL Failed Test
describe 'Collection Search Results sorting', reset_provider: true, js: true, skip: true do
  context 'when sorting search collections results' do
    before :all do
      publish_collection_draft(short_name: 'First!', modified_date: (Time.now.utc - 5.days))

      publish_collection_draft(short_name: '0000_Aardvark Short Name')
      publish_collection_draft(short_name: 'Zimbabwe Short Name')

      publish_collection_draft(entry_title: '0000_Aardvark Entry Title')
      publish_collection_draft(entry_title: 'Zimbabwe Entry Title')

      publish_collection_draft(short_name: 'Last!', modified_date: (Time.now.utc + 5.days))
    end

    before do
      login
      visit manage_collections_path
    end

    context 'when searching by one provider' do
      before do
        fill_in 'keyword', with: 'MMT_2'
        click_on 'Search Collections'
      end

      context 'when sorting by Short Name' do
        before do
          click_on 'Sort by Short Name Asc'
        end

        it 'displays the correct search param' do
          expect(page).to have_collection_search_query(nil, 'Sort Key: Short Name Asc')
        end

        it 'sorts the results by Short Name Asc' do
          within '#search-results tbody tr:nth-child(1)' do
            expect(page).to have_content('0000_Aardvark Short Name')
          end
        end

        context 'when sorting again' do
          before do
            click_on 'Sort by Short Name Desc'
          end

          it 'displays the correct search param' do
            expect(page).to have_collection_search_query(nil, 'Sort Key: Short Name Desc')
          end

          it 'sorts the results by Short Name Desc' do
            within '#search-results tbody tr:nth-child(1)' do
              expect(page).to have_content('Zimbabwe Short Name')
            end
          end
        end
      end

      context 'when sorting by Entry Title' do
        before do
          click_on 'Sort by Entry Title Asc'
        end

        it 'displays the correct search param' do
          expect(page).to have_collection_search_query(nil, 'Sort Key: Entry Title Asc')
        end

        it 'sorts the results by Entry Title Asc' do
          within '#search-results tbody tr:nth-child(1)' do
            expect(page).to have_content('0000_Aardvark Entry Title')
          end
        end

        context 'when sorting again' do
          before do
            click_on 'Sort by Entry Title Desc'
          end

          it 'displays the correct search param' do
            expect(page).to have_collection_search_query(nil, 'Sort Key: Entry Title Desc')
          end

          it 'sorts the results by Entry Title Desc' do
            within '#search-results tbody tr:nth-child(1)' do
              expect(page).to have_content('Zimbabwe Entry Title')
            end
          end
        end
      end

      context 'when sorting by Last Modified' do
        before do
          click_on 'Sort by Last Modified Asc'
        end

        it 'displays the correct search param' do
          expect(page).to have_collection_search_query(nil, 'Sort Key: Last Modified Asc')
        end

        it 'sorts the results by Last Modified Asc' do
          within '#search-results tbody tr:nth-child(1)' do
            expect(page).to have_content('First!')
          end
        end

        context 'when sorting again' do
          before do
            click_on 'Sort by Last Modified Desc'
          end

          it 'displays the correct search param' do
            expect(page).to have_collection_search_query(nil, 'Sort Key: Last Modified Desc')
          end

          it 'sorts the results by Last Modified Desc' do
            within '#search-results tbody tr:nth-child(1)' do
              expect(page).to have_content('Last!')
            end
          end
        end
      end
    end

    context 'when searching across multiple providers' do
      before do
        fill_in 'keyword', with: ''
        click_on 'Search Collections'
      end

      context 'when sorting by Provider' do
        before do
          click_on 'Sort by Provider Asc'
        end

        it 'displays the correct search param' do
          expect(page).to have_collection_search_query(nil, 'Sort Key: Provider Id Asc')
        end

        it 'sorts the results by Provider Id Asc' do
          within '#search-results tbody' do
            expect(page).to have_content('LARC')

            expect(page).to have_no_content('SEDAC')
          end
        end

        context 'when sorting again' do
          before do
            click_on 'Sort by Provider Desc'
          end

          it 'displays the correct search param' do
            expect(page).to have_collection_search_query(nil, 'Sort Key: Provider Id Desc')
          end

          it 'sorts the results by Provider Id Desc' do
            within '#search-results tbody' do
              expect(page).to have_content('SEDAC')

              expect(page).to have_no_content('LARC')
            end
          end
        end
      end
    end
  end
end

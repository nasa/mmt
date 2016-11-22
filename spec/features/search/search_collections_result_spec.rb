# MMT-22, MMT-10, MMT-8

require 'rails_helper'

describe 'Search published results', js: true do
  let(:short_name)  { 'CIESIN_SEDAC_EPI_2008' }
  let(:version)     { '2008.00' }
  let(:entry_title) { '2008 Environmental Performance Index (EPI)' }
  let(:provider)    { 'SEDAC' }

  before :each do
    login
  end

  context 'when searching by concept_id' do
    before do
      @ingest_response, @concept = publish_draft
    end

    context 'when performing a quick find collection search' do
      before do
        fill_in 'Quick Find', with: @ingest_response['result']['concept_id']
        click_on 'Find'
      end

      it 'displays collection results' do
        expect(page).to have_search_query(1, "Keyword: #{@ingest_response['result']['concept_id']}", 'Record State: Published Records')
      end

      it 'displays expected Short Name, Entry Title and Last Modified values' do
        expect(page).to have_content(@concept['ShortName'])
        expect(page).to have_content(@concept['Version'])
        expect(page).to have_content(@concept['EntryTitle'])
        expect(page).to have_content('MMT_2')
        # expect(page).to have_content(today_string)
      end
    end

    context 'when performing a full collection search' do
      before do
        click_on 'Full Metadata Record Search'
        fill_in 'keyword', with: @ingest_response['result']['concept_id']
        click_on 'Submit'
      end

      it 'displays collection results' do
        expect(page).to have_search_query(1, "Keyword: #{@ingest_response['result']['concept_id']}", 'Record State: Published Records')
      end

      it 'displays expected data' do
        expect(page).to have_content(@concept['ShortName'])
        expect(page).to have_content(@concept['Version'])
        expect(page).to have_content(@concept['EntryTitle'])
        expect(page).to have_content('MMT_2')
        # expect(page).to have_content(today_string)
      end

      context 'when viewing the full search form' do
        before do
          click_on 'Full Metadata Record Search'
        end

        after do
          click_on 'Cancel'
        end

        it 'displays the concept id in the full search form' do
          expect(page).to have_field('keyword', with: @ingest_response['result']['concept_id'])
        end
      end
    end
  end

  # TODO: how else can this be tested?
  # context 'when performing a collection search by short name with quick find' do
  #   before do
  #     fill_in 'Quick Find', with: short_name
  #     click_on 'Find'
  #   end

  #   it 'displays collection results' do
  #     expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
  #   # end

  #   # it 'displays expected Short Name, Entry Title and Last Modified values' do
  #     expect(page).to have_content(short_name)
  #     expect(page).to have_content(version)
  #     expect(page).to have_content(entry_title)
  #     expect(page).to have_content(provider)
  #     # expect(page).to have_content(today_string)
  #   end
  # end

  context 'when performing a collection search by partial entry title with quick find' do
    # 2012 #=> 1 [0..3]
    # 2012 Environmental #=> 2 [0..17]
    # Environmental #=> 14 [5..17]
    before do
      fill_in 'Quick Find', with: entry_title[0..17]
      click_on 'Find'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{entry_title[0..17]}", 'Record State: Published Records')
    end

    it 'displays expected Short Name, Entry Title and Last Modified values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      # expect(page).to have_content(today_string)
    end
  end

  # TODO: how else can this be tested?
  # context 'when performing a quick find collection search with provider' do
  #   before do
  #     @holdings = cmr_client.get_provider_holdings(false, provider).body

  #     fill_in 'Quick Find', with: provider
  #     click_on 'Find'
  #   end

  #   it 'displays collection results' do
  #     expect(page).to have_search_query(@holdings.count, "Keyword: #{provider}", 'Record State: Published Records')
  #   # end

  #   # it 'displays expected Short Name, Entry Title and Last Modified values' do
  #     expect(page).to have_content(short_name)
  #     expect(page).to have_content(version)
  #     expect(page).to have_content(entry_title)
  #     expect(page).to have_content(provider)
  #     # expect(page).to have_content(today_string)
  #   end
  # end

  context 'when performing a full metadata search by short name' do
    before do
      full_search(keyword: short_name)
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      # expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the short name in the full search form' do
        expect(page).to have_field('keyword', with: short_name)
      end
    end
  end

  context 'when searching published records by short name' do
    before do
      full_search(keyword: short_name, record_type: 'Collections')
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{short_name}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      # expect(page).to have_content(today_string)
    end
  end

  context 'when conducting full metadata search on collections by entry title' do
    before do
      full_search(keyword: entry_title, record_type: 'Collections')
    end

    it 'displays collection results' do
      expect(page).to have_search_query(1, "Keyword: #{entry_title}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      # expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the entry title in the full search form' do
        expect(page).to have_field('keyword', with: entry_title)
      end
    end
  end

  context 'when conduction full metadata search by partial entry title' do
    before do
      click_on 'Full Metadata Record Search'
      fill_in 'keyword', with: entry_title[5..17]
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(14, "Keyword: #{entry_title[5..17]}", 'Record State: Published Records')
    end

    it 'displays expected data' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      # expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the partial entry title in the full search form' do
        expect(page).to have_field('keyword', with: entry_title[5..17])
      end
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'Full Metadata Record Search'
      select 'LARC', from: 'provider_id'
      click_on 'Submit'
    end

    it 'displays collection results' do
      expect(page).to have_search_query(34, 'Provider Id: LARC')
    end

    it 'displays expected data' do
      expect(page).to have_content('ACR3L2DM')
      expect(page).to have_content('1')
      expect(page).to have_content('ACRIM III Level 2 Daily Mean Data V001')
      expect(page).to have_content('LARC')
      # expect(page).to have_content(today_string)
    end

    context 'when viewing the full search form' do
      before do
        click_on 'Full Metadata Record Search'
      end

      after do
        click_on 'Cancel'
      end

      it 'displays the provider in the full search form' do
        expect(page).to have_field('provider_id', with: 'LARC')
      end
    end
  end

  context 'when performing a quick find search that has no results' do
    before do
      fill_in 'Quick Find', with: 'NO HITS'
      click_on 'Find'
    end
    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
  end
end

describe 'Searching published collections', js: true, reset_provider: true do
  short_name = "Search Test Collection Short Name #{Faker::Number.number(digits: 6)}"
  entry_title = '2008 Long Description for Search Test Collection'
  version = '2008'
  provider = 'MMT_2'
  granule_count = '0'
  tags_count = '0'

  before :all do
    @ingest_response, @concept_response = publish_collection_draft(short_name: short_name, entry_title: entry_title, version: version)
  end

  before do
    login
    visit manage_collections_path
  end

  context 'when performing a collection search by concept_id' do
    before do
      fill_in 'keyword', with: @ingest_response['concept-id']
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(1, "Keyword: #{@ingest_response['concept-id']}")
    end

    it 'displays expected Short Name, Entry Title, Provider, Version, Last Modified, Granule Count and Tag Count values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content(granule_count)
      end
      within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
        expect(page).to have_content(tags_count)
      end
    end
  end

  context 'when performing a collection search by short name' do
    before do
      fill_in 'keyword', with: short_name
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(1, "Keyword: #{short_name}")
    end

    it 'displays expected Short Name, Entry Title Provider, Version, Last Modified, Granule Count and Tag Count values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content(granule_count)
      end
      within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
        expect(page).to have_content(tags_count)
      end
    end
  end

  context 'when performing a collection search by entry title' do
    before do
      fill_in 'keyword', with: entry_title
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(1, "Keyword: #{entry_title}")
    end

    it 'displays expected Short Name, Entry Title, Provider, Version, Last Modified, Granule Count and Tag Count values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content(granule_count)
      end
      within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
        expect(page).to have_content(tags_count)
      end
    end
  end

  context 'when performing a collection search by partial entry title' do
    before do
      fill_in 'keyword', with: entry_title[0..17]
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(1, "Keyword: #{entry_title[0..17]}")
    end

    it 'displays expected Short Name, Entry Title, Provider, Version, Last Modified, Granule Count and Tag Count values' do
      expect(page).to have_content(short_name)
      expect(page).to have_content(version)
      expect(page).to have_content(entry_title)
      expect(page).to have_content(provider)
      expect(page).to have_content(today_string)
      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content(granule_count)
      end
      within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
        expect(page).to have_content(tags_count)
      end
    end
  end

  context 'when searching by provider' do
    before do
      click_on 'search-drop'
      select 'LARC', from: 'provider_id'
      click_on 'Search Collections'
    end

    it 'displays the query and collection results' do
      expect(page).to have_collection_search_query(29, 'Provider Id: LARC')
    end

    it 'displays expected data' do
      expect(page).to have_content('MIRCCMF')
      expect(page).to have_content('1')
      expect(page).to have_content('MISR FIRSTLOOK radiometric camera-by-camera Cloud Mask V001')
      expect(page).to have_content('LARC')
      # expect(page).to have_content(today_string)
    end
  end

  context 'when searching by short name for a collection which has a granule count' do
    before do
      fill_in 'keyword', with: 'MIRCCMF'
      click_on 'Search Collections'
    end

    it 'displays the results list with column granule count' do
      within '#search-results thead' do
        expect(page).to have_content('Granule Count')
      end

      within '#search-results tbody tr:nth-child(1) td:nth-child(5)' do
        expect(page).to have_content('1')
      end
    end
  end

  context 'when searching by short name for a collection which has a tag count' do
    search_tag_1_key = 'tag.search.example.01'
    search_tag_1_description = 'This is a search example tag'
    tag_collection_short_name = 'Collection Tagging search example 01'

    before :all do
      @ingest_response, _concept_response = publish_collection_draft(short_name: tag_collection_short_name)

      # create system group and permissions for tags
      @sys_group_response = create_group(provider_id: nil, admin: true, members: ['admin', 'adminuser'])
      @acl_concept = setup_tag_permissions(@sys_group_response['concept_id'])
      reindex_permitted_groups

      # create tags
      create_tags(search_tag_1_key, search_tag_1_description)

      # associate with a collection
      associate_tag_to_collection_by_short_name(search_tag_1_key, tag_collection_short_name)
    end

    after :all do
      remove_group_permissions(@acl_concept)
      delete_group(concept_id: @sys_group_response['concept_id'], admin: true)
      reindex_permitted_groups
    end

    before do
      fill_in 'keyword', with: tag_collection_short_name
    end

    context 'when retrieving all tag information succeeds' do
      before do
        click_on 'Search Collections'
      end

      it 'displays the results list with column tags count link' do
        within '#search-results thead' do
          expect(page).to have_content('Tag Count')
        end

        within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
          expect(page).to have_link('1', href: '#tags-modal')
        end
      end

      context 'when clicking on the Tags link' do
        before do
          within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
            click_on '1'
          end
          wait_for_jQuery
        end

        it 'displays the tags modal with the correct tag information' do
          within '#tags-modal' do
            expect(page).to have_content("Tag Key: #{search_tag_1_key}")
            expect(page).to have_content("Description: #{search_tag_1_description}")
          end
        end
      end
    end

    context "when retrieving the collection's tags fails" do
      before do
        json_fail_response = cmr_fail_response(JSON.parse('{"errors": "this is a json failure response"}'), 403)
        allow_any_instance_of(Cmr::CmrClient).to receive(:search_collections).and_return(json_fail_response)

        click_on 'Search Collections'
      end

      it 'displays an error message' do
        expect(page).to have_content('There was an error searching for Tags: this is a json failure response')
      end

      it 'displays no tags for the collection' do
        within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
          expect(page).to have_content('0')
        end
      end
    end

    context "when retrieving the collection's tags succeeds but retrieving the tag information fails" do
      before do
        click_on 'Search Collections'
      end

      it 'displays the tags link with the correct number of tags' do
        within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
          expect(page).to have_link('1', href: '#tags-modal')
        end
      end

      context 'when clicking on the Tags link' do
        before do
          tags_fail_response = cmr_fail_response(JSON.parse('{"error": "this is a tags retrieval failure response"}'), 403)
          allow_any_instance_of(Cmr::CmrClient).to receive(:get_tags).and_return(tags_fail_response)

          within '#search-results tbody tr:nth-child(1) td:nth-child(6)' do
            click_on('1')
          end
          wait_for_jQuery
        end

        it 'displays the tags modal with an error message' do
          within '#tags-modal' do
            expect(page).to have_css('.eui-banner--danger', text: 'There was an error retrieving Tag information: this is a tags retrieval failure response')
          end
        end

        it 'displays the tags modal with the tag keys but no description' do
          within '#tags-modal' do
            expect(page).to have_content("Tag Key: #{search_tag_1_key}")
            expect(page).to have_content('Description: Not retrieved')
          end
        end
      end
    end
  end

  context 'when performing a search that has no results' do
    before do
      fill_in 'keyword', with: 'NO HITS'
      click_on 'Search Collections'
    end

    it 'displays collection results' do
      expect(page).to have_content(' Results')
    end
  end
end

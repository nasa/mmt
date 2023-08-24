describe 'Collections with Tags', js: true do
  tag_1_key = 'tag.collection.example.01'
  tag_1_description = 'This is sample tag #1'
  tag_2_key = 'tag.collection.example.02'
  short_name = "Tagging Collection Example Collection 471291393"

  before(:all) do
    @token = 'jwt_access_token'
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      # ingest collection
      @ingest_response, _concept_response = publish_collection_draft(native_id: '12345678903', token: @token, revision_count: 2, short_name: short_name)
      @sys_group_response = create_group(provider_id: nil, description:'my group description', admin: true, members: ['admin'])
      @acl_concept = setup_tag_permissions(@sys_group_response['group_id'], @token)
      reindex_permitted_groups
      # create tags
      create_tags(tag_1_key, tag_1_description, @token)
      create_tags(tag_2_key, nil, @token)
      # associate with a collection
      associate_tag_to_collection_by_short_name(tag_1_key, short_name, @token)
      associate_tag_to_collection_by_short_name(tag_2_key, short_name, @token)
    end
  end

  after(:all) do
    VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
      remove_group_permissions(@acl_concept)
      delete_group(concept_id: @sys_group_response['group_id'], admin: true)
    end
    reindex_permitted_groups
  end

  context 'when viewing a collection with tags' do
    before do
      VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
        @token = 'jwt_access_token'

        login
      end
    end

    context 'when retrieving all tag information succeeds' do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          @token = 'jwt_access_token'
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          visit collection_path(@ingest_response['concept-id'], revision_id: 2)
        end
      end

      it 'does not have an error banner because of the revision_id parameter' do
        expect(page).to have_no_content('There was an error retrieving Tags for this Collection: Parameter [revision_id] was not recognized.')
      end

      it 'displays the the Tags link with the correct number of tags' do
        within '.action' do
          expect(page).to have_link('Tags (2)', href: '#tags-modal')
        end
      end

      context 'when clicking on the Tags link' do
        before do
          within '.action' do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              @token = 'jwt_access_token'
              allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
              click_on 'Tags (2)'
            end
          end
        end

        it 'displays the tags modal with the correct tag information' do
          within '#tags-modal' do
            expect(page).to have_content("Tag Key: #{tag_1_key}")
            expect(page).to have_content("Description: #{tag_1_description}")
            expect(page).to have_content("Tag Key: #{tag_2_key}")
            expect(page).to have_content('Description: Not provided')
          end
        end
      end
    end

    context "when retrieving the collection's tags fails" do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          @token = 'jwt_access_token'
          json_fail_response = cmr_fail_response(JSON.parse('{"errors": "this is a json failure response"}'), 403)
          allow_any_instance_of(Cmr::CmrClient).to receive(:search_collections).and_return(json_fail_response)
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          visit collection_path(@ingest_response['concept-id'])
        end
      end

      it 'displays an error message' do
        expect(page).to have_css('.eui-banner--danger', text: 'There was an error retrieving Tags for this Collection: this is a json failure response')
      end

      it 'displays the Tags link with no tags' do
        within '.action' do
          expect(page).to have_link('Tags (0)', href: '#tags-modal')
        end
      end

      context 'when clicking on the Tags link' do
        before do
          within '.action' do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              @token = 'jwt_access_token'
              allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
              click_on 'Tags (0)'
            end
          end
        end

        it 'displays the tags modal with no tag information' do
          within '#tags-modal' do
            expect(page).to have_content('There are no tags associated with this collection')
          end
        end
      end
    end

    context "when retrieving the collection's tags succeeds but retrieving the tag information fails", js:true do
      before do
        VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
          @token = 'jwt_access_token'
          tags_fail_response = cmr_fail_response(JSON.parse('{"error": "this is a tags retrieval failure response"}'), 403)
          allow_any_instance_of(Cmr::CmrClient).to receive(:get_tags).and_return(tags_fail_response)
          allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
          visit collection_path(@ingest_response['concept-id'])
        end
      end

      it 'displays the the Tags link with the correct number of tags' do
        within '.action' do
          expect(page).to have_link('Tags (2)', href: '#tags-modal')
        end
      end

      context 'when clicking on the Tags link' do
        before do
          within '.action' do
            VCR.use_cassette("edl/#{File.basename(__FILE__, ".rb")}_vcr", record: :none) do
              @token = 'jwt_access_token'
              allow_any_instance_of(ApplicationController).to receive(:token).and_return(@token)
              click_on 'Tags (2)'
            end
          end
        end

        it 'displays the tags modal with an error message' do
          within '#tags-modal' do
            expect(page).to have_css('.eui-banner--danger', text: 'There was an error retrieving Tag information: this is a tags retrieval failure response')
          end
        end

        it 'displays the tags modal with the tag keys but no description' do
          within '#tags-modal' do
            expect(page).to have_content("Tag Key: #{tag_1_key}")
            expect(page).to have_content('Description: Not retrieved')
            expect(page).to have_content("Tag Key: #{tag_2_key}")
            expect(page).to have_content('Description: Not retrieved')
          end
        end
      end
    end
  end
end

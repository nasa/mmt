describe 'Collections with Tags', reset_provider: true, js: true do
  tag_1_key = 'tag.collection.example.01'
  tag_1_description = 'This is sample tag #1'
  tag_2_key = 'tag.collection.example.02'
  short_name = "Tagging Collection Example Collection #{Faker::Number.number(digits: 6)}"

  before(:all) do
    # ingest collection
    @ingest_response, _concept_response = publish_collection_draft(short_name: short_name)

    # create tag(s)
    @acl_concept = setup_tag_permissions
    reindex_permitted_groups
    create_tags(tag_1_key, tag_1_description)
    create_tags(tag_2_key)

    # associate tag with collection
    associate_tag_to_collection_by_short_name(tag_1_key, short_name)
    associate_tag_to_collection_by_short_name(tag_2_key, short_name)
  end

  after(:all) do
    remove_group_permissions(@acl_concept)
    reindex_permitted_groups
  end

  context 'when viewing a collection with tags' do
    before do
      login
    end

    context 'when retrieving all tag information succeeds' do
      before do
        visit collection_path(@ingest_response['concept-id'])
      end

      it 'displays the the Tags link with the correct number of tags' do
        within '.action' do
          expect(page).to have_link('Tags (2)', href: '#tags-modal')
        end
      end

      context 'when clicking on the Tags link' do
        before do
          within '.action' do
            click_on 'Tags (2)'
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
        json_fail_response = cmr_fail_response(JSON.parse('{"errors": "this is a json failure response"}'), 403)
        allow_any_instance_of(Cmr::CmrClient).to receive(:search_collections).and_return(json_fail_response)

        visit collection_path(@ingest_response['concept-id'])
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
            click_on 'Tags (0)'
          end
        end

        it 'displays the tags modal with no tag information' do
          within '#tags-modal' do
            expect(page).to have_content('There are no tags associated with this collection')
          end
        end
      end
    end

    context "when retrieving the collection's tags succeeds but retrieving the tag information fails" do
      before do
        tags_fail_response = cmr_fail_response(JSON.parse('{"error": "this is a tags retrieval failure response"}'), 403)
        allow_any_instance_of(Cmr::CmrClient).to receive(:get_tags).and_return(tags_fail_response)

        visit collection_path(@ingest_response['concept-id'])
      end

      it 'displays the the Tags link with the correct number of tags' do
        within '.action' do
          expect(page).to have_link('Tags (2)', href: '#tags-modal')
        end
      end

      context 'when clicking on the Tags link' do
        before do
          within '.action' do
            click_on 'Tags (2)'
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

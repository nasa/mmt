describe 'Create new draft from collection', reset_provider: true do
  native_id = SecureRandom.uuid

  context 'when editing a CMR collection' do
    before do
      login
      ingest_response, @concept_response = publish_collection_draft(native_id: native_id)

      visit collection_path(ingest_response['concept-id'])

      click_on 'Edit Collection Record'
    end

    it 'displays a confirmation message' do
      expect(page).to have_content('Collection Draft Created Successfully!')
    end

    it 'creates a new draft' do
      expect(Draft.count).to eq(1)
    end

    it 'saves the provider id into the draft' do
      expect(Draft.last.provider_id).to eq('MMT_2')
    end

    it 'saves the native_id from the published collection' do
      draft = Draft.last
      expect(draft.native_id).to eq("#{native_id}")
    end

    it 'displays the draft preview page' do
      expect(page).to have_content(@concept_response.body['EntryTitle'])
    end
  end

  context 'when editing a CMR collection with associated tools and services' do
    before do
      login
      ingest_response, @concept_response = publish_collection_draft(native_id: native_id)
      @service_ingest_response, _service_concept_response = publish_service_draft
      create_service_collection_association(@service_ingest_response['concept-id'], ingest_response['concept-id'])
      @tool_ingest_response, _tool_concept_response = publish_tool_draft
      create_tool_collection_association(@tool_ingest_response['concept-id'], ingest_response['concept-id'])

      visit collection_path(ingest_response['concept-id'])
    end

    it 'has an associated tool with the correct tool record link' do
      within '#associated-tools-panel' do
        expect(page).to have_link('View Tool Record', href: "#{root_url}tools/#{@tool_ingest_response['concept-id']}")
      end
    end

    it 'has an associated service with the correct service record link' do
      within '#associated-services-panel' do
        expect(page).to have_link('View Service Record', href: "#{root_url}services/#{@service_ingest_response['concept-id']}")
      end
    end

    context 'when creating a new draft' do
      before do
        click_on 'Edit Collection Record'
      end

      it 'has an associated tool with the correct tool record link' do
        within '#associated-tools-panel' do
          expect(page).to have_link('View Tool Record', href: "#{root_url}tools/#{@tool_ingest_response['concept-id']}")
        end
      end

      it 'has an associated service with the correct service record link' do
        within '#associated-services-panel' do
          expect(page).to have_link('View Service Record', href: "#{root_url}services/#{@service_ingest_response['concept-id']}")
        end
      end
    end
  end
end

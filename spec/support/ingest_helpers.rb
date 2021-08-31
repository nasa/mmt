module Helpers
  module IngestHelpers
    # Publishes a collection draft and returns the new created collection as well as the most recent draft
    def publish_collection_draft(revision_count: 1, include_new_draft: false, provider_id: 'MMT_2', native_id: nil, modified_date: nil, short_name: nil, entry_title: nil, version: nil, collection_data_type: nil, suppress_concept_query_error: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#publish_collection_draft' do
        user = User.where(urs_uid: 'testuser').first

        #
        # Set attributes to create a draft
        #
        # Default draft attributes
        draft_attributes = {
          user: user,
          provider_id: provider_id,
          native_id: native_id || Faker::Crypto.md5
        }

        # Conditional additions to the draft attributes
        draft_attributes[:draft_short_name] = short_name unless short_name.nil?
        draft_attributes[:draft_entry_title] = entry_title unless entry_title.nil?
        draft_attributes[:version] = version unless version.nil?
        draft_attributes[:collection_data_type] = collection_data_type unless collection_data_type.nil?

        # Create a new draft with the provided attributes
        # NOTE: We don't save the draft object, there is no reason to hit the database
        # here knowing that we're going to delete it as soon as it's published anyway
        draft = build(:full_collection_draft, draft_attributes)

        # Adds metadata dates (this method saves the object)
        draft.add_metadata_dates(date: modified_date, save_record: false) unless modified_date.nil?

        #
        # ingest the draft, the specified number of times
        #
        # Only return the most recent concept
        ingest_response = nil

        revision_count.times do

          ingest_response = cmr_client.ingest_collection(draft.draft.to_json, draft.provider_id, draft.native_id, 'token')

          # We need the native id of the draft to create another draft below
          native_id = draft.native_id

          # Draft has been published, destroy it
          # draft.destroy
        end

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        # Synchronous way of waiting for CMR to complete the ingest work
        wait_for_cmr

        # Retrieve the concept from CMR so that we can create a new draft, if test requires it
        concept_id = ingest_response.body['concept-id']
        revision_id = ingest_response.body['revision-id']
        content_type = "application/#{Rails.configuration.umm_c_version}; charset=utf-8"

        concept_response = cmr_client.get_concept(concept_id, 'token', { 'Accept' => content_type }, revision_id)

        # suppress_concept_query_error flag is useful when ingesting into a prov
        # which does not have public all collection search.
        # Subscription test-query tests use this flag to ingest in NSIDC_ECS
        raise Array.wrap(concept_response.body['errors']).join(' /// ') if concept_response.body.key?('errors') unless suppress_concept_query_error

        # If the test needs an unpublished draft as well, we'll create it and return it here
        if include_new_draft
          # Create a new draft (same as editing a collection)
          CollectionDraft.create_from_collection(concept_response.body, user, native_id)
        end

        return [ingest_response.body, concept_response]
      end
    end

    # Publish a collection for progressive update feature - CMR allowing an update
    # to an existing collection that may include some existing errors if it does
    # not have new errors
    def publish_progressive_update_collection
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#publish_variable_draft' do
        user = User.where(urs_uid: 'testuser').first

        # default draft attributes
        draft_attributes = {
          user: user,
          draft_native_id: "test_progressive_update_collection_#{Faker::Number.number(digits: 6)}"
        }

        draft = build(:progressive_update_collection_first, draft_attributes)
        ingest_response = cmr_client.ingest_progressive_update_collection(draft.draft.to_json, draft.provider_id, draft.native_id)

        # Synchronous way of waiting for CMR to complete the ingest work
        wait_for_cmr

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        draft = build(:progressive_update_collection_with_errors, draft_attributes)
        ingest_response = cmr_client.ingest_progressive_update_collection(draft.draft.to_json, draft.provider_id, draft.native_id)

        # Synchronous way of waiting for CMR to complete the ingest work
        wait_for_cmr

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        ingest_response.body
      end
    end

    # Publish a variable draft
    def publish_variable_draft(provider_id: 'MMT_2', native_id: nil, name: nil, long_name: nil, science_keywords: nil, revision_count: 1, include_new_draft: false, number_revision_long_names: false, collection_concept_id:)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#publish_variable_draft' do
        user = User.where(urs_uid: 'testuser').first

        #
        # Set attributes to create a draft
        #
        # Default draft attributes
        draft_attributes = {
          user: user,
          provider_id: provider_id,
          native_id: native_id || Faker::Crypto.md5,
          collection_concept_id: collection_concept_id
        }

        # Conditional additions to the draft attribute
        draft_attributes[:draft_short_name] = name unless name.blank?
        draft_attributes[:draft_science_keywords] = science_keywords unless science_keywords.blank?
        draft_attributes[:draft_entry_title] = long_name unless long_name.blank?

        # Create a new draft with the provided attributes
        # NOTE: We don't save the draft object, there is no reason to hit the database
        # here knowing that we're going to delete it as soon as it's published anyway
        draft = build(:full_variable_draft, draft_attributes)

        #
        # ingest the draft, the specified number of times
        #
        # Only return the most recent concept
        ingest_response = nil

        revision_count.times do |i|
          # number the revision long names if the option is specified
          draft.draft['LongName'] = "#{draft_attributes[:draft_entry_title]} -- revision 0#{i + 1}" if number_revision_long_names

          ingest_response = cmr_client.ingest_variable(metadata: draft.draft.to_json, provider_id: draft.provider_id, native_id: draft.native_id, collection_concept_id: collection_concept_id, token: 'token')
        end

        # Synchronous way of waiting for CMR to complete the ingest work
        wait_for_cmr

        # Retrieve the concept from CMR so that we can create a new draft, if test requires it
        concept_id = ingest_response.body['concept-id']
        revision_id = ingest_response.body['revision-id']
        content_type = "application/#{Rails.configuration.umm_var_version}; charset=utf-8"

        concept_response = cmr_client.get_concept(concept_id, 'token', { 'Accept' => content_type }, revision_id)

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        # If the test needs an unpublished draft as well, we'll create it and return it here
        if include_new_draft
          # Create a new draft (same as editing a collection)
          VariableDraft.create_from_variable(concept_response.body, user, draft_attributes[:native_id], collection_concept_id)
        end

        [ingest_response.body, concept_response]
      end
    end

    # Publish a variable draft at umm_var_version 1.2
    def publish_variable_v1_2_draft(provider_id: 'MMT_2', native_id: nil, include_new_draft: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#publish_variable_v1_2_draft' do
        user = User.where(urs_uid: 'testuser').first

        # Default draft attributes
        draft_attributes = {
          user: user,
          provider_id: provider_id,
          native_id: native_id || Faker::Crypto.md5
        }

        draft = build(:v1_2_variable_draft, draft_attributes)

        headers_override = { 'Content-Type' => 'application/vnd.nasa.cmr.umm+json;version=1.2; charset=utf-8' }

        ingest_response = cmr_client.ingest_variable(metadata: draft.draft.to_json, provider_id: draft.provider_id, native_id: draft.native_id, token: 'token', headers_override: headers_override)

        wait_for_cmr

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        # If the test needs an unpublished draft as well, we'll create it and return it here
        if include_new_draft
          # Retrieve the concept from CMR so that we can create a new draft, if test requires it
          concept_id = ingest_response.body['concept-id']
          # we still need to use the version MMT currently supports
          content_type = "application/#{Rails.configuration.umm_var_version}; charset=utf-8"

          concept_response = cmr_client.get_concept(concept_id, 'token', { 'Accept' => content_type })

          # Create a new draft (same as editing a collection)
          VariableDraft.create_from_variable(concept_response.body, user, draft_attributes[:native_id])
        end

        ingest_response.body
      end
    end

    # Publish a service draft
    def publish_service_draft(provider_id: 'MMT_2', native_id: nil, name: nil, long_name: nil, revision_count: 1, include_new_draft: false, number_revision_long_names: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#publish_service_draft' do
        user = User.where(urs_uid: 'testuser').first

        #
        # Set attributes to create a draft
        #
        # Default draft attributes
        draft_attributes = {
          user: user,
          provider_id: provider_id,
          native_id: native_id || Faker::Crypto.md5
        }

        # Conditional additions to the draft attribute
        draft_attributes[:draft_short_name] = name unless name.blank?
        draft_attributes[:draft_entry_title] = long_name unless long_name.blank?
        # Create a new draft with the provided attributes
        # NOTE: We don't save the draft object, there is no reason to hit the database
        # here knowing that we're going to delete it as soon as it's published anyway
        draft = build(:full_service_draft, draft_attributes)

        #
        # ingest the draft, the specified number of times
        #
        # Only return the most recent concept
        ingest_response = nil

        revision_count.times do |i|
          # number the revision long names if the option is specified
          draft.draft['LongName'] = "#{draft_attributes[:draft_entry_title]} -- revision 0#{i + 1}" if number_revision_long_names

          ingest_response = cmr_client.ingest_service(metadata: draft.draft.to_json, provider_id: draft.provider_id, native_id: draft.native_id, token: 'token')
        end

        # Synchronous way of waiting for CMR to complete the ingest work
        wait_for_cmr

        # Retrieve the concept from CMR so that we can create a new draft, if test requires it
        concept_id = ingest_response.body['concept-id']
        revision_id = ingest_response.body['revision-id']
        content_type = "application/#{Rails.configuration.umm_s_version}; charset=utf-8"

        concept_response = cmr_client.get_concept(concept_id, 'token', { 'Accept' => content_type }, revision_id)

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        # If the test needs an unpublished draft as well, we'll create it and return it here
        if include_new_draft
          # Create a new draft (same as editing a collection)
          ServiceDraft.create_from_service(concept_response.body, user, draft_attributes[:native_id])
        end

        [ingest_response.body, concept_response]
      end
    end

    # Publish a service draft at umm_var_version 1.2
    def publish_service_v1_2_draft(provider_id: 'MMT_2', native_id: nil, include_new_draft: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#publish_service_v1_2_draft' do
        user = User.where(urs_uid: 'testuser').first

        # Default draft attributes
        draft_attributes = {
          user: user,
          provider_id: provider_id,
          native_id: native_id || Faker::Crypto.md5
        }

        draft = build(:v1_2_service_draft, draft_attributes)

        headers_override = { 'Content-Type' => 'application/vnd.nasa.cmr.umm+json;version=1.2; charset=utf-8' }

        ingest_response = cmr_client.ingest_service(metadata: draft.draft.to_json, provider_id: draft.provider_id, native_id: draft.native_id, token: 'token', headers_override: headers_override)

        wait_for_cmr

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        # If the test needs an unpublished draft as well, we'll create it and return it here
        if include_new_draft
          # Retrieve the concept from CMR so that we can create a new draft, if test requires it
          concept_id = ingest_response.body['concept-id']
          # we still need to use the version MMT currently supports
          content_type = "application/#{Rails.configuration.umm_s_version}; charset=utf-8"

          concept_response = cmr_client.get_concept(concept_id, 'token', { 'Accept' => content_type })

          # Create a new draft (same as editing a collection)
          ServiceDraft.create_from_service(concept_response.body, user, draft_attributes[:native_id])
        end

        ingest_response.body
      end
    end

    # Publish a tool draft
    def publish_tool_draft(provider_id: 'MMT_2', native_id: nil, name: nil, long_name: nil, revision_count: 1, include_new_draft: false, number_revision_long_names: false)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#publish_tool_draft' do
        user = User.where(urs_uid: 'testuser').first

        #
        # Set attributes to create a draft
        #
        # Default draft attributes
        draft_attributes = {
          user: user,
          provider_id: provider_id,
          native_id: native_id || Faker::Crypto.md5
        }

        # Conditional additions to the draft attribute
        draft_attributes[:draft_short_name] = name unless name.blank?
        draft_attributes[:draft_entry_title] = long_name unless long_name.blank?
        # Create a new draft with the provided attributes
        # NOTE: We don't save the draft object, there is no reason to hit the database
        # here knowing that we're going to delete it as soon as it's published anyway
        draft = build(:full_tool_draft, draft_attributes)

        #
        # ingest the draft, the specified number of times
        #
        # Only return the most recent concept
        ingest_response = nil

        revision_count.times do |i|
          # number the revision long names if the option is specified
          draft.draft['LongName'] = "#{draft_attributes[:draft_entry_title]} -- revision 0#{i + 1}" if number_revision_long_names

          ingest_response = cmr_client.ingest_tool(metadata: draft.draft.to_json, provider_id: draft.provider_id, native_id: draft.native_id, token: 'token')
        end

        # Synchronous way of waiting for CMR to complete the ingest work
        wait_for_cmr

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        # Retrieve the concept from CMR so that we can create a new draft, if test requires it
        concept_id = ingest_response.body['concept-id']
        revision_id = ingest_response.body['revision-id']
        content_type = "application/#{Rails.configuration.umm_t_version}; charset=utf-8"

        concept_response = cmr_client.get_concept(concept_id, 'token', { 'Accept' => content_type }, revision_id)


        # If the test needs an unpublished draft as well, we'll create it and return it here
        if include_new_draft
          # Create a new draft (same as editing a tool)
          ToolDraft.create_from_tool(concept_response.body, user, draft_attributes[:native_id])
        end

        # TODO: Do not need to return native_id after CMR-6332.
        [ingest_response.body, concept_response, draft_attributes[:native_id]]
      end
    end

    def publish_new_subscription(name: nil, collection_concept_id: nil, query: nil, subscriber_id: nil, email_address: nil, provider: 'MMT_2', native_id: nil, revision: 1)
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#publish_new_subscription' do
        random = SecureRandom.uuid
        subscription = {
          'Name' => name || "Test_Subscription_#{random}",
          'CollectionConceptId' => collection_concept_id || "C#{Faker::Number.number(digits: 6)}-TEST",
          'Query' => query || "bounding_box=-10,-5,10,5&attribute\[\]=float,PERCENTAGE,25.5,30&entry_title=#{random}",
          'SubscriberId' => subscriber_id || 'rarxd5taqea',
          'EmailAddress' => email_address || 'uozydogeyyyujukey@tjbh.eyyy'
        }

        ingest_response = cmr_client.ingest_subscription(subscription.to_json, provider, native_id || "mmt_subscription_#{random}", 'token')

        raise Array.wrap(ingest_response.body['errors']).join(' /// ') unless ingest_response.success?

        wait_for_cmr

        search_response = cmr_client.get_subscriptions({ 'ConceptId' => ingest_response.parsed_body['result']['concept_id'] }, 'token')

        raise Array.wrap(search_response.body['errors']).join(' /// ') unless search_response.success?

        [ingest_response.parsed_body['result'], search_response, subscription]
      end
    end

    def ingest_granules(collection_entry_title:, count:, provider: 'MMT_2')
      ActiveSupport::Notifications.instrument 'mmt.performance', activity: 'Helpers::DraftHelpers#ingest_granules' do
        granule_json = JSON.parse(File.read('spec/fixtures/granules/granule_01.json'))
        count.times do
          id = SecureRandom.uuid
          granule_json['CollectionReference'] = { 'EntryTitle' => collection_entry_title }
          granule_json['GranuleUR'] = id
          response = cmr_client.ingest_granule(granule_json.to_json, provider, "testing_subscription_#{id}")
          puts response.clean_inspect unless response.success?
        end
      end
    end
  end
end

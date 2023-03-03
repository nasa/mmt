# :nodoc:
class DataQualitySummaryAssignmentsController < ManageCmrController
  before_action :set_collections

  if Rails.configuration.use_legacy_order_service
    before_action :set_summaries, only: [:new, :edit]
  else
    before_action :set_data_quality_summaries, only: [:new, :edit]
  end

  add_breadcrumb 'Data Quality Summary Assignments', :data_quality_summary_assignments_path

  def index; end

  def new
    add_breadcrumb 'New', new_data_quality_summary_assignments_path
  end

  def edit; end

  def create
    if use_legacy_order_service?
      legacy_create
    else
      create_assignment
    end
  end

  def update
    if use_legacy_order_service?
      legacy_update
    else
      update_assignment
    end
  end

  def destroy
    if use_legacy_order_service?
      legacy_destroy
    else
      destroy_assignment
    end
  end

  def legacy_update
    # Initialize the assignments array for the view
    @assignments = []

    # Filter the collections received from CMR to those returned from the users request
    relevant_collections = @collections.select { |c| params.fetch('catalog_item_guid_toList', []).include?(c.fetch('meta', {}).fetch('concept-id', nil)) }

    # Iterate through the collections and insert relevant data to avoid additional lookups in the view
    relevant_collections.each do |collection|
      # No collection information would suggest an odd error, so skip further processing
      collection_guid = collection.fetch('meta', {}).fetch('concept-id', nil)
      next if collection_guid.nil?

      # Pull out the guid of the data quality summary definition
      assignments = begin
        # Nothing, or an error returned from the ECHO API would prevent relevant data from being available
        assignment = echo_client.get_data_quality_summary_assignments(token, collection_guid)

        Array.wrap(assignment.parsed_body.fetch('Item', []))
      rescue
        Rails.logger.error "Error retrieving data quality summary assignment for collection with guid '#{collection_guid}'"

        # In the event of an error set assignments to an empty array
        []
      end

      # Initialize the array to store the data quality summaries
      collection['data_quality_summaries'] = []

      assignments.each do |assignment_body|
        definition_details = echo_client.get_data_quality_summary_definition(token, assignment_body.fetch('DefinitionGuid', nil))

        if definition_details.error?
          Rails.logger.error("#{request.uuid} - DataQualitySummaryAssignmentsController#update - Retrieve Data Quality Summary Definition Error: #{definition_details.clean_inspect}")
          flash[:error] = I18n.t("controllers.data_quality_summary_assignments.update.flash.timeout_error", request: request.uuid) if definition_details.timeout_error?
          next
        end

        # Pull out the body so that we can append to it
        definition_body = definition_details.parsed_body

        # Append the AssignmetGuid, we need this value to delete the assignment
        definition_body['AssignmentGuid'] = assignment_body.fetch('Guid')

        # Insert the data quality summary definition json into the collection hash rather
        # than storing multiple variables and having to look it up
        collection['data_quality_summaries'] << definition_body
      end

      @assignments << collection
    end

    render action: :edit
  end

  def legacy_destroy
    success_count = 0
    error_count = 0

    params.fetch('data_quality_summary_assignment', []).each do |assignment|
      response = echo_client.remove_data_quality_summary_assignments(token, assignment)

      success_count += 1 unless response.error?
      error_count += 1 if response.error?
    end

    flash_messages = {}
    flash_messages[:success] = "Deleted #{success_count} #{'data quality summary assignment'.pluralize(success_count)} successfully." if success_count > 0
    flash_messages[:error] = "Failed to delete #{error_count} #{'data quality summary assignment'.pluralize(error_count)}." if error_count > 0
    flash_messages[:notice] = 'No data quality summary assignments provided to delete.' if error_count.zero? && success_count.zero?

    redirect_to data_quality_summary_assignments_path, flash: flash_messages
  end

  def legacy_create
    success_count = 0
    error_count = 0

    params.fetch('catalog_item_guid_toList', []).each do |catalog_item_guid|
      response = echo_client.create_data_quality_summary_assignment(token, current_provider_guid, params.fetch('definition_guid', nil), catalog_item_guid)

      success_count += 1 unless response.error?
      error_count += 1 if response.error?
    end

    flash_messages = {}
    flash_messages[:success] = "#{success_count} #{'data quality summary assignment'.pluralize(success_count)} created successfully." if success_count > 0
    flash_messages[:error] = "#{error_count} #{'data quality summary assignment'.pluralize(error_count)} failed to save." if error_count > 0

    redirect_to data_quality_summary_assignments_path, flash: flash_messages
  end

  def update_assignment
    # Initialize the assignments array for the view
    @assignments = []

    # Filter the collections received from CMR to those returned from the users request
    relevant_collections = @collections.select { |c| params.fetch('catalog_item_guid_toList', []).include?(c.fetch('meta', {}).fetch('concept-id', nil)) }

    # Iterate through the collections and insert relevant data to avoid additional lookups in the view
    relevant_collections.each do |collection|
      # No collection information would suggest an odd error, so skip further processing
      collection_guid = collection.fetch('meta', {}).fetch('concept-id', nil)
      next if collection_guid.nil?
      # Initialize the array to store the data quality summaries
      collection['data_quality_summaries'] = []
      dqs_concept_ids = collection.fetch('meta', {}).fetch('associations', {}).fetch('data-quality-summaries', [])
      dqs_concept_ids.each do |dqs_concept_id|
        dqs_response = cmr_client.get_data_quality_summaries(concept_id: dqs_concept_id, provider_id: current_user.provider_id, token: token)
        if dqs_response.error?
          Rails.logger.error("#{request.uuid} - DataQualitySummaryAssignmentsController#update_assignment - Get Data Quality Summaries Error: #{response.clean_inspect}")
          err_message = "#{response.error_message}.  Please refer to the ID: #{request.uuid} when contacting #{view_context.mail_to(Rails.configuration.support_email, 'Earthdata Support')}"
          flash[:error] = err_message
          return
        end
        dqs = dqs_response.body.fetch('items', []).first
        # Append the AssignmetGuid, we need this value to delete the assignment
        dqs['data_quality_summary_concept_id'] = dqs.fetch('meta', {}).fetch('concept-id', '') unless dqs.blank?
        # Insert the data quality summary definition json into the collection hash rather
        # than storing multiple variables and having to look it up
        collection['data_quality_summaries'] << dqs unless dqs.blank?
      end
      @assignments << collection
    end

    render action: :edit
  end

  def destroy_assignment
    success_count = 0
    error_count = 0

    params.fetch('data_quality_summary_assignment', []).each do |assignment|
      association = assignment.split('@')
      collection_concept_id = association[0]
      dqs_concept_id = association[1]
      delete_response = cmr_client.remove_collection_association(collection_concept_id: collection_concept_id, concept_id: dqs_concept_id, token: token)

      success_count += 1 unless delete_response.error?
      error_count += 1 if delete_response.error?
    end

    flash_messages = {}
    flash_messages[:success] = "Deleted #{success_count} #{'data quality summary assignment'.pluralize(success_count)} successfully." if success_count > 0
    flash_messages[:error] = "Failed to delete #{error_count} #{'data quality summary assignment'.pluralize(error_count)}." if error_count > 0
    flash_messages[:notice] = 'No data quality summary assignments provided to delete.' if error_count.zero? && success_count.zero?

    redirect_to data_quality_summary_assignments_path, flash: flash_messages
  end

  def create_assignment
    success_count = 0
    error_count = 0

    params.fetch('catalog_item_guid_toList', []).each do |catalog_item_guid|
      response = cmr_client.create_collection_association(token: token, collection_concept_id: catalog_item_guid, concept_id: params.fetch('definition_guid', ''))
      success_count += 1 unless response.error?
      error_count += 1 if response.error?
    end

    flash_messages = {}
    flash_messages[:success] = "#{success_count} #{'data quality summary assignment'.pluralize(success_count)} created successfully." if success_count > 0
    flash_messages[:error] = "#{error_count} #{'data quality summary assignment'.pluralize(error_count)} failed to save." if error_count > 0

    redirect_to data_quality_summary_assignments_path, flash: flash_messages
  end

  def set_data_quality_summaries
    response = cmr_client.get_data_quality_summaries(provider_id: current_user.provider_id, token: token)
    if response.error?
      Rails.logger.error("#{request.uuid} - DataQualitySummaryAssignmentsController#set_data_quality_summaries - Set Data Quality Summaries Error: #{response.clean_inspect}")
      err_message = "#{response.error_message}.  Please refer to the ID: #{request.uuid} when contacting #{view_context.mail_to(Rails.configuration.support_email, 'Earthdata Support')}"
      flash[:error] = err_message
      return
    end
    @summaries = response.body.fetch('items', []) unless response.error?
    @summaries = @summaries.sort_by{ |summary| summary.fetch('umm', {}).fetch('Name', '').downcase }
  end
end

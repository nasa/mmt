# :nodoc:
class DataQualitySummaryAssignmentsController < ManageCmrController
  before_action :set_collections
  before_action :set_summaries, only: [:new, :edit]

  add_breadcrumb 'Data Quality Summary Assignments', :data_quality_summary_assignments_path

  def index; end

  def new
    add_breadcrumb 'New', new_data_quality_summary_assignments_path
  end

  def edit; end

  def create
    success_count = 0
    error_count = 0

    params.fetch('catalog_item_guid_toList', []).each do |catalog_item_guid|
      response = echo_client.create_data_quality_summary_assignment(token_with_client_id, current_provider_guid, params.fetch('definition_guid', nil), catalog_item_guid)

      success_count += 1 unless response.error?
      error_count += 1 if response.error?
    end
    
    flash_messages = {}
    flash_messages[:success] = "#{success_count} #{'data quality summary assignment'.pluralize(success_count)} created successfully." if success_count > 0
    flash_messages[:error] = "#{error_count} #{'data quality summary assignment'.pluralize(error_count)} failed to save." if error_count > 0

    redirect_to data_quality_summary_assignments_path, flash: flash_messages
  end

  def update
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
        # Nothing, or an error returned from the ECHO API would prevent relavant data from being available
        assignment = echo_client.get_data_quality_summary_assignments(token_with_client_id, collection_guid)

        Array.wrap(assignment.parsed_body.fetch('Item', []))
      rescue
        Rails.logger.error "Error retrieving data quality summary assignment for collection with guid '#{collection_guid}'"
        
        # In the event of an error set assignments to an empty array
        []
      end

      # Initialize the array to store the data quality summaries
      collection['data_quality_summaries'] = []

      assignments.each do |assignment_body|
        definition_details = echo_client.get_data_quality_summary_definition(token_with_client_id, assignment_body.fetch('DefinitionGuid', nil))
        next if definition_details.error?

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

  def destroy
    success_count = 0
    error_count = 0

    params.fetch('data_quality_summary_assignment', []).each do |assignment|
      response = echo_client.remove_data_quality_summary_assignments(token_with_client_id, assignment)

      success_count += 1 unless response.error?
      error_count += 1 if response.error?
    end

    flash_messages = {}
    flash_messages[:success] = "Deleted #{success_count} #{'data quality summary assignment'.pluralize(success_count)} successfully." if success_count > 0
    flash_messages[:error] = "Failed to delete #{error_count} #{'data quality summary assignment'.pluralize(error_count)}." if error_count > 0
    flash_messages[:notice] = 'No data quality summary assignments provided to delete.' if error_count.zero? && success_count.zero?

    redirect_to data_quality_summary_assignments_path, flash: flash_messages
  end
end

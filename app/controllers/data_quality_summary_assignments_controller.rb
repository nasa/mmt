class DataQualitySummaryAssignmentsController < EchoSoapController
  before_action :set_collections
  before_action :set_summaries, only: [:new, :edit]

  def index
  end

  def new
  end

  def edit
  end

  def create
    success_count = 0
    error_count = 0

    params.fetch('catalog_item_guid', {}).each do |catalog_item_guid|
      response = echo_client.create_data_quality_summary_assignment(token_with_client_id, current_provider_guid, params.fetch('definition_guid', nil), catalog_item_guid)

      success_count += 1 unless response.error?
      error_count += 1 if response.error?
    end

    redirect_to data_quality_summary_assignments_path, notice: "#{success_count} #{'data quality summary assignment'.pluralize(success_count)} created successfully, #{error_count} #{'data quality summary assignment'.pluralize(error_count)} failed to save."
  end

  def update
    # Initialize the assignments array for the view
    @assignments = []

    # Filter the collections received from CMR to those returned from the users request
    relevant_collections = @collections.select { |c| params.fetch('catalog_item_guid', {}).include?(c.fetch('meta', {}).fetch('concept-id', nil)) }

    # Iterate through the collections and insert relevant data to avoid additional lookups in the view
    relevant_collections.each do |collection|
      # No collection information would suggest an odd error, so skip further processing
      collection_guid = collection.fetch('meta', {}).fetch('concept-id', nil)
      next if collection_guid.nil?

      # Nothing, or an error returned from the ECHO API would prevent relavant data from being available
      assignment = echo_client.get_data_quality_summary_assignments(token_with_client_id, collection_guid)
      next if assignment.error? || assignment.parsed_body.nil?

      # Pull out the guid of the data quality summary definition
      definition_guids = assignment.parsed_body.fetch('Item', {})
      definition_guids = [definition_guids] unless definition_guids.is_a?(Array)
      next if definition_guids.empty?

      # Initialize the array to store the data quality summaries
      collection['data_quality_summaries'] = []

      definition_guids.each do |definition_guid|
        definition_details = echo_client.get_data_quality_summary_definition(token_with_client_id, definition_guid.fetch('DefinitionGuid', nil))
        next if definition_details.error?

        # Insert the data quality summary definition json into the collection hash rather
        # than storing multiple variables and having to look it up
        collection['data_quality_summaries'] << definition_details.parsed_body
      end

      @assignments << collection
    end

    render action: :edit
  end
end

# :nodoc:
class ServiceOptionAssignmentsController < ManageCmrController
  add_breadcrumb 'Service Option Assignments', :service_option_assignments_path

  def index; end

  def update
    # Initialize the assignments array for the view
    @assignments = []

    assignments_response = echo_client.get_service_option_assignments_by_service(echo_provider_token, params['service_entries_toList'])

    if assignments_response.success?
      service_option_associations = Array.wrap(assignments_response.parsed_body.fetch('Item', []))

      # Collect all of the guids/ids we'll need to lookup in order to populate the table in the view
      collection_ids       = service_option_associations.map { |a| a['CatalogItemGuid'] }.compact
      service_entry_guids  = service_option_associations.map { |a| a['ServiceEntryGuid'] }.compact
      service_option_guids = service_option_associations.map { |a| a['ServiceOptionDefinitionGuid'] }.compact

      # Retrieve all collections associated with the requested service implementations
      assignment_collections_response = cmr_client.get_collections({ concept_id: collection_ids }, token)
      assignment_collections = if collection_ids.any? && assignment_collections_response.success?
                                 assignment_collections_response.body['items'] || []
                               else
                                 []
                               end

      # Retrieve all service entries associated with the requested service implementations
      assignment_service_entries_response = echo_client.get_service_entries(echo_provider_token, service_entry_guids)
      assignment_service_entries = if service_entry_guids.any? && assignment_service_entries_response.success?
                                     Array.wrap(assignment_service_entries_response.parsed_body['Item'])
                                   else
                                     []
                                   end

      # Retrieve all service options associated with the requested service implementations
      assignment_service_options_response = echo_client.get_service_options(echo_provider_token, service_option_guids)
      assignment_service_options = if service_option_guids.any? && assignment_service_options_response.success?
                                     Array.wrap(assignment_service_options_response.parsed_body['Item'])
                                   else
                                     []
                                   end

      # Use the data collected above (which we did in bulk to avoid multiple calls to ECHO) to
      # add new keys containing full objects to the assignments array that we use to populate
      # the table within the view
      service_option_associations.each do |association|
        @assignments << {
          'CatalogItem' => assignment_collections.find { |c| c.fetch('meta', {}).fetch('concept-id', nil) == association['CatalogItemGuid'] },
          'ServiceEntry' => assignment_service_entries.find { |c| c['Guid'] == association['ServiceEntryGuid'] },
          'ServiceOption' => assignment_service_options.find { |c| c['Guid'] == association['ServiceOptionDefinitionGuid'] }
        }.merge(association)
      end
    end

    render action: :edit
  end

  def destroy
    authorize :service_option_assignment

    response = echo_client.remove_service_option_assignments(echo_provider_token, params.fetch('service_option_assignment', []))

    if response.success?
      redirect_to service_option_assignments_path, flash: { success: 'Successfully deleted the selected service option assignments.' }
    else
      redirect_to service_option_assignments_path, flash: { error: response.error_message }
    end
  end
end

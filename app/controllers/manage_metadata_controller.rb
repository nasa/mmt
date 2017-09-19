# :nodoc:
class ManageMetadataController < PagesController
  include ManageMetadataHelper

  def set_variable
    @concept_id = params[:variable_id] || params[:id]
    @revision_id = params[:revision_id]

    # retrieve the variable metadata
    variable_concept_response = cmr_client.get_concept(@concept_id, token, {}, @revision_id)

    @variable = if variable_concept_response.success?
                  variable_concept_response.body
                else
                  Rails.logger.error("Error retrieving concept for Variable #{@concept_id}: #{variable_concept_response.inspect}")
                  {}
                end

    set_variable_information
  end

  def set_variable_information
    # search for variable by concept id to get the native_id and provider_id
    # if the variable is not found, try again because CMR might be a little slow to index if it is a newly published record
    attempts = 0
    while attempts < 20
      variables_search_response = cmr_client.get_variables(concept_id: @concept_id, all_revisions: true)

      variable_data = if variables_search_response.success?
                        variables_search_response.body.fetch('items', [])
                      else
                        [{}]
                      end
      variable_data.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }

      # break if revisions is wrong
      latest = variable_data.first

      if !@revision_id.nil? && latest['meta']['revision-id'].to_s != @revision_id.to_s
        @old_revision = true
      end

      break if latest && !@revision_id
      break if latest && latest['meta']['revision-id'] >= @revision_id.to_i && latest.fetch('meta', {})['concept-id'] == @concept_id
      attempts += 1
      sleep 0.05
    end

    @revisions = variable_data
    first_variable = variable_data.first

    if first_variable.blank?
      Rails.logger.error("Error searching for Variable #{@concept_id}: #{variables_search_response.inspect}")
    else
      @provider_id = first_variable.fetch('meta', {})['provider-id']
      @native_id = first_variable.fetch('meta', {})['native-id']
      @num_associated_collections = first_variable.fetch('associations', {}).fetch('collections', []).count
    end
  end

  # helper methods used by published record controller methods ensuring a user
  # has the appropriate provider context set
  def set_record_action
    @record_action =  case
                      when request.original_url.include?('edit')
                        'edit'
                      when request.original_url.include?('delete')
                        'delete'
                      when request.original_url.include?('clone')
                        'clone'
                      when request.original_url.include?('revert')
                        'revert'
                      end
  end

  def set_user_permissions
    @user_permissions = if available_provider?(@provider_id)
                          'wrong_provider'
                        else
                          'none'
                        end
  end
end

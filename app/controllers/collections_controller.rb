class CollectionsController < ApplicationController
  include CollectionsHelper

  before_action :set_collection
  before_action :ensure_correct_collection_provider, only: [:edit, :clone, :revert, :destroy]

  def show
    @language_codes = cmr_client.get_language_codes
    @draft = Draft.where(provider_id: @provider_id, native_id: @native_id).first
  end

  def edit
    draft = Draft.create_from_collection(@collection, @current_user, @native_id)
    flash[:success] = 'Draft was successfully created'
    redirect_to draft_path(draft)
  end

  def clone
    draft = Draft.create_from_collection(@collection, @current_user, nil)

    flash[:notice] = view_context.link_to 'Records must have a unique Short Name. Click here to enter a new Short Name.', draft_edit_form_path(draft, 'collection_information', anchor: 'collection-information')

    redirect_to draft_path(draft)
  end

  def destroy
    provider_id = @revisions.first['meta']['provider-id']
    delete = cmr_client.delete_collection(provider_id, @native_id, token)
    if delete.success?
      flash[:success] = 'Collection was successfully deleted'
      redirect_to collection_revisions_path(id: delete.body['concept-id'], revision_id: delete.body['revision-id'])
    else
      flash[:error] = 'Collection was not successfully deleted'
      render :show
    end
  end

  def revisions
  end

  def revert
    latest_revision_id = @revisions.first['meta']['revision-id']

    # Ingest revision
    ingested = cmr_client.ingest_collection(@metadata.to_json, @provider_id, @native_id, token)

    if ingested.success?
      flash[:success] = 'Revision was successfully created'
      redirect_to collection_revisions_path(revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest Metadata Error: #{ingested.inspect}")

      @errors = generate_ingest_errors(ingested)

      flash[:error] = 'Revision was not successfully created'
      render action: 'revisions'
    end
  end

  private

  def ensure_correct_collection_provider
    return if @provider_id == @current_user.provider_id

    case
    when request.original_url.include?('edit')
      collection_action = 'edit'
    when request.original_url.include?('clone')
      collection_action = 'clone'
    when request.original_url.include?('revert')
      collection_action = 'revert'
    when request.original_url.include?('delete')
      collection_action = 'delete'
    end

    if @current_user.available_providers.include?(@provider_id)
      concept_id = params[:id]
      revision_id = params[:revision_id] # only for revert path
      # info for params: native_id means that draft exists, no native id means draft will be created (edit/clone)
      redirect_to dashboard_path(id: concept_id, revision_id: revision_id,
        concept_id: concept_id, collection_action: collection_action)
    else
      flash[:alert] = "You don't have the appropriate permissions to #{collection_action} #{display_collection_entry_title(@collection)}"
      redirect_to dashboard_path
    end
  end
end

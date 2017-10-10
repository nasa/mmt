class CollectionsController < ManageCollectionsController
  include ManageMetadataHelper

  before_action :set_collection
  before_action :ensure_correct_collection_provider, only: [:edit, :clone, :revert, :destroy]
  before_action :set_collection_download, only: [:download_xml]

  add_breadcrumb 'Collections' # there is no collections index action, so not providing a link

  def show
    @language_codes = cmr_client.get_language_codes
    @draft = CollectionDraft.where(provider_id: @provider_id, native_id: @native_id).first

    add_breadcrumb breadcrumb_name(@collection, 'collections'), collection_path(@concept_id)
  end

  def edit
    draft = CollectionDraft.create_from_collection(@collection, current_user, @native_id)
    Rails.logger.info("Audit Log: Collection Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
    redirect_to collection_draft_path(draft), flash: { success: I18n.t('controllers.draft.collection_drafts.create.flash.success') }
  end

  def clone
    draft = CollectionDraft.create_from_collection(@collection, current_user, nil)
    Rails.logger.info("Audit Log: Cloned Collection Draft for #{draft.entry_title} was created by #{current_user.urs_uid} in provider #{current_user.provider_id}")
    flash[:notice] = view_context.link_to I18n.t('controllers.collections.clone.flash.notice'), edit_collection_draft_path(draft, 'collection_information', anchor: 'collection-information')
    redirect_to collection_draft_path(draft)
  end

  def destroy
    provider_id = @revisions.first['meta']['provider-id']
    delete = cmr_client.delete_collection(provider_id, @native_id, token)
    if delete.success?
      flash[:success] = I18n.t('controllers.collections.destroy.flash.success')
      Rails.logger.info("Audit Log: Collection with native_id #{@native_id} was deleted for #{provider_id} by #{session[:urs_uid]}")
      redirect_to collection_revisions_path(id: delete.body['concept-id'], revision_id: delete.body['revision-id'])
    else
      Rails.logger.error("Delete Collection Error: #{delete.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete Collection #{@concept_id} with native_id #{@native_id} in provider #{provider_id} but encountered an error.")

      flash[:error] = cmr_error_message(delete, i18n: I18n.t('controllers.collections.destroy.flash.error'))
      render :show
    end
  end

  def revisions
    add_breadcrumb breadcrumb_name(@collection, 'collections'), collection_path(@concept_id)
    add_breadcrumb 'Revision History', collection_revisions_path(@concept_id)
  end

  def revert
    latest_revision_id = @revisions.first['meta']['revision-id']

    # Ingest revision
    metadata = @collection_format.include?('umm+json') ? @collection.to_json : @collection
    ingested = cmr_client.ingest_collection(metadata, @provider_id, @native_id, token, @collection_format)

    if ingested.success?
      flash[:success] = I18n.t('controllers.collections.revert.flash.success')
      Rails.logger.info("Audit Log: Collection Revision for record #{@concept_id} with native_id: #{@native_id} for provider: #{@provider_id} by user #{session[:urs_uid]} has been successfully revised")
      redirect_to collection_revisions_path(revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest (Revert) Collection Error: #{ingested.inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to revert Collection #{@concept_id} by ingesting a previous revision in provider #{current_user.provider_id} but encountered an error.")

      @errors = generate_ingest_errors(ingested)
      flash[:error] = cmr_error_message(ingested, i18n: I18n.t('controllers.collections.revert.flash.error'))
      render action: 'revisions'
    end
  end

  def download_xml
    send_data @collection_download, type: 'text/xml', disposition: "attachment; filename=#{@concept_id}.#{@collection_format}"
  end

  private

  def ensure_correct_collection_provider
    return if current_provider?(@provider_id)

    set_record_action

    set_user_permissions

    render :show
  end

  def set_collection
    @concept_id = params[:id]
    @revision_id = params[:revision_id]

    set_collection_link(@concept_id)
    set_num_granules(@concept_id)

    @revisions = get_revisions(@concept_id, @revision_id)

    latest = @revisions.first

    # if there is at least one revision available
    if latest
      @native_id = latest['meta']['native-id']
      @provider_id = latest['meta']['provider-id']

      if !@revision_id.nil? && latest['meta']['revision-id'].to_s != @revision_id.to_s
        @old_revision = true
      end

      # set accept content-type as umm-json with our current umm-c version
      content_type = "application/#{Rails.configuration.umm_c_version}; charset=utf-8"
      # but if we are reverting, we should get the collection in it's native format, so set content-type appropriately
      content_type = 'application/metadata+xml; charset=utf-8' if params[:action] == 'revert'

      collection_response = cmr_client.get_concept(@concept_id, token, { 'Accept' => content_type }, @revision_id)

      @collection = collection_response.body
      @collection_format = collection_response.headers.fetch('content-type', '')
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to a blank page with a message the collection doesn't exist yet,
      # eventually auto refreshing the page would be cool
      @collection = {}
      @error = 'This collection is not available. It is either being published right now, does not exist, or you have insufficient permissions to view this collection.'
    end
  end

  def get_revisions(concept_id, revision_id)
    # this process was suggested/requested by the CMR team: if the revision is not found,
    # try again because CMR might be a little slow to index if it is a newly published revision
    attempts = 0
    while attempts < 20
      revisions_response = cmr_client.get_collections_by_post({ concept_id: concept_id, all_revisions: true }, token)
      revisions = if revisions_response.success?
                    revisions_response.body.fetch('items', [])
                  else
                    []
                  end
      revisions.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }

      latest = revisions.first
      break if latest && !revision_id
      break if latest && latest['meta']['revision-id'] >= revision_id.to_i
      attempts += 1
      sleep 0.05
    end

    revisions
  end

  def set_collection_link(concept_id)
    # collection_link used for downloading XML
    base_url = 'http://localhost:3003'
    if Rails.env.sit?
      base_url = 'https://cmr.sit.earthdata.nasa.gov/search'
    elsif Rails.env.uat?
      base_url = 'https://cmr.uat.earthdata.nasa.gov/search'
    elsif Rails.env.production?
      base_url = 'https://cmr.earthdata.nasa.gov/search'
    end
    @collection_link = "#{base_url}/concepts/#{concept_id}"
  end

  def set_collection_download
    @concept_id = params[:id]
    @collection_format = params[:format]
    revision_id = params[:revision_id]

    collection_response = cmr_client.get_collection_concept_for_download(@concept_id, @collection_format, token, revision_id)

    @collection_download = if collection_response.success?
                             collection_response.body
                           else
                             Rails.logger.error("Error retrieving concept for Collection #{@concept_id}, revision #{revision_id} in #{@collection_format} format for user #{current_user.urs_uid}")

                             error_message = "There was an error retrieving the collection metadata for Collection #{@concept_id}, revision #{revision_id} in #{@collection_format} format that you requested."
                             "<?xml version='1.0' encoding='UTF-8'?><error>#{error_message}</error>"
                           end
  end

  def set_num_granules(concept_id)
    # Get granule count, will be replaced once CMR-2053 is complete
    granule_response = cmr_client.get_granule_count(concept_id, token)

    @num_granules = if granule_response.success?
                      result = granule_response.body.fetch('feed', {}).fetch('entry', []).first
                      result.blank? ? 0 : result.fetch('granule_count', 0)
                    else
                      0
                    end
  end
end

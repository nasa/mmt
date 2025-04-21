class CollectionsController < ManageCollectionsController
  include ManageMetadataHelper
  include CmrCollectionsHelper
  include CollectionsHelper
  include LossReportHelper

  before_action :set_collection
  before_action :ensure_correct_collection_provider, only: [:edit, :clone, :revert, :destroy]
  before_action :set_tags, only: [:show, :destroy]
  before_action :set_associated_concepts, only: [:show]

  layout 'collection_preview', only: [:show]

  add_breadcrumb 'Collections' # there is no collections index action, so not providing a link

  def show
    @preview_token = create_collection_preview_token(token)
    @language_codes = cmr_client.get_language_codes

    add_breadcrumb fetch_entry_id(@collection, 'collections'), collection_path(@concept_id)

    if Rails.configuration.proposal_mode
      render 'proposal/collections/show'
    else
      @draft = CollectionDraft.where(provider_id: @provider_id, native_id: @native_id).first
      render :show
    end
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
    if (@num_granules > 0 || @num_variables > 0) && params['confirmation-text'] != DELETE_CONFIRMATION_TEXT
      flash[:error] = 'Collection was not deleted because incorrect confirmation text was provided.'
      render :show and return
    end

    provider_id = @revisions.first['meta']['provider-id']
    delete_response = cmr_client.delete_collection(provider_id, @native_id, token)
    if delete_response.success?
      flash[:success] = I18n.t('controllers.collections.destroy.flash.success')
      Rails.logger.info("Audit Log: Collection with native_id #{@native_id} was deleted for #{provider_id} by #{session[:urs_uid]}")
      redirect_to collection_revisions_path(id: delete_response.body['concept-id'], revision_id: delete_response.body['revision-id'], deleted: true)
    else
      Rails.logger.error("Delete Collection Error: #{delete_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to delete Collection #{@concept_id} with native_id #{@native_id} in provider #{provider_id} but encountered an error.")

      flash[:error] = delete_response.error_message(i18n: I18n.t('controllers.collections.destroy.flash.error'))
      render :show
    end
  end

  def revisions
    add_breadcrumb fetch_entry_id(@collection, 'collections'), collection_path(@concept_id)
    add_breadcrumb 'Revision History', collection_revisions_path(@concept_id)
  end

  def revert
    latest_revision_id = @revisions.first['meta']['revision-id']

    # Ingest revision
    metadata = @collection_format.include?('umm+json') ? @collection.to_json : @collection
    ingested_response = cmr_client.ingest_collection(metadata, @provider_id, @native_id, token, @collection_format)

    if ingested_response.success?
      flash[:success] = I18n.t('controllers.collections.revert.flash.success')
      Rails.logger.info("Audit Log: Collection Revision for record #{@concept_id} with native_id: #{@native_id} for provider: #{@provider_id} by user #{session[:urs_uid]} has been successfully revised")
      redirect_to collection_revisions_path(revision_id: latest_revision_id.to_i + 1)
    else
      Rails.logger.error("Ingest (Revert) Collection Error: #{ingested_response.clean_inspect}")
      Rails.logger.info("User #{current_user.urs_uid} attempted to revert Collection #{@concept_id} by ingesting a previous revision in provider #{current_user.provider_id} but encountered an error.")

      @ingest_errors = generate_ingest_errors(ingested_response)

      # ingest errors are handled in the view, so not needed in the flash
      flash[:error] = I18n.t('controllers.collections.revert.flash.error')
      render action: 'revisions'
    end
  end

  def download_xml
    concept_id = params[:id]
    download_format = params[:format]
    revision_id = params[:revision_id]

    collection_response = cmr_client.get_concept(concept_id, token, {}, revision_id, download_format)

    if collection_response.error?
      Rails.logger.error("Error retrieving concept for download for Collection #{concept_id}, revision #{revision_id} in #{download_format} format for user #{current_user.urs_uid}")
    end

    collection_download = collection_response.body
    content_type = collection_response.headers.fetch('content-type', '')

    send_data collection_download, type: content_type, disposition: "attachment; filename=#{concept_id}.#{download_format}"
  end

  def create_delete_proposal
    proposal = CollectionDraftProposal.create_request(collection: @collection, user: current_user, provider_id: @provider_id, native_id: @native_id, request_type: 'delete', username: session[:name])
    Rails.logger.info("Audit Log: Delete Collection Proposal Request for #{proposal.entry_title} with concept #{@concept_id} was created by #{current_user.urs_uid}")
    flash[:success] = I18n.t('controllers.collections.delete_proposal.flash.success')
    ProposalMailer.proposal_submitted_notification(get_user_info, proposal.draft['ShortName'], proposal.draft['Version'], proposal.id, proposal.request_type).deliver_now
    redirect_to collection_draft_proposal_path(proposal)
  end

  def create_update_proposal
    proposal = CollectionDraftProposal.create_request(collection: @collection, user: current_user, provider_id: @provider_id, native_id: @native_id, request_type: 'update', username: session[:name])
    Rails.logger.info("Audit Log: Update Collection Proposal Request for #{proposal.entry_title} with concept #{@concept_id} was created by #{current_user.urs_uid}")
    flash[:success] = I18n.t('controllers.collections.update_proposal.flash.success')
    redirect_to collection_draft_proposal_path(proposal)
  end

  def loss_report
    # When a user wants to use MMT to edit metadata that currently exists in a non-UMM form,
    # it's important that they're able to see if any data loss occurs in the translation to umm.
    # This method is needed to reference the appropriate helper and view for the lossiness report.
    # If translated_collections contains an :error field, the error message will appear.

    # this checks the 'hide_items' url parameter that is can be manually added. Its primary use is for developers
    # that need to debug using the text_output
    if params[:hide_items].nil? || params[:hide_items].downcase == 'true'
      hide_items = true
    elsif params[:hide_items].downcase == 'false'
      hide_items = false
    else
      translated_collections = { error: 'Unknown value for the hide_items parameter. The format should be: ".../loss_report.text?hide_items=true" or ".../loss_report.text?hide_items=false"' }
    end

    translated_collections ||= prepare_translated_collections

    respond_to do |format|
      if translated_collections[:error]
        format.text { render plain: translated_collections[:error] }
        format.json { render json: JSON.pretty_generate(translated_collections) }
      else
        format.text { render plain: loss_report_output(translated_collections: translated_collections, hide_items: hide_items, display: 'text') }
        format.json { render json: JSON.pretty_generate(loss_report_output(translated_collections: translated_collections, hide_items: hide_items, display: 'json')) }
      end
    end
  end

  private

  def ensure_correct_collection_provider
    return if current_provider?(@provider_id)

    set_record_action

    set_user_permissions

    set_tags

    render :show
  end

  def prepare_translated_collections
    original_collection_native_xml = cmr_client.get_concept(params[:id], token, {})
    return { error: 'Failed to retrieve collection from CMR' } unless original_collection_native_xml.success?

    content_type = original_collection_native_xml.headers.fetch('content-type').split(';')[0]
    return { error: 'This collection is already in UMM format so there is no loss report' } if content_type.include?('application/vnd.nasa.cmr.umm+json')
    translated_collection_native_xml = cmr_client.translate_collection(JSON.pretty_generate(@collection), "application/#{Rails.configuration.umm_c_version}; charset=utf-8", content_type, skip_validation=true)
    return { error: 'Failed to translate collection from UMM back to native format' } unless translated_collection_native_xml.success?

    return {
      original_collection_native_xml: original_collection_native_xml.body,
      translated_collection_native_xml: translated_collection_native_xml.body,
      original_collection_native_hash: Hash.from_xml(original_collection_native_xml.body),
      translated_collection_native_hash: Hash.from_xml(translated_collection_native_xml.body),
      native_format: content_type
    }
  end

  def set_collection
    @concept_id = params[:id]
    @revision_id = params[:revision_id]

    @revisions = get_revisions(@concept_id, @revision_id)

    latest = @revisions.first

    # if there is at least one revision available
    if latest
      meta = latest.fetch('meta', {})
      @native_id = meta['native-id']
      @provider_id = meta['provider-id']
      @num_granules = meta['granule-count']
      @num_variables = meta.fetch('associations', {}).fetch('variables', []).count

      # set up the @download_xml_options so that the Native format is specified and appears first
      @download_xml_options = CollectionsHelper::DOWNLOAD_XML_OPTIONS.deep_dup
      native_format = meta['format']
      if native_format.present?
        @download_xml_options.each do |download_option|
          # gsub here is needed because of the iso-smap and application/iso:smap+xml format options
          if native_format.gsub(':','').include?(download_option[:format].gsub('-', ''))
            download_option[:title].concat(' (Native)')
            @download_xml_options.delete(download_option)
            @download_xml_options.unshift(download_option)
            break
          end
        end
      end

      @old_revision = !@revision_id.nil? && meta['revision-id'].to_s != @revision_id.to_s ? true : false

      # set accept content-type as umm-json with our current umm-c version
      content_type = "application/#{Rails.configuration.umm_c_version}; charset=utf-8"
      # but if we are reverting, we should get the collection in it's native format, so set content-type appropriately
      content_type = 'application/metadata+xml; charset=utf-8' if params[:action] == 'revert'

      collection_response = cmr_client.get_concept(@concept_id, token, { 'Accept' => content_type }, @revision_id)
      if (params[:deleted] == 'true') && (collection_response.body['errors'].first.include? 'represents a deleted concept and does not contain metadata')
        collection_response = cmr_client.get_concept(@concept_id, token, { 'Accept' => content_type }, select_revision)
      end

      if collection_response.success?
        @collection = collection_response.body
        @collection_format = collection_response.headers.fetch('content-type', '')
      else
        Rails.logger.error("Error retrieving collection #{@concept_id} in `set_collection`: #{collection_response.clean_inspect}")
        set_collection_error_data
      end
    else
      # concept wasn't found, CMR might be a little slow
      # Take the user to a blank page with a message the collection doesn't exist yet,
      # eventually auto refreshing the page would be cool
      set_collection_error_data
      # there is no latest, so error logging happens in `get_revisions`
    end
  end

  def set_collection_error_data
    @collection = {}
    @collection_format = ''
    @error = 'This collection is not available. It is either being published right now, does not exist, or you have insufficient permissions to view this collection.'
  end

  def proposal_mode_enabled?
    if %w[show download_xml].include?(params['action'])
      # actions available in both dMMT and MMT
      multi_mode_actions_allowed?
    elsif %w[create_delete_proposal create_update_proposal].include?(params['action'])
      # actions available in dMMT to users and approvers
      proposal_mode_all_user_actions_allowed?
    else
      # actions available in MMT
      super
    end
  end

  def select_revision
    selected = @revisions.select { |r| r.fetch('meta')['revision-id'] && r.fetch('meta')['deleted'] == false && r.fetch('meta')['revision-id'].to_i < @revision_id.to_i }.first
    selected.blank? ?  nil : selected.fetch('meta')['revision-id']
  end

  def set_tags
    @num_tags = 0

    # TODO: when CMR-6655 is worked we should have all this tag information in the
    # .umm-json response, and this can be streamlined in MMT-2359
    collection_json_response = cmr_client.search_collections({ concept_id: @concept_id, include_tags: '*' }, token)
    if collection_json_response.success?
      @tag_keys = collection_json_response.body.dig('feed', 'entry', 0, 'tags')&.keys || []
      @num_tags = @tag_keys.count

      unless @tag_keys.blank?
        cmr_tag_response = cmr_client.get_tags({ tag_key: @tag_keys }, token)
        if cmr_tag_response.success?
          @tags_info = cmr_tag_response.body['items']
        else
          Rails.logger.error("Retrieve Tag #{@tag_keys} Error: #{cmr_tag_response.clean_inspect}")

          @tags_error = cmr_tag_response.error_message(i18n: I18n.t('controllers.collections.set_tags.get_tags.error'))
        end
      end
    else
      Rails.logger.error("Error searching for collection #{@concept_id} revision #{@revision_id || 'no revision provided'} in `set_tags`: #{collection_json_response.clean_inspect}")
      # if this call failed, num_tags will be 0 and we will display this flash message
      flash[:error] = "There was an error retrieving Tags for this Collection: #{collection_json_response.error_message(i18n: I18n.t('controllers.collections.set_tags.search_collections.error'))}"
    end
  end

  def set_associated_concepts
    get_associated_concepts(@revisions)
  end
end

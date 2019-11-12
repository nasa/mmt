# :nodoc:
class ManageCollectionsController < ManageMetadataController
  include BulkUpdates

  def show
    # If you change this number you must also change it in the corresponding test file - features/manage_collections/open_drafts_spec.rb.
    @draft_display_max_count = 5

    @drafts = policy_scope(CollectionDraft).order('updated_at DESC')
                                           .limit(@draft_display_max_count + 1)
    @templates = {}
    templates = policy_scope(CollectionTemplate).order('updated_at DESC')
    templates.each do |template|
      @templates[template.display_template_name] = template['id']
    end

    @bulk_updates = retrieve_bulk_updates.take(@draft_display_max_count + 1)
  end

  def make_new_draft
    if params['base'] == 'blank'
      redirect_to new_collection_draft_path
    elsif params['base'] == 'template'
      if params['template_id'].blank?
        flash[:error] = 'Collection draft was not created successfully. Select a template.'
        redirect_to manage_collections_path and return
      end
      redirect_to create_draft_collection_template_path(params['template_id'])
    end
  end
end

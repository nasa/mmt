# :nodoc:
class ServicesController < BaseManageController
  include ManageMetadataHelper

  before_action :set_service, only: %i[show edit clone destroy revisions revert download_json]
  before_action :set_schema, only: %i[show edit clone destroy]
  before_action :ensure_correct_service_provider, only: %i[edit clone destroy]
  before_action :set_preview, only: [:show]

  # there is no variables index action, so not providing a link
  add_breadcrumb 'Services'

  # https://stackoverflow.com/questions/34735540/action-defined-in-applicationcontroller-can-not-be-found
  def clone
    super
  end

  private

  def set_schema
    @schema = UmmJsonSchema.new('services', 'umm-s-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_preview
    @preview = UmmPreview.new(
      schema_type: 'service',
      preview_filename: 'umm-s-preview.json',
      data: @service
    )
  end

  def ensure_correct_service_provider
    return if current_provider?(@provider_id)

    set_record_action

    set_user_permissions

    set_preview

    render :show
  end
end

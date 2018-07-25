# :nodoc:
class VariablesController < BaseManageController
  include ManageMetadataHelper

  before_action :set_variable, only: %i[show edit clone destroy revisions revert download_json]
  before_action :set_schema, only: %i[show edit clone destroy]
  before_action :set_form, only: %i[show edit clone destroy]
  before_action :ensure_correct_variable_provider, only: %i[edit clone destroy]
  before_action :set_preview, only: [:show]

  # there is no variables index action, so not providing a link
  add_breadcrumb 'Variables'

  # https://stackoverflow.com/questions/34735540/action-defined-in-applicationcontroller-can-not-be-found
  def clone
    super
  end

  private

  def set_schema
    @schema = UmmJsonSchema.new('variables', 'umm-var-json-schema.json')
    @schema.fetch_references(@schema.parsed_json)
  end

  def set_form
    @json_form = UmmJsonForm.new('variables', 'umm-var-form.json', @schema, @variable, field_prefix: 'variable_draft/draft')
  end

  def set_preview
    @preview = UmmPreview.new(
      schema_type: 'variable',
      preview_filename: 'umm-var-preview.json',
      data: @variable
    )
  end

  def ensure_correct_variable_provider
    return if current_provider?(@provider_id)

    set_record_action

    set_user_permissions

    set_preview

    render :show
  end

  def draft_path(draft)
    variable_draft_path(draft)
  end

  def create_from
    VariableDraft.create_from_variable(@variable, current_user, @native_id)
  end
end

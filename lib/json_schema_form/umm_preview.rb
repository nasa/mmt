module JsonSchemaForm
  # :nodoc:
  class UmmPreview < JsonFile
    include ActionView::Context
    include ActionView::Helpers::FormTagHelper
    include ActionView::Helpers::TagHelper
    include ActionView::Helpers::TextHelper
    include Rails.application.routes.url_helpers

    attr_accessor :data, :forms, :draft_id, :sidebars

    # schema_type:      published_resource_name (service/variable)
    # preview_filename: filename for the preview json file (umm-s-preview.json)
    # data:             metadata to be displayed
    # draft_id:         id of the draft being displayed, not used for published records
    def initialize(schema_type:, preview_filename:, data:, draft_id: nil)
      super(schema_type.pluralize, preview_filename)

      # loop through the preview json file and create a new UmmPreviewForm for each form
      @forms = parsed_json.fetch('forms', []).map { |preview_json| JsonSchemaForm::UmmPreviewElements::UmmPreviewForm.new(schema_type: schema_type, preview_json: preview_json, data: data, draft_id: draft_id) }
      @sidebars = parsed_json.fetch('sidebars', []).map { |preview_json| JsonSchemaForm::UmmPreviewElements::UmmPreviewForm.new(schema_type: schema_type, preview_json: preview_json, data: data, draft_id: draft_id) }
    end
  end
end

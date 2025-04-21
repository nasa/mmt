module JsonSchemaForm
  module UmmPreviewElements
    # Provides the correct keyword levels to render a service keyword string

    # :nodoc:
    class UmmPreviewToolKeyword < UmmPreviewKeyword
      KEYWORD_LEVELS = %w(
        ToolCategory
        ToolTopic
        ToolTerm
        ToolSpecificTerm
      ).freeze
    end
  end
end
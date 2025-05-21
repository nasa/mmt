module JsonSchemaForm
  module UmmPreviewElements
    # Provides the correct keyword levels to render a science keyword string

    # :nodoc:
    class UmmPreviewScienceKeyword < UmmPreviewKeyword
      KEYWORD_LEVELS = %w(
        Category
        Topic
        Term
        VariableLevel1
        VariableLevel2
        VariableLevel3
        DetailedVariable
      ).freeze
    end
  end
end

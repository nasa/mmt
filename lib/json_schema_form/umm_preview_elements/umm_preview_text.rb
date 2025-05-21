module JsonSchemaForm
  module UmmPreviewElements
    # render basic data in a <p> tag

    # :nodoc:
    class UmmPreviewText < UmmPreviewElement
      def render
        content_tag(:p, element_value)
      end
    end
  end
end

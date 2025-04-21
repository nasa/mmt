module JsonSchemaForm
  module UmmPreviewElements
    # render basic data as a link
    # Used in UMM-S for URL::URLValue

    # :nodoc:
    class UmmPreviewLink < UmmPreviewElement
      def render
        title = 'Use Service API' if schema_type == 'service' && full_key == 'URL/URLValue'
        valid_url = validate_link_url(element_value)

        if valid_url
          link_to element_value, element_value, title: title
        else
          content_tag(:p, element_value)
        end
      end

      # Return nil if cannot be parsed as a URI or if URI does not have a protocol/
      # scheme.
      def validate_link_url(url)
        begin
          url if URI.parse(url).scheme
        rescue URI::InvalidURIError
          nil
        end
      end
    end
  end
end

module JsonSchemaForm
  module UmmPreviewElements
    # Renders a controlled keyword stylized display

    # :nodoc:
    class UmmPreviewKeyword < UmmPreviewElement
      KEYWORD_LEVELS = [].freeze

      def render
        capture do
          render_preview_link_to_draft_form unless draft_id.nil?

          element_value.each do |keyword|
            concat(content_tag(:ul, class: 'arrow-tag-group-list') do
              self.class::KEYWORD_LEVELS.each do |level|
                unless keyword[level].blank?
                  concat content_tag(:li, keyword[level], itemprop: 'keyword', class: 'arrow-tag-group-item')
                end
              end
            end)
          end
        end
      end
    end
  end
end

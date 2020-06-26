# render basic data as a link
# Used in UMM-S for URL::URLValue

# :nodoc:
class UmmPreviewLink < UmmPreviewElement
  def render
    title = 'Use Service API' if schema_type == 'service' && full_key == 'URL/URLValue'
    link_to element_value, element_value, title: title
  end
end
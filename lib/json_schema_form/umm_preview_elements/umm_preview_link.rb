# render basic data as a link
# Used in UMM-S for URL::URLValue

# :nodoc:
class UmmPreviewLink < UmmPreviewElement
  def render
    title = 'USE SERVICE API' if schema_type == 'service'
    link_to element_value, element_value, title: title
  end
end
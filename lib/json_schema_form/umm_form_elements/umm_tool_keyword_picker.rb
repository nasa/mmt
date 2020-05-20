# UmmToolKeywordPicker for v1.0 is essentially the same as UmmServiceKeywordPicker
# with minor modifications because it is populated with the same set of
# Service Keywords. This is supposed to change in the future.

# :nodoc
class UmmToolKeywordPicker < UmmServiceKeywordPicker
  def keyword_type
    'tool'
  end
end

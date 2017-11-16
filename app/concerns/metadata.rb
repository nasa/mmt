# :nodoc:
module Metadata
  extend ActiveSupport::Concern

  def compact_blank(node)
    return node.map { |n| compact_blank(n) }.compact.presence if node.is_a?(Array)
    return node if node == false
    return node.presence unless node.is_a?(Hash)
    result = {}
    node.each do |k, v|
      result[k] = compact_blank(v)
    end
    result = result.compact
    result.compact.presence
  end
end

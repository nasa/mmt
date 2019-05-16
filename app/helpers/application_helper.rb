# :nodoc:
module ApplicationHelper
  def flash_class(type)
    case type.to_sym
    when :success
      'eui-banner--success'
    when :error
      'eui-banner--danger'
    when :alert
      'eui-banner--warn'
    when :notice
      'eui-banner--info'
    else
      type.to_s
    end
  end

  # Returns an appropriate TH tag for the provided actions that are provided
  # given a users access.
  def actions_table_header(actions)
    return if actions.empty?

    content_tag :th, 'Actions', colspan: (actions.count if actions.count > 1)
  end
end

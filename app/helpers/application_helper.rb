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

  # Simple method to time a block and log its elapsed time in logs
  def time(name, &block)
    start = Time.new
    Rails.logger.info("Starting #{name}")
    return_value = block.call
    stop = Time.new
    Rails.logger.info("Finished #{name} - elapsed time is #{stop-start} secs.")
    return_value
  end

end

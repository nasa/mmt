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
end

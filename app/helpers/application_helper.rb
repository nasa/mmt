module ApplicationHelper
  def flash_class(type)
    case type.to_sym
    when :success
      'banner-success'
    when :error
      'banner-danger'
    when :alert
      'banner-warn'
    when :notice
      'banner-info'
    else
      type.to_s
    end
  end
end

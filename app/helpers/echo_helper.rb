# :nodoc:
module EchoHelper
  def echo_formatted_date(date, format: '%A, %B %d, %Y at %l:%M %P', default: nil)
    DateTime.parse(date).strftime(format)
  rescue
    default || date.to_s
  end
end

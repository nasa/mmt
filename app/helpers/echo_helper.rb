module EchoHelper
  def echo_formatted_date(date, format: '%A, %B %d, %Y at %l:%M %P')
    DateTime.parse(date).strftime(format)
  rescue
    date.to_s
  end
end

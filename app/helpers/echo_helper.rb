# :nodoc:
module EchoHelper
  def echo_formatted_date(date, default: nil)
    DateTime.parse(date).to_fs(:echo_format)
  rescue
    default || date.to_s
  end
end

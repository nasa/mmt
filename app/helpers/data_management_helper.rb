# Methods to assist the ECHO SOAP API services
module DataManagementHelper
  # Echo expect well formatted XHTML but Redactor (WYSIWYG) does not provide this. The only
  # issue found thus far is unclosed, self-closing tags, so here we close them
  def sanitize_for_echo(html)
    html.gsub(/<(|br|hr)\s*>/, '<\1/>')
  end
end

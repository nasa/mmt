class CspController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :report_csp_violation
  skip_before_action :ensure_user_is_logged_in
  skip_before_action :setup_query
  skip_before_action :provider_set?
  skip_before_action :proposal_mode_enabled?
  skip_before_action :proposal_approver_permissions

  # Logs Content Security Policy (CSP) violation reports that are received from the user's browser.  
  def report_csp_violation
    report = JSON.parse(request.body.read)['csp-report']
    browser = Browser.new(request.headers['User-Agent'], accept_language: "en-us")
    Rails.logger.debug("CSP violation_report | violated_directive=#{report['violated-directive']}|effective-directive=#{report['effective-directive']}|disposition=#{report['disposition']}|blocked-uri=#{report['blocked-uri']}|document-uri=#{report['document-uri']}|source-file=#{report['source-file']}|line-number=#{report['line-number']}|column-number=#{report['column-number']}|status-code=#{report['status-code']}|referrer=#{report['referrer']}|browser=#{browser.name}|browser_version=#{browser.full_version}|MMT_version=#{Rails.configuration.version}")
    head :ok
  end
end

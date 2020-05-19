# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy


if Rails.configuration.csplog_enabled 
  # Report CSP violations to a specified URI
  Rails.application.config.content_security_policy_report_only = true

  Rails.application.config.content_security_policy do |policy|
  ##  Enable all directives supported by Rails 5.2
    policy.base_uri :self, :https
    policy.child_src :self, :https
    policy.connect_src :self, :https
    policy.default_src :self, :https, :http
    policy.font_src :self, :https, :http, :data
    policy.form_action :self, :https
    policy.frame_ancestors :self, :https
    policy.frame_src :self, :https
    policy.img_src :self, :https, :http
    policy.manifest_src :self, :https, :http
    policy.media_src :self, :https
    policy.object_src :none
    policy.script_src :self, :https, :http
    policy.style_src :self, :https, :http
    policy.worker_src :self, :https
    
    # Specify URI for violation reports
    policy.report_uri "/crpt"
  end
end

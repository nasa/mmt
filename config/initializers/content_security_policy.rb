# Be sure to restart your server when you modify this file.
# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy


if Rails.configuration.csplog_enabled
  # Report CSP violations to a specified URI
  Rails.application.config.content_security_policy_report_only = true

  Rails.application.config.content_security_policy do |policy|
    ##  Enable all directives supported by Rails 5.2
    policy.base_uri 'self'
    policy.child_src 'self'
    policy.connect_src 'self', '*.earthdata.nasa.gov', '*.sit.earthdata.nasa.gov', '*.uat.earthdata.nasa.gov'
    policy.default_src 'self', '*.earthdata.nasa.gov', '*.sit.earthdata.nasa.gov', '*.uat.earthdata.nasa.gov', 'https://fonts.googleapis.com'
    policy.font_src 'self', '*.earthdata.nasa.gov', '*.sit.earthdata.nasa.gov', '*.uat.earthdata.nasa.gov', 'https://fonts.googleapis.com'
    policy.form_action 'self'
    policy.frame_ancestors 'self'
    policy.frame_src 'self'
    policy.img_src 'self', '*.earthdata.nasa.gov', '*.sit.earthdata.nasa.gov', '*.uat.earthdata.nasa.gov', 'https://fonts.googleapis.com'
    policy.manifest_src 'self'
    policy.media_src 'self'
    policy.object_src :none
    policy.script_src 'self'
    policy.script_src 'self', '*.earthdata.nasa.gov', '*.sit.earthdata.nasa.gov', '*.uat.earthdata.nasa.gov'
    policy.style_src 'self', '*.earthdata.nasa.gov'
    policy.worker_src 'self'

    # Specify URI for violation reports
    policy.report_uri '/report_csp_violation'
  end
end

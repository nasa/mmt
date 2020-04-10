class ApplicationMailer < ActionMailer::Base
  default from: "no-reply@#{Rails.configuration.default_email_domain}"
  layout 'mailer'

  def env_if_needed
    Rails.env.production? ? nil : " (#{Rails.env})"
  end
end

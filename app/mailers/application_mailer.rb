class ApplicationMailer < ActionMailer::Base
  default from: "no-reply@#{Rails.configuration.default_email_domain}"
  layout 'mailer'
  before_action :env_if_needed

  def env_if_needed
    @email_env_note = Rails.env.production? ? nil : "(#{Rails.env})"
  end
end

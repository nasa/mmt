class ApplicationMailer < ActionMailer::Base
  default from: "no-reply@#{Rails.configuration.default_email_domain}"
  layout 'mailer'
end

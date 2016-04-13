class ApplicationMailer < ActionMailer::Base
  default from: 'no-reply@mmt.nasa.gov'
  layout 'mailer'
end

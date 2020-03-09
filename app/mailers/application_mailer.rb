class ApplicationMailer < ActionMailer::Base
  default from: 'no-reply@earthdata.nasa.gov'
  layout 'mailer'
end

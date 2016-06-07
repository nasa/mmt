class ApplicationMailer < ActionMailer::Base
  default from: 'no-reply@mmt.earthdata.nasa.gov'
  layout 'mailer'
end

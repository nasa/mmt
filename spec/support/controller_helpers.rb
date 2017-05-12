module Helpers
  # :nodoc:
  module ControllerHelpers
    def sign_in(as = nil)
      allow(controller).to receive(:logged_in?).and_return(true)

      # Anything greater than 0 will do the trick
      allow(controller).to receive(:server_session_expires_in).and_return(1)

      user = as || FactoryGirl.build(:user)
      allow(controller).to receive(:current_user).and_return(user)
    end
  end
end

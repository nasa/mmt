module Pundit
  # :nodoc:
  class UserContext
    attr_reader :user, :token

    def initialize(user, token)
      @user = user
      @token = token
    end
  end
end

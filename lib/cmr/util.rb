module Cmr
  module Util
    # Times and logs execution of a block
    def self.time(logger, message, &block)
      start = Time.now
      result = yield
    ensure
      if message.is_a?(Proc)
        message.call(Time.now-start, result)
      else
        logger.info("#{message} [#{Time.now - start}s]")
      end
    end

    # checks if a token is an URS token
    def is_urs_token?(token)
      begin
        # this block is designed to check if the token is a URS JWT
        header = Base64.decode64(token.split('.').first)
        jwt_json = JSON.parse(header)

        jwt_json['typ'] == 'JWT' && jwt_json['origin'] == 'Earthdata Login'
      rescue
        # this block allows proper function when URS token is not a JWT (waiver turned off),
        # because the parse or decode operations will raise an error if URS token isn't a JWT;
        # non-JWT URS token max length is 100, Launchpad token is much longer
        token.length <= 100
      end
    end

    def authorization_header(token)
      if is_urs_token?(token)
        { 'Authorization' => "Bearer #{token}" }
      else
        { 'Authorization' => "#{token}" }
      end
    end

    def truncate_token(token)
      return nil if token.nil?

      # the URS token should have the client id after the ':', but we don't care about outputting that
      token_part = token.split(':').first
      if is_urs_token?(token_part)
        token_part.truncate([token_part.length / 4, 8].max, omission: '')
      else
        # launchpad tokens should not have a client_id
        token_part.truncate(50, omission: '')
      end
    end
  end
end

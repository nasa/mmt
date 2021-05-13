describe 'ECHO Response' do
  context 'when trying to remove tokens from error messages' do

    let(:test_urs_token) { "#{Faker::Lorem.characters(number: 40)}:client_id" }
    let(:test_launchpad_token) { Faker::Lorem.characters(number: 800) }
    let(:soap_urs_body) { '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Client</faultcode><faultstring>Token [' + test_urs_token + '] is not a valid Launchpad or URS token</faultstring><detail><ns4:AuthorizationFault xmlns:ns2="http://echo.nasa.gov/echo/v10" xmlns:ns3="http://echo.nasa.gov/echo/v10/types" xmlns:ns4="http://echo.nasa.gov/echo/v10/faults"><ns4:ErrorCode>TokenNotFound</ns4:ErrorCode><ns4:OpsMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/><ns4:SystemMessage>Token [' + test_urs_token + '] is not a valid Launchpad or URS token</ns4:SystemMessage><ns4:Timestamp>2020-04-14T19:16:24.192Z</ns4:Timestamp><ns4:ErrorInstanceId>CA84D4CF-B1FA-30C2-22E5-E885E8DB3EE2</ns4:ErrorInstanceId><ns4:Token>' + test_urs_token + '</ns4:Token></ns4:AuthorizationFault></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>' }
    let(:soap_launchpad_body) { '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Client</faultcode><faultstring>Token [' + test_launchpad_token + '] is not a valid Launchpad or URS token</faultstring><detail><ns4:AuthorizationFault xmlns:ns2="http://echo.nasa.gov/echo/v10" xmlns:ns3="http://echo.nasa.gov/echo/v10/types" xmlns:ns4="http://echo.nasa.gov/echo/v10/faults"><ns4:ErrorCode>TokenNotFound</ns4:ErrorCode><ns4:OpsMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/><ns4:SystemMessage>Token [' + test_launchpad_token + '] is not a valid Launchpad or URS token</ns4:SystemMessage><ns4:Timestamp>2020-04-14T19:16:24.192Z</ns4:Timestamp><ns4:ErrorInstanceId>CA84D4CF-B1FA-30C2-22E5-E885E8DB3EE2</ns4:ErrorInstanceId><ns4:Token>' + test_launchpad_token + '</ns4:Token></ns4:AuthorizationFault></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>' }
    let(:timeout_error_html_body) { File.read(File.join(Rails.root, 'spec', 'fixtures', 'service_management', 'timeout.html')) }
    let(:token_urs_snippet) { truncate_token(test_urs_token) }
    let(:token_launchpad_snippet) { truncate_token(test_launchpad_token) }

    it 'truncates URS tokens in response' do
      echo_response = echo_fail_response(soap_urs_body)
      inspect_str = echo_response.clean_inspect
      expect(inspect_str).to include("<faultstring>Token beginning with #{token_urs_snippet} is not a valid Launchpad or URS token")
      expect(inspect_str).to include("<ns4:SystemMessage>Token beginning with #{token_urs_snippet} is not a valid Launchpad or URS token")
      expect(inspect_str).to include("<ns4:Token>Token beginning with #{token_urs_snippet}")
    end

    it 'truncates Launchpad tokens in response' do
      echo_response = echo_fail_response(soap_launchpad_body)
      inspect_str = echo_response.clean_inspect
      expect(inspect_str).to include("<faultstring>Token beginning with #{token_launchpad_snippet} is not a valid Launchpad or URS token")
      expect(inspect_str).to include("<ns4:SystemMessage>Token beginning with #{token_launchpad_snippet} is not a valid Launchpad or URS token")
      expect(inspect_str).to include("<ns4:Token>Token beginning with #{token_launchpad_snippet}")
    end

    it 'does not alter other fields' do
      echo_response = echo_fail_response(soap_urs_body)
      inspect_str = echo_response.clean_inspect
      expect(inspect_str).to include('<ns4:Timestamp>2020-04-14T19:16:24.192Z</ns4:Timestamp>')
    end

    it 'remains unaltered' do
      echo_response = echo_fail_response(timeout_error_html_body, status = 504, headers = {'content-type' => 'text/html'})
      inspect_str = echo_response.clean_inspect
      expect(inspect_str).to include('<H1>504 ERROR</H1>')
      expect(inspect_str).to include('CloudFront attempted to establish a connection with the origin, but either the attempt failed or the origin closed the connection.')
      expect(inspect_str).to include('If you provide content to customers through CloudFront, you can find steps to troubleshoot and help prevent this error by reviewing the CloudFront documentation.')
    end
  end
end

require 'rails_helper'

describe 'Echo Token Filter' do
  let(:token_response) {'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Client</faultcode><faultstring>Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate</faultstring><detail><ns4:AuthorizationFault xmlns:ns2="http://echo.nasa.gov/echo/v10/types" xmlns:ns3="http://echo.nasa.gov/echo/v10" xmlns:ns4="http://echo.nasa.gov/echo/v10/faults"><ns4:ErrorCode>NAMSAuidNotFoundForToken</ns4:ErrorCode><ns4:OpsMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/><ns4:SystemMessage>Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate</ns4:SystemMessage><ns4:Timestamp>2020-02-07T14:32:04.509Z</ns4:Timestamp><ns4:ErrorInstanceId>534FF4C2-40E6-A0CB-7ED0-07BE7C7121FE</ns4:ErrorInstanceId><ns4:Token>ThisIsAToken</ns4:Token></ns4:AuthorizationFault></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>'}

  let(:no_token_response) {'<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Client</faultcode><faultstring>Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate</faultstring><detail><ns4:AuthorizationFault xmlns:ns2="http://echo.nasa.gov/echo/v10/types" xmlns:ns3="http://echo.nasa.gov/echo/v10" xmlns:ns4="http://echo.nasa.gov/echo/v10/faults"><ns4:ErrorCode>NAMSAuidNotFoundForToken</ns4:ErrorCode><ns4:OpsMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true"/><ns4:SystemMessage>Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate</ns4:SystemMessage><ns4:Timestamp>2020-02-07T14:32:04.509Z</ns4:Timestamp><ns4:ErrorInstanceId>534FF4C2-40E6-A0CB-7ED0-07BE7C7121FE</ns4:ErrorInstanceId></ns4:AuthorizationFault></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>'}
  
  let(:echo_provider) { Echo::Provider.new('http://example.com', Rails.configuration.services['echo_soap']['services']) }
  
  
  context 'When token is returned in SOAP Response' do
    before do
      allow_any_instance_of(Faraday::Connection).to receive(:post).and_return(Faraday::Response.new(body: token_response, status: 500))
    end

    it 'filters the token' do
      expect(Rails.logger).to receive(:error).with('SOAP Response Error: {"Envelope"=>{"xmlns:SOAP_ENV"=>"http://schemas.xmlsoap.org/soap/envelope/", "Header"=>nil, "Body"=>{"Fault"=>{"faultcode"=>"SOAP-ENV:Client", "faultstring"=>"Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate", "detail"=>{"AuthorizationFault"=>{"xmlns:ns2"=>"http://echo.nasa.gov/echo/v10/types", "xmlns:ns3"=>"http://echo.nasa.gov/echo/v10", "xmlns:ns4"=>"http://echo.nasa.gov/echo/v10/faults", "ErrorCode"=>"NAMSAuidNotFoundForToken", "OpsMessage"=>{"xmlns:xsi"=>"http://www.w3.org/2001/XMLSchema-instance", "xsi:nil"=>"true"}, "SystemMessage"=>"Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate", "Timestamp"=>"2020-02-07T14:32:04.509Z", "ErrorInstanceId"=>"534FF4C2-40E6-A0CB-7ED0-07BE7C7121FE"}}}}}}')
      echo_provider.test_endpoint_connection("https://test.com", :token_response)
    end
  end


  context 'When token is not returned in SOAP Response' do
    before do
      allow_any_instance_of(Faraday::Connection).to receive(:post).and_return(Faraday::Response.new(body: no_token_response, status:500))
    end

    it 'filters the token' do
      expect(Rails.logger).to receive(:error).with('SOAP Response Error: {"Envelope"=>{"xmlns:SOAP_ENV"=>"http://schemas.xmlsoap.org/soap/envelope/", "Header"=>nil, "Body"=>{"Fault"=>{"faultcode"=>"SOAP-ENV:Client", "faultstring"=>"Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate", "detail"=>{"AuthorizationFault"=>{"xmlns:ns2"=>"http://echo.nasa.gov/echo/v10/types", "xmlns:ns3"=>"http://echo.nasa.gov/echo/v10", "xmlns:ns4"=>"http://echo.nasa.gov/echo/v10/faults", "ErrorCode"=>"NAMSAuidNotFoundForToken", "OpsMessage"=>{"xmlns:xsi"=>"http://www.w3.org/2001/XMLSchema-instance", "xsi:nil"=>"true"}, "SystemMessage"=>"Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate", "Timestamp"=>"2020-02-07T14:32:04.509Z", "ErrorInstanceId"=>"534FF4C2-40E6-A0CB-7ED0-07BE7C7121FE"}}}}}}')
      echo_provider.test_endpoint_connection("https://test.com", :non_token_response)
    end
  end

end

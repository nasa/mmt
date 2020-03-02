require 'rails_helper'

describe 'Echo Token Filter' do
  let(:token_response) {"<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Header/><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Client</faultcode><faultstring>Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate</faultstring><detail><ns4:AuthorizationFault xmlns:ns2=\"http://echo.nasa.gov/echo/v10/types\" xmlns:ns3=\"http://echo.nasa.gov/echo/v10\" xmlns:ns4=\"http://echo.nasa.gov/echo/v10/faults\"><ns4:ErrorCode>NAMSAuidNotFoundForToken</ns4:ErrorCode><ns4:OpsMessage xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:nil=\"true\"/><ns4:SystemMessage>Caught exception when getting NAMS AUID from Token Service.java.io.IOException: Server returned HTTP response code: 500 for URL: https://api.launchpad.nasa.gov/icam/api/sm/v1/validate</ns4:SystemMessage><ns4:Timestamp>2020-02-07T14:32:04.509Z</ns4:Timestamp><ns4:ErrorInstanceId>534FF4C2-40E6-A0CB-7ED0-07BE7C7121FE</ns4:ErrorInstanceId><ns4:Token>t24TNXXtzioJQoZkjzjPok91rz9IkwmRazBoJds8ugREoyhgvlmSYkY2aPsgGE1G0+YJ6gBxui3RK0y+xyWolNDUZFn//2EI2BVpHEWbIjiVBobTdY09F42OOmiqSSTKZtFmkLckUNod6is3vDezrtWgqrteE/sdcXhoxNrehItJFUlJoBGXmRLflXu49Hn8QgjdYqz8IBOC1iBE89qAtwOq8SR8/jRozpfqxgCU0i/F1O9FLHw7K8K/ZHIEC1/0xEntrkK9iYWkSZjsPiQ6OnUOkiHG43C2Kg5FeV409+xPgS/mPs3vpCUHf8R8CmBUoVrGx+7s3+S3oKYVnQjcyRx6EhsGtwkJ7jhbxjg1O/Kba1bJ5gP8BwaqshWIfo3Ol3o7c1JU+EMFpDmZySbQsTD/6WoxEYFO0YXJL1ppOCyI1iBktWuglwbpY0vcFECZq9p2MIHO+4Y/rppqKJK6OBGlmYVMAjiaF+GVlVoGRy8W+D2GTRAVNaVUmWq+P5ICM34wKIIINnneGG7AlHFIa2MHSUvyHex5C7oCyNtiToFMAcPeGBnvXuyq2Wj9PQF9FkWli683MG95bg7zlKxt/Ge9xbnDgdgrhLrSOodweK/Yr7DhzAHJPlFehYMWnZp/rwLCbepx3h9R68pnGhamKR+6Hh1NQHLhOo9LYIAMXLXbKIm7fDbFhOclKFwNs09K7wpiqoc4+wjH0m4dNFj6LxhGCcnwbnw9gcDcXolnum7dcXxc/XjhJL0oRtPnVvy5Htx/UnKf5pNpjkQkTexQMw8U6+9tgRQaIcM/2JX+KTsYSNluO6E00Z0O4qj/tZdvgYt7THYpbLLjW8m8/9rQMeGhvYqI7+6dThrcA/bjx2ynSD6D5phsgMJaufF3/u395bCFicxYipNjjE1zycD+C2tB61kI88ylRPjf2lnvI5xaANwPl+j9HL5vtkwnZSizbyyEGEpT8iknAVX4FIRP/kff7kjZuZjs47rC+SIpVAybeVeGGUIMP0xHoU8TpArw/znBuwBiz/4KLugNptqU8Q==:QCuabaWMrGyq0OvCj0X-pg</ns4:Token></ns4:AuthorizationFault></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>"}
  
  let(:echo_provider) { Echo::Provider.new('http://example.com', Rails.configuration.services['echo_soap']['services']) }
  
  
  context 'When token is returned in SOAP Response' do
    before do
      allow_any_instance_of(Faraday::Connection).to receive(:post).and_return(:token_response)
    end

    it 'filters the token' do
      expect(echo_provider.test_endpoint_connection("https://test.com", :non_token_response).to_s).to have_no_content('Token')
    end
  end
end

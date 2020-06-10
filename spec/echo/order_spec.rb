require 'rails_helper'

describe Echo::Order do
  let(:user_response_body) { "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Header/><SOAP-ENV:Body><ns2:GetUserNamesResponse xmlns:ns2=\"http://echo.nasa.gov/echo/v10\" xmlns:ns3=\"http://echo.nasa.gov/echo/v10/types\" xmlns:ns4=\"http://echo.nasa.gov/echo/v10/faults\"><ns2:result><ns3:Item><ns3:Name>test_user</ns3:Name><ns3:Guid>owner_guid_here</ns3:Guid></ns3:Item></ns2:result></ns2:GetUserNamesResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>" }

  context 'order from guid' do
    order_response_body = "<SOAP-ENV:Envelope xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\"><SOAP-ENV:Header/><SOAP-ENV:Body><ns2:GetOrdersResponse xmlns:ns2=\"http://echo.nasa.gov/echo/v10\" xmlns:ns3=\"http://echo.nasa.gov/echo/v10/types\" xmlns:ns4=\"http://echo.nasa.gov/echo/v10/faults\"><ns2:result><ns3:Item><ns3:OwnerGuid>owner_guid_here</ns3:OwnerGuid><ns3:UserDomain>OTHER</ns3:UserDomain><ns3:UserRegion>USA</ns3:UserRegion><ns3:Guid>order_guid_here</ns3:Guid><ns3:State>SUBMITTING</ns3:State><ns3:CreationDate>2017-12-26T18:29:37.518Z</ns3:CreationDate><ns3:SubmissionDate>2017-12-26T18:29:41.148Z</ns3:SubmissionDate><ns3:LastUpdateDate>2017-12-26T18:29:41.148Z</ns3:LastUpdateDate><ns3:ShippingAddress><ns3:Guid>4826E78E-0826-4502-C7B1-FE188D487440</ns3:Guid><ns3:Role>Order Contact</ns3:Role><ns3:Organization>NASA</ns3:Organization><ns3:FirstName>Test</ns3:FirstName><ns3:LastName>User</ns3:LastName><ns3:Address><ns3:Guid>CF1521F2-B96E-E4D1-0B33-CB36A0AC5BED</ns3:Guid><ns3:UsFormat>true</ns3:UsFormat><ns3:Street1>300 E Street Southwest</ns3:Street1><ns3:Street2>Room 203</ns3:Street2><ns3:Street3>Address line 3</ns3:Street3><ns3:City>Washington</ns3:City><ns3:State>DC</ns3:State><ns3:Zip>20546</ns3:Zip><ns3:Country>United States</ns3:Country></ns3:Address><ns3:Phones><ns3:Item><ns3:Guid>C635DE5C-27DF-4D0D-16C1-CE82D9E52250</ns3:Guid><ns3:Number>0000000000</ns3:Number><ns3:PhoneNumberType>BUSINESS</ns3:PhoneNumberType></ns3:Item></ns3:Phones><ns3:Email>email@example.com</ns3:Email></ns3:ShippingAddress><ns3:BillingAddress><ns3:Guid>8BAE807E-32B7-CAD0-8CB4-B72DEB5F5952</ns3:Guid><ns3:Role>Order Contact</ns3:Role><ns3:Organization>NASA</ns3:Organization><ns3:FirstName>Test</ns3:FirstName><ns3:LastName>User</ns3:LastName><ns3:Address><ns3:Guid>EEB65B2C-4DCB-E7CA-6388-D920F6BEE822</ns3:Guid><ns3:UsFormat>true</ns3:UsFormat><ns3:Street1>300 E Street Southwest</ns3:Street1><ns3:Street2>Room 203</ns3:Street2><ns3:Street3>Address line 3</ns3:Street3><ns3:City>Washington</ns3:City><ns3:State>DC</ns3:State><ns3:Zip>20546</ns3:Zip><ns3:Country>United States</ns3:Country></ns3:Address><ns3:Phones><ns3:Item><ns3:Guid>F344BA78-AE8D-AE7B-90CC-F39345367058</ns3:Guid><ns3:Number>0000000000</ns3:Number><ns3:PhoneNumberType>BUSINESS</ns3:PhoneNumberType></ns3:Item></ns3:Phones><ns3:Email>email@example.com</ns3:Email></ns3:BillingAddress><ns3:ContactAddress><ns3:Guid>CE6E81A9-CB99-44BD-6862-09935F1C00E2</ns3:Guid><ns3:Role>Order Contact</ns3:Role><ns3:Organization>NASA</ns3:Organization><ns3:FirstName>Test</ns3:FirstName><ns3:LastName>User</ns3:LastName><ns3:Address><ns3:Guid>013CEC37-B216-51CF-CCCD-89E92A65EF2A</ns3:Guid><ns3:UsFormat>true</ns3:UsFormat><ns3:Street1>300 E Street Southwest</ns3:Street1><ns3:Street2>Room 203</ns3:Street2><ns3:Street3>Address line 3</ns3:Street3><ns3:City>Washington</ns3:City><ns3:State>DC</ns3:State><ns3:Zip>20546</ns3:Zip><ns3:Country>United States</ns3:Country></ns3:Address><ns3:Phones><ns3:Item><ns3:Guid>C2244298-0565-539A-8E44-C0075C7622F9</ns3:Guid><ns3:Number>0000000000</ns3:Number><ns3:PhoneNumberType>BUSINESS</ns3:PhoneNumberType></ns3:Item><ns3:Item><ns3:Guid>C2244298-0565-539A-8E44-C0075C7622F9</ns3:Guid><ns3:Number>1111111111</ns3:Number><ns3:PhoneNumberType>PERSONAL</ns3:PhoneNumberType></ns3:Item></ns3:Phones><ns3:Email>email@example.com</ns3:Email></ns3:ContactAddress><ns3:NotifyLevel>INFO</ns3:NotifyLevel><ns3:ClientIdentity>client_identity_here</ns3:ClientIdentity><ns3:OrderPrice>0.0</ns3:OrderPrice><ns3:ProviderOrders><ns3:Item><ns3:Guid><ns3:ProviderGuid>17EA950B-BA57-D51A-C493-E37340B2DA13</ns3:ProviderGuid><ns3:OrderGuid>order_guid_here</ns3:OrderGuid></ns3:Guid><ns3:State>SUBMITTING</ns3:State><ns3:StatusMessage>Tue Dec 26 18:29:38 UTC 2017 : ECHO: Transitioning from state [null] to state [NOT_VALIDATED]\nTue Dec 26 18:29:41 UTC 2017 : ECHO: Transitioning from state [NOT_VALIDATED] to state [VALIDATED]\nTue Dec 26 18:29:41 UTC 2017 : ECHO: Transitioning from state [VALIDATED] to state [SUBMITTING]\n</ns3:StatusMessage></ns3:Item></ns3:ProviderOrders></ns3:Item></ns2:result></ns2:GetOrdersResponse></SOAP-ENV:Body></SOAP-ENV:Envelope>"

    let(:echo_client) { Echo::Client.new('http://example.com', Rails.configuration.services['echo_soap']['services'], Rails.configuration.services['urs']['mmt_proposal_mode']['test']['https://sit.urs.earthdata.nasa.gov']) }
    let(:order) { Echo::Order.new(client: echo_client, echo_provider_token: 'token', guid: 'order_guid_here') }

    before do
      order_response = Echo::Response.new(Faraday::Response.new(response_body: order_response_body, status: 200))
      allow_any_instance_of(Echo::OrderManagement).to receive(:get_orders).and_return(order_response)
    end

    it 'parses the order guid' do
      expect(order.guid).to eq('order_guid_here')
    end

    it 'parses the state' do
      expect(order.state).to eq('SUBMITTING')
    end

    it 'parses the price' do
      expect(order.price).to eq('0.0')
    end

    it 'parses the created date' do
      expect(order.created_date).to eq('Tuesday, December 26, 2017 at  6:29 pm')
    end

    it 'parses the submitted date' do
      expect(order.submitted_date).to eq('Tuesday, December 26, 2017 at  6:29 pm')
    end

    it 'parses the updated date' do
      expect(order.updated_date).to eq('Tuesday, December 26, 2017 at  6:29 pm')
    end

    it 'parses the owner guid' do
      expect(order.owner_guid).to eq('owner_guid_here')
    end

    it 'parses the owner' do
      user_response = Echo::Response.new(Faraday::Response.new(response_body: user_response_body, status: 200))
      allow_any_instance_of(Echo::UserService).to receive(:get_user_names).and_return(user_response)

      expect(order.owner).to eq('test_user')
    end

    it 'parses the notify level' do
      expect(order.notify_level).to eq('INFO')
    end

    it 'parses the user domain' do
      expect(order.user_domain).to eq('OTHER')
    end

    it 'parses the user region' do
      expect(order.user_region).to eq('USA')
    end

    it 'parses the client identity' do
      expect(order.client_identity).to eq('client_identity_here')
    end

    context 'parses the contact address' do
      # Contact address has 2 phone numbers, bug reported in MMT-1281
      subject { order.contact_address }
      include_examples 'Contact Information'
    end

    context 'parses the shipping address' do
      subject { order.shipping_address }
      include_examples 'Contact Information'
    end

    context 'parses the billing address' do
      subject { order.billing_address }
      include_examples 'Contact Information'
    end
  end

  context 'order from response' do
    let(:response) { { 'OwnerGuid' => 'owner_guid_here', 'UserDomain' => 'OTHER', 'UserRegion' => 'USA', 'Guid' => 'order_guid_here', 'State' => 'SUBMITTING', 'CreationDate' => '2017-12-26T18:29:37.518Z', 'SubmissionDate' => '2017-12-26T18:29:41.148Z', 'LastUpdateDate' => '2017-12-26T18:29:41.148Z', 'ShippingAddress' => { 'Guid' => '4826E78E-0826-4502-C7B1-FE188D487440', 'Role' => 'Order Contact', 'Organization' => 'NASA', 'FirstName' => 'Test', 'LastName' => 'User', 'Address' => { 'Guid' => 'CF1521F2-B96E-E4D1-0B33-CB36A0AC5BED', 'UsFormat' => 'true', 'Street1' => '300 E Street Southwest', 'Street2' => 'Room 203', 'Street3' => 'Address line 3', 'City' => 'Washington', 'State' => 'DC', 'Zip' => '20546', 'Country' => 'United States' }, 'Phones' => { 'Item' => { 'Guid' => 'C635DE5C-27DF-4D0D-16C1-CE82D9E52250', 'Number' => '0000000000', 'PhoneNumberType' => 'BUSINESS' } }, 'Email' => 'email@example.com' }, 'BillingAddress' => { 'Guid' => '8BAE807E-32B7-CAD0-8CB4-B72DEB5F5952', 'Role' => 'Order Contact', 'Organization' => 'NASA', 'FirstName' => 'Test', 'LastName' => 'User', 'Address' => { 'Guid' => 'EEB65B2C-4DCB-E7CA-6388-D920F6BEE822', 'UsFormat' => 'true', 'Street1' => '300 E Street Southwest', 'Street2' => 'Room 203', 'Street3' => 'Address line 3', 'City' => 'Washington', 'State' => 'DC', 'Zip' => '20546', 'Country' => 'United States' }, 'Phones' => { 'Item' => { 'Guid' => 'F344BA78-AE8D-AE7B-90CC-F39345367058', 'Number' => '0000000000', 'PhoneNumberType' => 'BUSINESS' } }, 'Email' => 'email@example.com' }, 'ContactAddress' => { 'Guid' => 'CE6E81A9-CB99-44BD-6862-09935F1C00E2', 'Role' => 'Order Contact', 'Organization' => 'NASA', 'FirstName' => 'Test', 'LastName' => 'User', 'Address' => { 'Guid' => '013CEC37-B216-51CF-CCCD-89E92A65EF2A', 'UsFormat' => 'true', 'Street1' => '300 E Street Southwest', 'Street2' => 'Room 203', 'Street3' => 'Address line 3', 'City' => 'Washington', 'State' => 'DC', 'Zip' => '20546', 'Country' => 'United States' }, 'Phones' => { 'Item' => [{ 'Guid' => 'C2244298-0565-539A-8E44-C0075C7622F9', 'Number' => '0000000000', 'PhoneNumberType' => 'BUSINESS' }, { 'Guid' => 'C2244298-0565-539A-8E44-C0075C7622F9', 'Number' => '1111111111', 'PhoneNumberType' => 'PERSONAL' }] }, 'Email' => 'email@example.com' }, 'NotifyLevel' => 'INFO', 'ClientIdentity' => 'client_identity_here', 'OrderPrice' => '0.0', 'ProviderOrders' => { 'Item' => { 'Guid' => { 'ProviderGuid' => '17EA950B-BA57-D51A-C493-E37340B2DA13', 'OrderGuid' => 'order_guid_here' }, 'State' => 'SUBMITTING', 'StatusMessage' => "Tue Dec 26 18:29:38 UTC 2017 : ECHO: Transitioning from state [null] to state [NOT_VALIDATED]\nTue Dec 26 18:29:41 UTC 2017 : ECHO: Transitioning from state [NOT_VALIDATED] to state [VALIDATED]\nTue Dec 26 18:29:41 UTC 2017 : ECHO: Transitioning from state [VALIDATED] to state [SUBMITTING]\n" } } } }
    let(:echo_client) { Echo::Client.new('http://example.com', Rails.configuration.services['echo_soap']['services'], Rails.configuration.services['urs']['mmt_proposal_mode']['test']['https://sit.urs.earthdata.nasa.gov']) }
    let(:order) { Echo::Order.new(client: echo_client, echo_provider_token: 'token', response: response) }

    it 'parses the order guid' do
      expect(order.guid).to eq('order_guid_here')
    end

    it 'parses the state' do
      expect(order.state).to eq('SUBMITTING')
    end

    it 'parses the price' do
      expect(order.price).to eq('0.0')
    end

    it 'parses the created date' do
      expect(order.created_date).to eq('Tuesday, December 26, 2017 at  6:29 pm')
    end

    it 'parses the submitted date' do
      expect(order.submitted_date).to eq('Tuesday, December 26, 2017 at  6:29 pm')
    end

    it 'parses the updated date' do
      expect(order.updated_date).to eq('Tuesday, December 26, 2017 at  6:29 pm')
    end

    it 'parses the owner guid' do
      expect(order.owner_guid).to eq('owner_guid_here')
    end

    it 'parses the owner' do
      user_response = Echo::Response.new(Faraday::Response.new(response_body: user_response_body, status: 200))
      allow_any_instance_of(Echo::UserService).to receive(:get_user_names).and_return(user_response)

      expect(order.owner).to eq('test_user')
    end

    it 'parses the notify level' do
      expect(order.notify_level).to eq('INFO')
    end

    it 'parses the user domain' do
      expect(order.user_domain).to eq('OTHER')
    end

    it 'parses the user region' do
      expect(order.user_region).to eq('USA')
    end

    it 'parses the client identity' do
      expect(order.client_identity).to eq('client_identity_here')
    end

    context 'parses the contact address' do
      # Contact address has 2 phone numbers, bug reported in MMT-1281
      subject { order.contact_address }
      include_examples 'Contact Information'
    end

    context 'parses the shipping address' do
      subject { order.shipping_address }
      include_examples 'Contact Information'
    end

    context 'parses the billing address' do
      subject { order.billing_address }
      include_examples 'Contact Information'
    end
  end
end

describe 'Creating a Service Option', skip: true do
  before do
    login
  end

  context 'when viewing the new service option form' do
    before do
      visit new_service_option_path
    end

    it 'displays the service option form' do
      expect(page).to have_content('New MMT_2 Service Option')
    end

    context 'when submitting the service option form' do
      context 'with invalid values', js: true do
        before do
          within '#service-option-form' do
            click_on 'Submit'
          end
        end

        it 'displays validation errors within the form' do
          expect(page).to have_content('Name is required.')
          expect(page).to have_content('Description is required.')
          expect(page).to have_content('Form XML is required.')
        end
      end

      context 'with valid values' do
        let(:name)        { 'Tellus Tortor Venenatis' }
        let(:description) { 'Nullam quis risus eget urna mollis ornare vel eu leo.' }
        let(:form_xml)    { '<?xml version="1.0" encoding="utf-8"?>
          <form xmlns="http://echo.nasa.gov/v9/echoforms"
                       targetNamespace="http://myorganization.gov/echoforms"
                       xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <model>
              <instance>
                <prov:options xmlns:prov="http://myorganization.gov/orderoptions">
                  <prov:filename>data.txt</prov:filename>
                  <prov:filesize>10</prov:filesize>
                </prov:options>
              </instance>
            </model>
            <ui>
              <input ref="prov:filename" type="xsd:string" label="File Name">
                <constraints>
                  <constraint>
                    <xpath>string-length(prov:filename) &lt; 25</xpath>
                    <alert>File names must be less than 25 characters</alert>
                  </constraint>
                  <constraint>
                    <pattern>^[A-Za-z]+[A-Za-z0-9]*\.?[A-Za-z0-9]*$</pattern>
                    <alert>
                      File names must start with a letter and
                      not contain illegal characters
                    </alert>
                  </constraint>
                </constraints>
              </input>
              <range ref="prov:filesize" type="xsd:int" start="0"
                     step="10" end="1000" label="File Size (MB)">
              </range>
            </ui>
          </form>'
        }

        before do
          fill_in 'Name', with: name
          fill_in 'Description', with: description
          fill_in 'Form XML', with: form_xml

          VCR.use_cassette('echo_soap/service_management_service/service_options/create', record: :none) do
            within '#service-option-form' do
              click_on 'Submit'
            end
          end
        end

        it 'creates the service option and displays a confirmation message' do
          expect(page).to have_content('Service Option successfully created')
        end
      end
    end
  end
end

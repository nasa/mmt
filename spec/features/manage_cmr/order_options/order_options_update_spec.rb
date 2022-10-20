# MMT-593
require 'rails_helper'

describe 'Updating Order Options' do
  let(:order_option_guid) {'848DA05B-51A2-1F3D-6783-6C27E5EA74B4'}
  let(:echo_form)          { '<form xmlns="http://echo.nasa.gov/v9/echoforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://myorganization.gov/echoforms">
      <model>
        <instance>
          <prov:options xmlns:prov="http://myorganization.gov/orderoptions">
            <prov:filename>data.txt</prov:filename>
            <prov:filesize>10</prov:filesize>
          </prov:options>
        </instance>
      </model>
      <ui>
        <input label="File Name" ref="prov:filename" type="xsd:string">
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
        <range end="1000" label="File Size (MB)" ref="prov:filesize" start="0" step="10" type="xsd:int">
        </range>
      </ui>
    </form>'
  }

  let(:echo_form_update)          { '<form xmlns="http://echo.nasa.gov/v9/echoforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://myorganization.gov/echoforms">
      <model>
        <instance>
          <prov:options xmlns:prov="http://myorganization.gov/orderoptions">
            <prov:filename>data_update.txt</prov:filename>
            <prov:filesize>20</prov:filesize>
          </prov:options>
        </instance>
      </model>
      <ui>
        <input label="File Name" ref="prov:filename" type="xsd:string">
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
        <range end="1000" label="File Size (MB)" ref="prov:filesize" start="0" step="10" type="xsd:int">
        </range>
      </ui>
    </form>'
  }

  context 'When viewing the update page for an existing Order Option' do
    before do
      login

      VCR.use_cassette('echo_rest/order_options/1001-update', record: :none) do
        visit edit_order_option_path(order_option_guid)
      end
    end

    it 'Displays the Order Option Definition in populated fields' do

      expect(page).to have_content('You must change the name of this option definition when updating it.')

      expect(page).to have_field('Name')
      expect(find_field('Name').value).to eq '1001'

      expect(page).to have_field('Sort Key')
      expect(find_field('Sort Key').value).to eq nil

      expect(page).to have_field('Description')
      expect(find_field('Description').value).to eq 'test'

      expect(page).to have_field('Form XML')
      expect(find_field('Form XML').value).to eq echo_form
    end

    context 'When updating the Order Option with the same name' do

      before do
        fill_in 'Sort Key', with: 'AAA'

        VCR.use_cassette('echo_rest/order_options/1001-update-page-error', record: :none) do
          within '.order-options' do
            click_on 'Submit'
          end
        end
      end

      it 'Displays an error message inidicating the name must be unique' do
        expect(page).to have_content('The option definition name [1001] must be unique')
      end
    end

    context 'When successfully updating an Order Option' do

      before do
        fill_in 'Name', with: '1001 - UPDATE'
        fill_in 'Sort Key', with: 'BBB'
        fill_in 'Form XML', with: echo_form_update

        VCR.use_cassette('echo_rest/order_options/1001-update-page-update-ok', record: :none) do
          within '.order-options' do
            click_on 'Submit'
          end
        end
      end

      it 'Displays a success message and shows the updated Order Option' do
        expect(page).to have_content('Order Option was successfully updated')

        # use parts of the ECHO form xml, because spaces and newlines may be read differently by Selenium
        expect(page).to have_content('xmlns="http://echo.nasa.gov/v9/echoforms')
        expect(page).to have_content('prov:options xmlns:prov="http://myorganization.gov/orderoptions"')
        expect(page).to have_content('constraints')
        expect(page).to have_content('pattern')
        expect(page).to have_content('range end="1000" label="File Size (MB)" ref="prov:filesize" start="0" step="10" type="xsd:int"')

        # updated parts of the form
        expect(page).to have_content('<prov:filename>data_update.txt</prov:filename>')
        expect(page).to have_content('<prov:filesize>20</prov:filesize>')
        expect(page).to have_content('pattern')

        expect(page).to have_content('1001 - UPDATE')
        expect(page).to have_content('Scope: PROVIDER ')
        expect(page).to have_content('Deprecated: false')
        expect(page).to have_content('Sort Key: BBB')
      end
    end
  end
end

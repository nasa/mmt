describe 'Updating Order Options', js: true do
  let(:order_option_concept_id) {'OO1200459850-CMR_ONLY'}
  let(:echo_form) { '<?xml version="1.0" encoding="utf-8"?>
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

  let(:echo_form_update) { '<?xml version="1.0" encoding="utf-8"?>
    <form xmlns="http://echo.nasa.gov/v10/echoforms"
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
              <alert>File names must be less than 20 characters</alert>
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

  context 'When viewing the update page for an existing Order Option' do
    before do
      login

      VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
        visit edit_order_option_path(order_option_concept_id)
      end
    end

    it 'Displays the Order Option Definition in populated fields' do

      expect(page).to have_field('order_option_Name')
      expect(find_field('order_option_Name').value).to eq 'Test Order Option ABC-1001'

      expect(page).to have_field('order_option_SortKey')
      expect(find_field('order_option_SortKey').value).to eq ''

      expect(page).to have_field('order_option_Description')
      expect(find_field('order_option_Description').value).to eq 'Test description'

      expect(page).to have_field('order_option_Form')
      expect(find_field('order_option_Form').value).to eq echo_form
    end

    context 'When successfully updating an Order Option' do

      before do
        fill_in 'order_option_Name', with: '1001 - UPDATE'
        fill_in 'order_option_SortKey', with: 'BBB'
        fill_in 'order_option_Form', with: echo_form_update

        VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_update_ok_vcr", record: :none) do
          within '.order-options' do
            click_on 'Submit'
          end
        end
      end

      it 'Displays a success message and shows the updated Order Option' do
        expect(page).to have_content('Order Option was successfully updated')

        expect(page).to have_content('xmlns="http://echo.nasa.gov/v10/echoforms')
        expect(page).to have_content('File names must be less than 20 characters')
        expect(page).to have_content('Order Option ABC-1001')
        expect(page).to have_content('Scope: PROVIDER ')
        expect(page).to have_content('Deprecated: false')
        expect(page).to have_content('Sort Key: BBB')
      end
    end
  end
end

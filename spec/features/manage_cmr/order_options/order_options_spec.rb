describe 'Creating Order Options', js: true do
  let(:option_name)        { 'Test Order Option ABC-1' }
  let(:option_description) { 'Test Order Option Definition Description' }
  let(:bad_form)           { '<form>what</form>' }
  let(:echo_form)          { '<?xml version="1.0" encoding="utf-8"?>
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

  context 'when viewing the new order option page' do
    before do
      login
      visit new_order_option_path
    end

    it 'indicates the page is to create a new order option' do
      expect(page).to have_content('New MMT_2 Order Option')
    end

    it 'displays the new order option entry fields' do
      expect(page).to have_field('order_option_Name', type: 'text')
      expect(page).to have_field('order_option_SortKey', type: 'text')
      expect(page).to have_field('order_option_Description', type: 'textarea')
      expect(page).to have_field('order_option_Form', type: 'textarea')
    end

    context 'when creating an order option with complete information' do
      before do
        fill_in 'order_option_Name', with: option_name
        fill_in 'order_option_Description', with: option_description
        fill_in 'order_option_Form', with: echo_form
        allow_any_instance_of(OrderOptionsController).to receive(:get_native_id).and_return('native_id_1')
        allow_any_instance_of(OrderOptionsController).to receive(:get_order_option_id).and_return('order_option_id_1')
        VCR.use_cassette("order_options/#{File.basename(__FILE__, '.rb')}_vcr", record: :none) do
          within '.order-options' do
            click_on 'Submit'
          end
        end
      end

      it 'displays a success message' do
        expect(page).to have_content('Order Option was successfully created')
      end

      it 'displays the Order Option Definition' do
        expect(page).to have_content(option_name)
        expect(page).to have_content(option_description)
        expect(page).to have_content('PROVIDER')

        # use parts of the ECHO form xml, because VCR alters the tags and newlines
        expect(page).to have_content('xmlns="http://echo.nasa.gov/v9/echoforms')
        expect(page).to have_content('prov:options xmlns:prov="http://myorganization.gov/orderoptions"')
        expect(page).to have_content('constraints')
        expect(page).to have_content('pattern')
        expect(page).to have_content('step="10" end="1000" label="File Size (MB)"')
      end
    end

    context 'when attempting to create an order option with incomplete information' do
      context 'when submitting an invalid form' do
        before do
          within '.order-options' do
            click_on 'Submit'
          end
        end

        it 'displays the correct error messages' do
          expect(page).to have_css('.eui-banner--danger')
          expect(page).to have_content('Name is required.')
          expect(page).to have_content('Description is required.')
          expect(page).to have_content('Form XML is required.')
        end
      end
    end

  end
end

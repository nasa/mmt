describe 'Creating Order Options' do
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
      expect(page).to have_field('Name', type: 'text')
      expect(page).to have_field('Sort Key', type: 'text')
      expect(page).to have_field('Description', type: 'textarea')
      expect(page).to have_field('Form XML', type: 'textarea')
    end

    context 'when creating an order option with complete information' do
      before do
        fill_in 'Name', with: option_name
        fill_in 'Description', with: option_description
        fill_in 'Form XML', with: echo_form

        VCR.use_cassette('echo_rest/order_options/create', record: :none) do
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
        expect(page).to have_content('range end="1000" label="File Size (MB)" ref="prov:filesize" start="0" step="10" type="xsd:int"')
      end
    end

    context 'when attempting to create an order option with incomplete information' do
      context 'when submitting an invalid form', js: true do
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

      context 'when submitting a form with a bad ECHO form' do
        before do
          fill_in 'Name', with: option_name
          fill_in 'Description', with: option_description
          fill_in 'Form XML', with: bad_form

          VCR.use_cassette('echo_rest/order_options/create_with_error', record: :none) do
            within '.order-options' do
              click_on 'Submit'
            end
          end
        end

        it 'displays bad echo form error message' do
          expect(page).to have_css('.eui-banner--danger')
          expect(page).to have_content('ECHO Form is not valid')
        end
      end
    end

  end
end

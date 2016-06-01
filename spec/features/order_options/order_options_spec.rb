# MMT-592

require 'rails_helper'

describe 'Creating Order Options', js: true do
  option_name = 'Test Order Option 1'
  option_description = 'Test Order Option Definition Description'
  bad_form = '<form>what</form>'
  echo_form = '<?xml version="1.0" encoding="utf-8"?>
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

  context 'when viewing the new order option page' do
    before do
      login
      visit new_order_option_path
    end

    it 'indicates the page is to create a new order option' do
      within 'main header' do
        expect(page).to have_content('Create a New Order Option')
      end
      # TODO when guid is available, add expectation for provider
    end

    it 'displays the new order option entry fields' do
      expect(page).to have_field('Name', type: 'text')
      expect(page).to have_field('Sort Key', type: 'text')
      expect(page).to have_field('Scope', type: 'select')
      expect(page).to have_field('Description', type: 'textarea')
      expect(page).to have_field('ECHO Form XML', type: 'textarea')
    end

    context 'when attempting to create an order option with incomplete information' do

      context 'when submitting an invalid form' do
        before do
          click_on 'Create'
        end

        it 'displays the correct error messages' do
          expect(page).to have_css('.eui-banner--danger')
          expect(page).to have_content('Order Option Name is required.')
          expect(page).to have_content('Description is required.')
          expect(page).to have_content('ECHO Form XML is required.')
        end
      end

      context 'when submitting a form with a bad ECHO form' do
        before do
          fill_in 'Name', with: option_name
          fill_in 'Description', with: option_description
          fill_in 'ECHO Form XML', with: bad_form

          VCR.use_cassette('order_options/bad_echo_form', record: :none) do
            click_on 'Create'
          end
        end

        it 'displays bad echo form error message' do
          expect(page).to have_css('.eui-banner--danger')
          expect(page).to have_content('ECHO Form is not valid')
        end
      end
    end

    context 'when submitting a valid order option definition form' do
      before do
        fill_in 'Name', with: option_name
        fill_in 'Description', with: option_description
        fill_in 'ECHO Form XML', with: echo_form

        VCR.use_cassette('order_options/create', record: :none) do
          click_on 'Create'
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
  end
end

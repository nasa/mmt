# MMT-593

require 'rails_helper'

describe 'Creating Order Options', js: true do
  option_name = 'Test Order Option ABC-1'
  updated_option_name = 'Test Order Option ABC-1 V2'
  option_description = 'Test Order Option Definition Description'
  updated_option_description = 'Updated Test Order Option Definition Description'

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
    </form>' }

  context 'when updating an existing order option' do
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



    context 'when creating an order option with complete information' do

      before do
        fill_in 'Name', with: option_name
        fill_in 'Description', with: option_description
        fill_in 'ECHO Form XML', with: echo_form

        VCR.use_cassette('echo_rest/order_options/create', record: :none) do
          click_on 'Save'
        end
      end

      it 'displays a success message' do
        expect(page).to have_content('Order Option was successfully created')
      end

      it 'Suucessfully updates an order option' do
        expect(page).to have_content(option_name)
        expect(page).to have_content(option_description)
        expect(page).to have_content('PROVIDER')

        # use parts of the ECHO form xml, because VCR alters the tags and newlines
        expect(page).to have_content('xmlns="http://echo.nasa.gov/v9/echoforms')
        expect(page).to have_content('prov:options xmlns:prov="http://myorganization.gov/orderoptions"')
        expect(page).to have_content('constraints')
        expect(page).to have_content('pattern')
        expect(page).to have_content('range end="1000" label="File Size (MB)" ref="prov:filesize" start="0" step="10" type="xsd:int"')
        expect(page).to have_link('Edit Order Option')


        VCR.use_cassette('echo_rest/order_options/update', record: :none) do
          click_on 'Edit Order Option'
        end

        expect(page).to have_content('You must change the name of this option definition when updating it.')
        expect(page).to have_field('Name', type: 'text')
        expect(page).to have_field('Sort Key', type: 'text')
        expect(page).to have_field('Scope', type: 'select')
        expect(page).to have_field('Description', type: 'textarea')
        expect(page).to have_field('ECHO Form XML', type: 'textarea')

        VCR.use_cassette('echo_rest/order_options/update_fail', record: :none) do
          click_on 'Save'
        end

        expect(page).to have_content('The option definition name [Test Order Option ABC-1] must be unique.')

        fill_in 'Name', with: updated_option_name
        fill_in 'Description', with: updated_option_description

        VCR.use_cassette('echo_rest/order_options/update_success', record: :none) do
          click_on 'Save'
        end

        expect(page).to have_content('Order Option was successfully updated.')
        expect(page).to have_content('xmlns="http://echo.nasa.gov/v9/echoforms')
        expect(page).to have_content('prov:options xmlns:prov="http://myorganization.gov/orderoptions"')
        expect(page).to have_content('constraints')
        expect(page).to have_content('pattern')
        expect(page).to have_content('range end="1000" label="File Size (MB)" ref="prov:filesize" start="0" step="10" type="xsd:int"')
        expect(page).to have_link('Edit Order Option')


      end

    end

  end
end

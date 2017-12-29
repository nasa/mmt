require 'rails_helper'

shared_examples_for 'Contact Information' do
  let(:contact_info) { subject }

  it 'parses the role' do
    expect(contact_info.role).to eq('Order Contact')
  end

  it 'parses the name' do
    expect(contact_info.name).to eq('Test User')
  end

  it 'parses the organization' do
    expect(contact_info.organization).to eq('NASA')
  end

  it 'parses the street 1' do
    expect(contact_info.street_1).to eq('300 E Street Southwest')
  end

  it 'parses the street 2' do
    expect(contact_info.street_2).to eq('Room 203')
  end

  it 'parses the street 3' do
    expect(contact_info.street_3).to eq('Address line 3')
  end

  it 'parses the city' do
    expect(contact_info.city).to eq('Washington')
  end

  it 'parses the state' do
    expect(contact_info.state).to eq('DC')
  end

  it 'parses the zip' do
    expect(contact_info.zip).to eq('20546')
  end

  it 'parses the country' do
    expect(contact_info.country).to eq('United States')
  end

  it 'parses the phone number' do
    expect(contact_info.phone_number).to eq('0000000000')
  end

  it 'parses the phone number type' do
    expect(contact_info.phone_number_type).to eq('BUSINESS')
  end

  it 'parses the phone and type' do
    expect(contact_info.phone_and_type).to eq('0000000000 (BUSINESS)')
  end

  it 'parses the email' do
    expect(contact_info.email).to eq('email@example.com')
  end
end

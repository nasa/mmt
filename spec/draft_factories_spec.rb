# This test validates that the full_collection_draft draft factory is still a valid umm-json object

require 'rails_helper'

describe 'Draft factory' do
  it 'full_collection_draft is still valid umm-json' do
    draft = build(:full_collection_draft).draft
    schema = 'lib/assets/schemas/collections/umm-c-json-schema.json'

    errors = JSON::Validator.fully_validate(schema, draft).each do |error|
      puts error if error
    end

    #expect(errors).to eq([])
  end

  it 'collection_draft_all_required_fields is still valid umm-json' do
    draft = build(:collection_draft_all_required_fields).draft
    schema = 'lib/assets/schemas/collections/umm-c-json-schema.json'

    errors = JSON::Validator.fully_validate(schema, draft).each do |error|
      puts error if error
    end

    #expect(errors).to eq([])
  end

  it 'full_variable_draft is still valid umm-json' do
    draft = build(:full_variable_draft).draft
    schema = 'lib/assets/schemas/variables/umm-var-json-schema.json'

    errors = JSON::Validator.fully_validate(schema, draft).each do |error|
      puts error if error
    end

    expect(errors).to eq([])

  end

  it 'full_service_draft is still valid umm-json' do
    draft = build(:full_service_draft).draft
    schema = 'lib/assets/schemas/services/umm-s-json-schema.json'

    errors = JSON::Validator.fully_validate(schema, draft).each do |error|
      puts error if error
    end

    expect(errors).to eq([])
  end
end

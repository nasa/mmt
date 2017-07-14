require 'rails_helper'

describe 'Variable Drafts Forms Field Validations', reset_provider: true, js: true do
  before do
    login

    @draft = create(:empty_variable_draft, user: User.where(urs_uid: 'testuser').first)
  end

end

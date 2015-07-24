require 'rails_helper'

describe 'Draft creation' do
  before do
    login
  end

  context 'when creating a new draft from scratch' do
    before do
      create_new_draft
    end

    it 'creates a new blank draft record' do
      expect(page).to have_content('Untitled Collection Record')
    end

    it 'creates a new draft in the database' do
      expect(Draft.count).to eq(1)
    end
  end


end

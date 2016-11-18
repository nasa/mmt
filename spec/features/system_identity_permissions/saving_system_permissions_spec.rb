# MMT-586

require 'rails_helper'

describe 'Saving System Identity Permissions' do
  # concept_id for Administrators_2 group created on cmr setup
  concept_id = 'AG1200000001-CMR'

  before do
    login(true)

    visit edit_system_identity_permission_path(concept_id)
  end

  context 'when selecting and saving system permissions' do
    before do
      # choose some permissions to choose
    end

  end
end

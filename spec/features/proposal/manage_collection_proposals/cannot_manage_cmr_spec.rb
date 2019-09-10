describe 'Attempting to access the Manage CMR functionalities' do
  before do
    set_as_proposal_mode_mmt
    login
  end

  it 'does not have a link to manage cmr' do
    visit manage_collection_proposals_path

    expect(page).to have_content('Manage Collection Proposals')
    expect(page).to have_content('Create Collection Proposal')
    expect(page).not_to have_link('Manage CMR')
  end

  it 'does not let the user reach the Manage CMR page with a direct link' do
    visit manage_cmr_path

    expect(page).to have_content('Manage Collection Proposals')
    expect(page).to have_content('Create Collection Proposal')
    expect(page).not_to have_content('Orders')
    expect(page).not_to have_content('Data Quality Summaries')
  end

  it 'does not let the user reach the groups page' do
    visit groups_path

    expect(page).to have_content('Manage Collection Proposals')
    expect(page).to have_content('Create Collection Proposal')
    expect(page).not_to have_content('Orders')
    expect(page).not_to have_content('Data Quality Summaries')
  end
end

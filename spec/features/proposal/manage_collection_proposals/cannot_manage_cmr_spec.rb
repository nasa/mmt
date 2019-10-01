describe 'Attempting to access the Manage CMR functionalities in proposal mode', js: true do
  before do
    set_as_proposal_mode_mmt(with_required_acl: true)
    login
  end

  it 'does not have a link to manage cmr' do
    visit manage_collection_proposals_path

    expect(page).to have_content('MANAGE COLLECTION PROPOSALS')
    expect(page).to have_content('Create Collection Proposal')
    expect(page).to have_no_link('Manage CMR')
  end

  it 'does not let the user reach the Manage CMR page with a direct link' do
    visit manage_cmr_path

    expect(page).to have_content('MANAGE COLLECTION PROPOSALS')
    expect(page).to have_content('Create Collection Proposal')
    expect(page).to have_no_content('Orders')
    expect(page).to have_no_content('Data Quality Summaries')
  end

  # Groups was chosen arbitrarily to represent "a function available through the
  # manage cmr page" that should be inaccessible to draft MMT.
  it 'does not let the user reach the groups page' do
    visit groups_path

    expect(page).to have_content('MANAGE COLLECTION PROPOSALS')
    expect(page).to have_content('Create Collection Proposal')
    expect(page).to have_no_content('Orders')
    expect(page).to have_no_content('Data Quality Summaries')
  end
end

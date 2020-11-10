describe 'Using rake tasks to ingest data into CMR for manual testing', reset_provider: true do
  context 'when using testing:ingest_tabs_test' do
    before do
      Rake::Task.define_task(:environment)
      Rake.application.rake_require 'tasks/testing'
      # the task being tested uses cmr_client which is defined in tasks/collections
      # so we need to include that to not error out when running it here
      Rake.application.rake_require 'tasks/collections'
      Rake::Task['testing:ingest_tabs_test'].invoke(1, 4)

      # wait because CMR needs a moment to update for the associations
      wait_for_cmr
    end

    it 'creates a record with one service association and four tool associations' do
      # include_granule_counts gets us the association list, which is... weird.
      response = cmr_client.get_collections(provider_id: 'MMT_2', include_granule_counts: true)
      associations = response.body['items'][0]['meta']['associations']
      expect(associations['services'].count).to eq(1)
      expect(associations['tools'].count).to eq(4)
    end
  end
end

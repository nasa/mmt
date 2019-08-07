describe CollectionDraftProposal do
  context 'when MMT is in draft only mode' do
    before do
      set_as_proposal_mode_mmt
    end

    # display_entry_title method
    it '"display_entry_title" returns a draft proposal\'s title if available' do
      collection_draft_proposal = build(:empty_collection_draft_proposal, entry_title: 'Title Example')
      expect(collection_draft_proposal.display_entry_title).to eq('Title Example')
    end
    it '"display_entry_title" returns <Untitled Collection Record> if there is no entry title' do
      collection_draft_proposal = build(:empty_collection_draft_proposal, entry_title: nil)
      expect(collection_draft_proposal.display_entry_title).to eq('<Untitled Collection Record>')
    end

    # display_short_name method
    it '"display_short_name" returns a draft proposal\'s short_name if available' do
      collection_draft_proposal = build(:empty_collection_draft_proposal, short_name: 'ID Example')
      expect(collection_draft_proposal.display_short_name).to eq('ID Example')
    end
    it '"display_short_name" returns <Blank Short Name> if there is no entry id' do
      collection_draft_proposal = build(:empty_collection_draft_proposal)
      expect(collection_draft_proposal.display_short_name).to eq('<Blank Short Name>')
    end

    # update_draft method
    it '"update_draft" saves short_name on update' do
      collection_draft_proposal = create(:empty_collection_draft_proposal)
      user = create(:user)
      params = { 'short_name' => '12345', 'entry_title' => 'new title' }

      collection_draft_proposal.update_draft(params, user)

      expect(collection_draft_proposal.display_short_name).to eq('12345')
    end
    it '"update_draft" saves entry_title on update' do
      collection_draft_proposal = create(:empty_collection_draft_proposal)
      user = create(:user)
      params = { 'short_name' => '12345', 'entry_title' => 'new title' }

      collection_draft_proposal.update_draft(params, user)

      expect(collection_draft_proposal.display_entry_title).to eq('new title')
    end
    it '"update_draft" overwrites old values with new values' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, draft: { 'EntryTitle' => 'test title' })
      user = create(:user)
      params = { 'entry_title' => 'new title' }

      collection_draft_proposal.update_draft(params, user)

      expect(collection_draft_proposal.draft).to eq('EntryTitle' => 'new title')
    end
    it '"update_draft" deletes empty values' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, draft: { 'EntryTitle' => 'test title' })
      params = { 'short_name' => '12345', 'entry_title' => '' }
      user = create(:user)

      collection_draft_proposal.update_draft(params, user)

      expect(collection_draft_proposal.draft).to eq('ShortName' => '12345')
    end
    it '"update_draft" converts number fields to numbers' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, draft: {})
      params = { 'size' => '42' }
      user = create(:user)
      collection_draft_proposal.update_draft(params, user)

      expect(collection_draft_proposal.draft).to eq('Size' => 42.0)
    end
    it '"update_draft" converts number fields with delimiters to numbers' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, draft: {})
      params = { 'size' => '9,001' }
      user = create(:user)

      collection_draft_proposal.update_draft(params, user)

      expect(collection_draft_proposal.draft).to eq('Size' => 9001.0)
    end
    it '"update_draft" converts integer fields to integers' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, draft: {})
      params = { 'number_of_instruments' => '42' }
      user = create(:user)

      collection_draft_proposal.update_draft(params, user)

      expect(collection_draft_proposal.draft).to eq('NumberOfInstruments' => 42)
    end
    it '"update_draft" converts boolean fields to boolean' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, draft: {})
      params = { 'ends_at_present_flag' => 'false' }
      user = create(:user)
      collection_draft_proposal.update_draft(params, user)

      expect(collection_draft_proposal.draft).to eq('EndsAtPresentFlag' => false)
    end

    # after_create sets native_id
    it 'saves a native_id after create' do
      collection_draft_proposal = create(:empty_collection_draft_proposal)
      expect(collection_draft_proposal.native_id).to include('mmt_collection_')
    end
    it 'stores non url encoded native_id' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, native_id: 'not & url, encoded / native id')
      expect(collection_draft_proposal.native_id).to eq('not & url, encoded / native id')
    end

    # create_from_collection method
    it '"create_from_collection" saves a native_id' do
      collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
      user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
      native_id = 'test_id'
      collection_draft_proposal = CollectionDraft.create_from_collection(collection, user, native_id)

      expect(collection_draft_proposal.native_id).to eq(native_id)
    end
    it '"create_from_collection" saves a user' do
      collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
      user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
      native_id = 'test_id'
      collection_draft_proposal = CollectionDraftProposal.create_from_collection(collection, user, native_id)

      expect(collection_draft_proposal.user).to eq(user)
    end
    it '"create_from_collection" saves the draft proposal' do
      collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
      user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
      native_id = 'test_id'
      collection_draft_proposal = CollectionDraftProposal.create_from_collection(collection, user, native_id)

      expect(collection_draft_proposal.draft).to eq(collection)
    end

    # add_metadata_dates
    it '"add_metadata_dates" adds create and update dates' do
      collection_draft_proposal = create(:empty_collection_draft_proposal)
      collection_draft_proposal.add_metadata_dates

      metadata_dates = collection_draft_proposal.draft['MetadataDates']

      expect(metadata_dates.first['Type']).to eq('CREATE')
      expect(metadata_dates.first['Date']).to start_with(today_string)

      expect(metadata_dates.second['Type']).to eq('UPDATE')
      expect(metadata_dates.second['Date']).to start_with(today_string)
    end

    it '"add_metadata_dates" keeps other metadata date values unchanged' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, draft: { 'MetadataDates' => [
        { 'Type' => 'REVIEW', 'Date' => '2015-07-01T00:00:00Z' },
        { 'Type' => 'DELETE', 'Date' => '2015-07-01T00:00:00Z' }
        ]})
      collection_draft_proposal.add_metadata_dates

      metadata_dates = collection_draft_proposal.draft['MetadataDates']

      expect(metadata_dates[0]['Type']).to eq('REVIEW')
      expect(metadata_dates[0]['Date']).to eq('2015-07-01T00:00:00Z')

      expect(metadata_dates[1]['Type']).to eq('DELETE')
      expect(metadata_dates[1]['Date']).to eq('2015-07-01T00:00:00Z')

      expect(metadata_dates[2]['Type']).to eq('CREATE')
      expect(metadata_dates[2]['Date']).to start_with(today_string)

      expect(metadata_dates[3]['Type']).to eq('UPDATE')
      expect(metadata_dates[3]['Date']).to start_with(today_string)
    end

    it '"add_metadata_dates" updates UPDATE date but keeps CREATE date' do
      collection_draft_proposal = create(:empty_collection_draft_proposal, draft: { 'MetadataDates' => [
        { 'Type' => 'CREATE', 'Date' => '2015-07-01T00:00:00Z' },
        { 'Type' => 'UPDATE', 'Date' => '2015-07-01T00:00:00Z' },
        { 'Type' => 'REVIEW', 'Date' => '2015-07-01T00:00:00Z' },
        { 'Type' => 'DELETE', 'Date' => '2015-07-01T00:00:00Z' }
        ]})
      collection_draft_proposal.add_metadata_dates

      metadata_dates = collection_draft_proposal.draft['MetadataDates']

      expect(metadata_dates[0]['Type']).to eq('REVIEW')
      expect(metadata_dates[0]['Date']).to eq('2015-07-01T00:00:00Z')

      expect(metadata_dates[1]['Type']).to eq('DELETE')
      expect(metadata_dates[1]['Date']).to eq('2015-07-01T00:00:00Z')

      expect(metadata_dates[2]['Type']).to eq('CREATE')
      expect(metadata_dates[2]['Date']).to eq('2015-07-01T00:00:00Z')

      expect(metadata_dates[3]['Type']).to eq('UPDATE')
      expect(metadata_dates[3]['Date']).to start_with(today_string)
    end

    it 'is valid without a provider_id' do
      collection_draft_proposal = build(:empty_collection_draft_proposal, provider_id: nil)

      expect(collection_draft_proposal.valid?).to eq(true)
    end
  end



  context 'when running in MMT proper' do
    before do
      set_as_mmt_proper
    end
    # we are not testing that update or destroy should fail because that would
    # require first creating draft proposals to do those actions, which should
    # not be possible if the other actions are successfully blocked

    it 'creating a draft proposal should fail to save' do
      collection_draft_proposal = CollectionDraftProposal.create
      expect(collection_draft_proposal.id).to be(nil)

      expect { CollectionDraftProposal.create! }.to raise_error(ActiveRecord::RecordNotSaved)
    end

    it 'saving a draft proposal should fail' do
      collection_draft_proposal = build(:empty_collection_draft_proposal)
      expect(collection_draft_proposal.save).to eq(false)

      expect { collection_draft_proposal.save! }.to raise_error(ActiveRecord::RecordNotSaved)
    end

    it '"create_from_collection" should fail to save' do
      collection = { 'ShortName' => '12345', 'EntryTitle' => 'test title' }
      user = User.create(urs_uid: 'testuser', provider_id: 'MMT_2')
      native_id = 'test_id'
      collection_draft_proposal = CollectionDraftProposal.create_from_collection(collection, user, native_id)

      expect(collection_draft_proposal.id).to be(nil)
    end
  end
end

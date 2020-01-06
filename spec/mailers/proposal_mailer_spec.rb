describe ProposalMailer do
  context 'proposal submission notification' do
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }

    context 'when publishing a new record' do
      id = 1
      short_name = 'CIESIN_SEDAC_EPI_2010'
      version = 2010
      let(:mail) { described_class.proposal_submitted_notification(user, short_name, version, id) }

      it 'renders the subject' do
        expect(mail.subject).to eq('New Create Collection Proposal Submitted in Metadata Management Tool')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
      end

      it 'renders the new metadata submitted notice including short name + version' do
        expect(mail.html_part.body).to have_content("#{short_name}_#{version} Submitted")
        expect(mail.html_part.body).to have_content("#{user[:name]}, Your collection metadata proposal #{short_name}_#{version} has been successfully submitted for review.", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, Your collection metadata proposal #{short_name}_#{version} has been successfully submitted for review.", normalize_ws: true)
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('View Collection', href: collection_draft_proposal_url(id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_draft_proposal_url(id))
      end
    end

    context 'when rejecting a record' do
      proposal = CollectionDraftProposal.new
      proposal.draft = { 'ShortName': 'CIESIN_SEDAC_EPI_2010', 'Version': '1' }
      proposal.approver_feedback = { 'reasons': ['Test Reason Text'], 'note': 'Test Note Text' }
      proposal.request_type = 'Create'
      proposal.id = 1
      let(:mail) { described_class.proposal_rejected_notification(user, proposal) }

      it 'renders the subject' do
        expect(mail.subject).to eq('Create Collection Proposal Rejected in Metadata Management Tool')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
      end

      it 'renders the new metadata submitted notice including short name + version' do
        expect(mail.html_part.body).to have_content("#{proposal.draft['ShortName']}_#{proposal.draft['Version']} Rejected")
        expect(mail.html_part.body).to have_content("#{user[:name]}, The collection draft proposal #{proposal.draft['ShortName']}_#{proposal.draft['Version']} has been reviewed and rejected for the following reasons: '#{proposal.approver_feedback['reasons'].join(', ')}'", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, The collection draft proposal #{proposal.draft['ShortName']}_#{proposal.draft['Version']} has been reviewed and rejected for the following reasons: '#{proposal.approver_feedback['reasons'].join(', ')}'", normalize_ws: true)
        expect(mail.html_part.body).to have_content("Additional feedback was provided: '#{proposal.approver_feedback['note']}'")
        expect(mail.text_part.body).to have_content("Additional feedback was provided: '#{proposal.approver_feedback['note']}'")
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('Revise and Resubmit Collection Metadata Proposal', href: collection_draft_proposal_url(proposal.id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_draft_proposal_url(proposal.id))
      end
    end
  end
end

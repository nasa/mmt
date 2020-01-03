describe ProposalMailer do
  context 'Proposal email notifications' do
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }

    context 'when submitting a new proposal' do
      id = 1
      short_name = 'CIESIN_SEDAC_EPI_2010'
      version = 2010
      request_type = 'create'
      let(:mail) { described_class.proposal_submitted_notification(user, short_name, version, id, request_type) }

      it 'renders the subject' do
        expect(mail.subject).to eq('New Create Collection Request Submitted in Metadata Management Tool')
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

    context 'when approving a proposal' do
      id = 1
      short_name = 'CIESIN_SEDAC_EPI_2010'
      version = 2010
      request_type = 'create'
      let(:mail) { described_class.proposal_approved_notification(user, short_name, version, id, request_type) }

      it 'renders the subject' do
        expect(mail.subject).to eq('Create Collection Request Approved in Metadata Management Tool')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
      end

      it 'renders the new metadata submitted notice including short name + version' do
        expect(mail.html_part.body).to have_content("#{short_name}_#{version} Approved")
        expect(mail.html_part.body).to have_content("#{user[:name]}, The following collection metadata proposal has been reviewed and approved: #{short_name}_#{version}", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, The following collection metadata proposal has been reviewed and approved: #{short_name}_#{version}", normalize_ws: true)
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('View Collection', href: collection_draft_proposal_url(id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_draft_proposal_url(id))
      end
    end

    context 'when publishing a proposal' do
      concept_id = 'C1200000007-SEDAC'
      revision_id = 1
      short_name = 'CIESIN_SEDAC_EPI_2010'
      version = 2010
      request_type = 'create'
      let(:mail) { described_class.proposal_published_notification(user, concept_id, revision_id, short_name, version, request_type) }

      it 'renders the subject' do
        expect(mail.subject).to eq('Create Collection Request Published in Metadata Management Tool')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
      end

      it 'renders the new metadata submitted notice including short name + version' do
        expect(mail.html_part.body).to have_content("#{short_name}_#{version} Created")
        expect(mail.html_part.body).to have_content("#{user[:name]}, Your collection metadata record #{short_name}_#{version} has been successfully published to the CMR. Your collection's concept ID is #{concept_id}", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, Your collection metadata record #{short_name}_#{version} has been successfully published to the CMR. Your collection's concept ID is #{concept_id}", normalize_ws: true)
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('View Collection', href: collection_url(concept_id, revision_id: revision_id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_url(concept_id, revision_id: revision_id))
      end
    end
  end
end

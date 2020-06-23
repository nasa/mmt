describe DraftMailer do
  context 'tool_draft_published_notification' do
    let(:user) { { name: 'Captain Planet', email: 'supergreen@bluemarble.com' } }

    context 'when publishing a new record' do
      let(:concept_id) { 'T1200000007-MMT_1' }
      let(:revision_id) { 1 }
      let(:short_name) { 'Tool Short' }

      let(:mail) { described_class.tool_draft_published_notification(user, concept_id, revision_id, short_name) }

      it 'renders the subject' do
        expect(mail.subject).to eq('New Tool Record Published in Metadata Management Tool (test)')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@earthdata.nasa.gov'])
      end

      it 'renders the new record published notice including short name' do
        expect(mail.html_part.body).to have_content("#{short_name} Published")
        expect(mail.html_part.body).to have_content("#{user[:name]}, Your tool metadata record #{short_name} has been successfully published to the CMR (test).", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, Your tool metadata record #{short_name} has been successfully published to the CMR (test).", normalize_ws: true)
      end

      it 'renders the concept id' do
        expect(mail.html_part.body).to have_content(concept_id)
        expect(mail.text_part.body).to have_content(concept_id)
      end

      it 'renders the link to the tool' do
        expect(mail.html_part.body).to have_link('View Tool', href: tool_url(concept_id, revision_id: revision_id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(tool_url(concept_id, revision_id: revision_id))
      end
    end

    context 'when publishing an update' do
      let(:concept_id) { 'T1200000059-MMT_1' }
      let(:revision_id) { 4 }
      let(:short_name) { 'Tool Short' }
      let(:mail) { described_class.tool_draft_published_notification(user, concept_id, revision_id, short_name) }

      it 'renders the subject' do
        expect(mail.subject).to eq('Tool Record Updated in Metadata Management Tool (test)')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@earthdata.nasa.gov'])
      end

      it 'renders the record updated notice including short name' do
        expect(mail.html_part.body).to have_content("#{short_name} Updated")
        expect(mail.html_part.body).to have_content("#{user[:name]}, Your tool metadata record #{short_name} has been successfully updated in the CMR (test).", normalize_ws: true)
        expect(mail.text_part.body).to have_content("#{user[:name]}, Your tool metadata record #{short_name} has been successfully updated in the CMR (test).", normalize_ws: true)
      end

      it 'renders the concept id' do
        expect(mail.html_part.body).to have_content(concept_id)
        expect(mail.text_part.body).to have_content(concept_id)
      end

      it 'renders the link to the tool' do
        expect(mail.html_part.body).to have_link('View Tool', href: tool_url(concept_id, revision_id: revision_id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(tool_url(concept_id, revision_id: revision_id))
      end
    end
  end
end

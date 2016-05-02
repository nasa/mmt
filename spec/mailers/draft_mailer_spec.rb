require 'rails_helper'

describe DraftMailer do
  context 'draft_published_notification' do
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }

    context 'when publishing a new record' do
      concept_id = 'C1200000007-SEDAC'
      revision_id = 1
      let(:mail) { described_class.draft_published_notification(user, concept_id, revision_id) }

      it 'renders the subject' do
        expect(mail.subject).to eq('New Record Published in Metadata Management Tool')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.nasa.gov'])
      end

      it 'renders the new record published notice' do
        expect(mail.html_part.body).to have_content("#{user[:name]},\nYour collection metadata record has been successfully published to the CMR.")
        expect(mail.text_part.body).to have_content("#{user[:name]},\nYour collection metadata record has been successfully published to the CMR.")
      end

      it 'renders the concept id' do
        expect(mail.html_part.body).to have_content(concept_id)
        expect(mail.text_part.body).to have_content(concept_id)
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('View Collection', href: collection_url(concept_id, revision_id: revision_id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_url(concept_id, revision_id: revision_id))
      end
    end

    context 'when publishing an update' do
      concept_id = 'C1200000059-LARC'
      revision_id = 3
      let(:mail) { described_class.draft_published_notification(user, concept_id, revision_id) }

      it 'renders the subject' do
        expect(mail.subject).to eq('Record Updated in Metadata Management Tool')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.nasa.gov'])
      end

      it 'renders the record updated notice' do
        expect(mail.html_part.body).to have_content("#{user[:name]},\nYour collection metadata record has been successfully updated.")
        expect(mail.text_part.body).to have_content("#{user[:name]},\nYour collection metadata record has been successfully updated.")
      end

      it 'renders the concept id' do
        expect(mail.html_part.body).to have_content(concept_id)
        expect(mail.text_part.body).to have_content(concept_id)
      end

      it 'renders the link to the collection' do
        expect(mail.html_part.body).to have_link('View Collection', href: collection_url(concept_id, revision_id: revision_id))
        # link renders as text in text format email
        expect(mail.text_part.body).to have_content(collection_url(concept_id, revision_id: revision_id))
      end
    end
  end
end

require 'rails_helper'

describe DraftMailer do
  context 'draft_published_notification' do
    user = { name: 'Captain Planet', email: 'supergreen@bluemarble.com' }

    context 'when publishing a new record' do
      concept_id = 'C1200000007-SEDAC'
      revision_id = 1
      short_name = 'CIESIN_SEDAC_EPI_2010'
      version = 2010
      let(:mail) { described_class.draft_published_notification(user, concept_id, revision_id, short_name, version) }

      it 'renders the subject' do
        expect(mail.subject).to eq('New Record Published in Metadata Management Tool')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
      end

      it 'renders the new record published notice including short name + version' do
        expect(mail.html_part.body).to have_content("#{@short_name}_#{@version} Published")
        expect(mail.html_part.body).to have_content("#{user[:name]},\nYour collection metadata #{@short_name}_#{@version} record has been successfully published to the CMR.")
        expect(mail.text_part.body).to have_content("#{user[:name]},\nYour collection metadata #{@short_name}_#{@version} record has been successfully published to the CMR.")
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
      short_name = 'AE_5DSno'
      version = 1
      let(:mail) { described_class.draft_published_notification(user, concept_id, revision_id, short_name, version) }

      it 'renders the subject' do
        expect(mail.subject).to eq('Record Updated in Metadata Management Tool')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([user[:email]])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
      end

      it 'renders the record updated notice' do
        expect(mail.html_part.body).to have_content("#{@short_name}_#{@version} Updated")
        expect(mail.html_part.body).to have_content("#{user[:name]},\nYour collection metadata record #{@short_name}_#{@version} has been successfully updated.")
        expect(mail.text_part.body).to have_content("#{user[:name]},\nYour collection metadata record #{@short_name}_#{@version} has been successfully updated.")
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

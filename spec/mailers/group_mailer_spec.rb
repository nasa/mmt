describe GroupMailer do
  context 'invite_user' do
    let(:invite) { create(:user_invite) }
    let(:mail) { described_class.invite_user(invite).deliver_now }

    it 'renders the subject' do
      expect(mail.subject).to eq('Metadata Management Tool Invitation')
    end

    it 'renders the receiver email' do
      expect(mail.to).to eq([invite.user_email])
    end

    it 'renders the sender email' do
      expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
    end

    it 'assigns @invite' do
      expect(mail.html_part.body.encoded).to match("#{invite.user_first_name}, #{invite.manager_name} from #{invite.provider}")
      expect(mail.text_part.body.encoded).to match("#{invite.user_first_name}, #{invite.manager_name} from #{invite.provider}")
    end
  end

  context 'notify_manager' do
    context 'with added' do
      let(:invite) { create(:user_invite_with_group) }
      let(:mail) { described_class.notify_manager(invite, true).deliver_now }

      it 'renders the subject' do
        expect(mail.subject).to eq('Metadata Management Tool Invitation Accepted')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([invite.manager_email])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
      end

      it 'assigns @invite' do
        expect(mail.html_part.body.encoded).to match("#{invite.user_first_name + ' ' + invite.user_last_name} has authorized MMT to acces their Earthdata Login profile.")
        expect(mail.text_part.body.encoded).to match("#{invite.user_first_name + ' ' + invite.user_last_name} has authorized MMT to acces their Earthdata Login profile.")
      end

      it 'assigns @added' do
        expect(mail.html_part.body.encoded).to match("For your convenience, #{invite.user_first_name} has been added to #{invite.group_name}")
        expect(mail.text_part.body.encoded).to match("For your convenience, #{invite.user_first_name} has been added to #{invite.group_name}")
      end

      it 'renders the group link' do
        expect(mail.html_part.body).to have_link('View Group', href: group_url(invite.group_id))
        expect(mail.text_part.body).to have_content(group_url(invite.group_id))
      end
    end

    context 'without added' do
      let(:invite) { create(:user_invite) }
      let(:mail) { described_class.notify_manager(invite, false).deliver_now }

      it 'renders the subject' do
        expect(mail.subject).to eq('Metadata Management Tool Invitation Accepted')
      end

      it 'renders the receiver email' do
        expect(mail.to).to eq([invite.manager_email])
      end

      it 'renders the sender email' do
        expect(mail.from).to eq(['no-reply@mmt.earthdata.nasa.gov'])
      end

      it 'assigns @invite' do
        expect(mail.html_part.body.encoded).to match("#{invite.user_first_name + ' ' + invite.user_last_name} has authorized MMT to acces their Earthdata Login profile.")
        expect(mail.text_part.body.encoded).to match("#{invite.user_first_name + ' ' + invite.user_last_name} has authorized MMT to acces their Earthdata Login profile.")
      end

      it 'assigns @added' do
        expect(mail.html_part.body.encoded).to match("#{invite.user_first_name} may now be added to groups without the need to invite them again.")
        expect(mail.text_part.body.encoded).to match("#{invite.user_first_name} may now be added to groups without the need to invite them again.")
      end
    end
  end
end

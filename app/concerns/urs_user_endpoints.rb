# Controller methods that allows developers to get this data without
# making an HTTP request (with the exception of the URS call)
module UrsUserEndpoints
  extend ActiveSupport::Concern

  def urs_user_full_name(user)
    [user['first_name'], user['last_name']].compact.join(' ')
  end

  def render_users_from_urs(users)
    users.map do |u|
      {
        id: html_escape(u['uid']),
        text: ActionView::Base.full_sanitizer.sanitize(urs_user_full_name(u))
      }
    end
  end

  def search_urs(query)
    # searches for users from urs with all available attributes
    # uid, first_name, last_name, and email_address along with others we dont usually use
    return [] if query.blank?

    urs_response = cmr_client.search_urs_users(query)

    if urs_response.success?
      urs_response.body['users'] || []
    else
      []
    end
  end

  def retrieve_urs_users(uids)
    # retrieves users from urs with all available attributes
    # uid, first_name, last_name, and email_address along with others we dont usually use
    return [] if uids.reject(&:nil?).blank?

    users_response = cmr_client.get_urs_users(uids)

    if users_response.success?
      users_response.body.fetch('users', [])
    else
      []
    end
  end
end

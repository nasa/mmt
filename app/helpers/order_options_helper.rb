module OrderOptionsHelper

  # Searches though the error object returned from ECHO
  def get_login_error(body_hash)
    err_msg = nil
    err_obj = body_hash['Envelope']['Body']['Fault']['detail']

    if ! err_obj.nil?
      if ! err_obj['AuthorizationFault'].nil?
        err_msg = err_obj['AuthorizationFault']['SystemMessage']
      elsif ! err_obj['InvalidArgumentFault'].nil?
        err_msg = err_obj['InvalidArgumentFault']['SystemMessage']
      else
        err_msg = 'An unknown error has occurred.'
      end
    end
    err_msg
  end

end
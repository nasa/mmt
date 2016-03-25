# setup provider data here?

$(document).ready ->

  providersSource = new Bloodhound
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: providers

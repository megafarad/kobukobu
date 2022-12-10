# frozen_string_literal: true

class DictionaryService::Dictionary < DictionaryService

  def initialize(base_url)
    super()
    @base_url = base_url
  end

  def lookup(word)
    request(word).perform do |res|
      case res.code
      when 429
        raise TooManyRequestsError
      when 403
        raise QuotaExceededError
      when 200...300
        transform_response(res.body_with_limit(8.megabytes))
      else
        raise UnexpectedResponseError
      end
    end

  end

  def request(word)
    req = Request.new(:get, "#{@base_url}/api/search/#{word}")
    req.add_headers('Content-Type': 'application/json')
    req
  end

  def transform_response(str)
    json = Oj.load(str, mode: :strict)

    raise UnexpectedResponseError unless json.is_a?(Array)

    json
  end
end

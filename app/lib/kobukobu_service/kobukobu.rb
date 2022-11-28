# frozen_string_literal: true

class KobukobuService::Kobukobu < KobukobuService
  def initialize(base_url)
    super()
    @base_url = base_url
  end

  def parse(text, source_language)
    request(text, source_language).perform do |res|
      case res.code
      when 429
        raise TooManyRequestsError
      when 403
        raise QuotaExceededError
      when 200...300
        transform_response(res.body_with_limit)
      else
        raise UnexpectedResponseError
      end
    end
  end

  private

  def request(text, source_language)
    body = Oj.dump(language: source_language.presence || 'auto', text: text)
    req = Request.new(:post, "#{@base_url}/api/parse", body: body)
    req.add_headers('Content-Type': 'application/json')
    req
  end

  def transform_response(str)
    json = Oj.load(str, mode: :strict)

    raise UnexpectedResponseError unless json.is_a?(Hash)

    json
  rescue Oj::ParseError
    raise UnexpectedResponseError
  end
end

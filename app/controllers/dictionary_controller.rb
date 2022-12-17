# frozen_string_literal: true

class DictionaryController < ApplicationController
  before_action :set_search_results

  rescue_from DictionaryService::NotConfiguredError, with: :not_found
  rescue_from DictionaryService::UnexpectedResponseError, DictionaryService::QuotaExceededError, DictionaryService::TooManyRequestsError, with: :service_unavailable
  def lookup
    render json: @search_results
  end

  def set_search_results
    @search_results = DictionaryService.configured.lookup(params[:word])
  end
end

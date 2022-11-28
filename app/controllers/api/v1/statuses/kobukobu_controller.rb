# frozen_string_literal: true

class Api::V1::Statuses::KobukobuController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read, :'read:statuses' }
  before_action :set_status
  before_action :set_kobukobu

  rescue_from KobukobuService::NotConfiguredError, with: :not_found
  rescue_from KobukobuService::UnexpectedResponseError, KobukobuService::QuotaExceededError, KobukobuService::TooManyRequestsError, with: :service_unavailable

  def create
    render json: @kobukobu
  end

  def set_status
    @status = Status.find(params[:status_id])
    authorize @status, :show
  rescue Mastodon::NotPermittedError
    not_found
  end

  def set_kobukobu
    @kobukobu = KobukobuStatusService.new.call(@status)
  end
end

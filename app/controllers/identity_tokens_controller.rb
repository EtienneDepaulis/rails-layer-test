class IdentityTokensController < ApplicationController

  def create
    render json: {identity_token: current_user.generate_identity_token(identity_token_params[:nonce]) }
  end

  private

    def identity_token_params
      params.permit(:app_id, :user_id, :nonce)
    end

end

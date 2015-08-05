class UsersController < ApplicationController

  def create
    render json: {identity_token: current_user.identity_token }
  end

  private

    def identity_token_params
      params.permit(:app_id, :user_id, :nonce)
    end

end

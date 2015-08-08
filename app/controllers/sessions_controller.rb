class SessionsController < ApplicationController

  def create
    session[:user_id] = params[:user_id]

    redirect_to root_url
  end

end

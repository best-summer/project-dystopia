class ResultsController < ApplicationController
  # GET /users/:name/results
  def show
    p params
    @user = User.find_by(device_id: params[:device_id])
    if @user.authenticate_only_login_key?(params)
      render 'show', formats: 'json'
    else
      render json: {status: 'ng', message: 'Wrong login key'}
    end
  end

  #  PATCH /users/:name/result?login_key
  # ユーザのステータス更新を行う
  def update
    p params[:device_id]
    @user = User.find_by(device_id: params[:device_id])
    for param in params[:result]
      if param == 'login_key'
        next
      end
      # TODO: あとでモデルに移動
      if params[:result][param] == 'win'
        @user['win_count'] += 1
        next
      elsif params[:result][param] == 'lose'
        @user['lose_count'] += 1
        next
      end
      @user[param] = params[:result][param]
    end

    if @user.authenticate_only_login_key?(params) && @user.save
      render 'update', formats: 'json'
    else
      render json: {status: 'ng', message: 'Wrong login key'}
    end
  end
end

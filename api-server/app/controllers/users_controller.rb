class UsersController < ApplicationController
  # /users
  # 全ユーザの情報を表示する。更新日時はうっとうしいので除外。デバッグ用
  def index
    @users = User.all.as_json(except: ['updated_at', 'created_at'])
    render json: @users
  end

  # GET /users/:device_id/status?login_key
  # ユーザのステータスを表示する
  def show
    @user = User.find_by(device_id: params[:device_id])
    if @user.nil?
      render json: {status: 'ng', message: 'Such a name is not exit'}
      return
    end
    if @user.authenticate_only_login_key?(params)
      render 'show', formats: 'json'
    else
      render json: {status: 'ng', message: 'Wrong login key'}
    end
  end

  #  PATCH /users/:device_id/status?login_key
  # ユーザの装備ステータスを更新する
  def update
    @user = User.find_by(device_id: params[:device_id])

    if @user.authenticate_only_login_key?(params) && @user.save
      render 'update', formats: 'json'
    elsif ! @user.authenticate_only_login_key?(params)
      render json: {status: 'ng', message: 'Wrong login key'}
    elsif ! @user.save
      render json: {status: 'ng', message: 'Wrong parameter'}
    end
  end

  #  POST /signup
  # ユーザの登録を行う
  def create
    @user = User.new(user_params)
    @user.create_login_key
    if @user.save
      render 'create', formats: 'json'
    else
      render json: {status: 'ng', message: 'user_id or device_id is duplicated'}
    end
  end

  def destroy
    @user.destroy
  end

  private
    def user_params
      params.require(:user).permit(:name, :device_id)
    end
end


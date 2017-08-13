class UsersController < ApplicationController
  # /users
  # ユーザをスコアが大きい順に表示する
  def index
    @users = User.all.order('score desc')
    render 'index', formats: 'json'
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
  # ユーザの装備ステータスを更新する(使用しなさそうなので廃止予定)
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
      render json: {status: 'ng', massage: 'user_id or device_id is duplicated'}
    end
  end

  def destroy
    @user.destroy
  end

  # POST /debug
  # ユーザの全情報を表示する
  def debug
    @users = User.all.order(:id)
    render 'debug', formats: 'json'
  end

  private
    def user_params
      params.require(:user).permit(:name, :device_id)
    end
end


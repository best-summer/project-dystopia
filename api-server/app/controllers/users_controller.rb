class UsersController < ApplicationController
  # /users
  # 全ユーザの情報を表示する。更新日時はうっとうしいので除外。デバッグ用
  def index
    @users = User.all.as_json(except: ['updated_at', 'created_at'])
    render json: @users
  end

  # GET /users/:name/status?login_key
  # ユーザのステータスを表示する
  def show
    @user = User.find_by(name: params[:name])
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

  #  PATCH /users/:name/status?login_key
  # ユーザの装備ステータスを更新する
  def update
    @user = User.find_by(name: params[:name])
    for param in params[:user]
      next if param != 'equipment1' or param!= 'equipment2'
    end

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
    @user = User.new(name: params[:name], device_id: params[:device_id])
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

  def user_params
    params.require(:user).permit(:name, :score, :billing,
                                 :win_count, :lose_count,
                                 :summer_vacation_days, :login_key)
  end
end


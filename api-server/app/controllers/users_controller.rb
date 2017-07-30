class UsersController < ApplicationController
  # /users
  # 全ユーザの情報を表示する
  def index
    @users = User.all.as_json
    render json: @users
  end

  # GET /users/:name/status
  # 各ユーザのステータスを表示する
  def show
    p params
    @user = User.find_by(name: params[:name])
    if @user.authenticate_only_login_key?(params)
      render json: @user.as_json(only:[:name, :score, :win_count, :lose_count,
                                        :summer_vacation_days])
    else
      render :nothing => true, status: :unprocessable_entity
    end
  end

  #  PATCH /users/:name/status
  # ユーザのステータス更新を行う
  def update_show
    p params
    @user = User.find_by(name: params[:name])
    if @user.authenticate_only_login_key?(params)
        @user.attributes = {:score => params[:score], :win_count => params[:win_count],
                            :lose_count => params[:lose_count],
                            :summer_vacation_days => params[:summer_vacation_days]}
      @user.save
      render json: @user.as_json(only:[:name, :score, :win_count, :lose_count,
                                       :summer_vacation_days])
    else
      render :nothing => true, status: :unprocessable_entity
    end
  end

  #  POST /signup
  # ユーザの登録を行う
  def create
    @user = User.new(name: params[:name], device_id: params[:device_id])
    @user.create_login_key
    if @user.save
      render json: @user.as_json(only:[:login_key]), status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH /signup/?device_id&login_key
  # ユーザ名の変更を行う
  def update
    unless @user = User.find_by(device_id: params[:device_id])
      render :nothing => true, status: :unprocessable_entity
      return
    end
    if @user.authenticate?(params)
      @user.update_attribute(:name,params[:name])
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end
end

